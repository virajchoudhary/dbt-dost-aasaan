# main.py
import os
import pickle
import math
from typing import List, Dict, Any, Optional
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types

# ---- Config ----
GEMINI_MODEL = "gemini-2.5-flash"  # fast, per quickstart
EMBED_MODEL = "gemini-embedding-001"  # embeddings doc
TOP_K = 5
SIM_THRESHOLD = 0.25  # tune with real data

# Restrict to Aadhaar/DBT topics only
DOMAIN_KEYWORDS = {
    "dbt", "direct benefit transfer", "benefit transfer", "subsidy",
    "aadhaar", "aadhar", "uid", "uidai", "bank seeding", "npcI mapper",
    "nsp", "national scholarship portal", "scholarship", "kyc", "aeps",
    "mgNREGA", "pension", "lpg", "bank linking", "seeding", "aeps"
}

DEFAULT_REFUSAL_EN = (
    "I can only help with Aadhaar and DBT related questions. "
    "Please ask about topics like DBT, Aadhaar linking, NSP scholarships, or bank seeding."
)

DEFAULT_REFUSAL_HI = (
    "मैं केवल Aadhaar और DBT संबंधी प्रश्नों में मदद कर सकता हूं। "
    "कृपया DBT, Aadhaar linking, NSP scholarships, या bank seeding के बारे में पूछें।"
)

# ---- App ----
app = FastAPI()

# Allow dev origins (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://127.0.0.1:5500", 
        "http://localhost",
        "http://172.28.253.228:8081",
        "http://172.28.253.228:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Load KB (.pkl) ----
# IMPORTANT: Only unpickle trusted, locally curated data.
PICKLE_PATH = os.environ.get("DBT_PKL_PATH", "dbt_index.pkl")

def _normalize_record(r: Any) -> str:
    # Accept a variety of pickle formats (list[str], list[dict], etc.)
    if isinstance(r, str):
        return r
    if isinstance(r, dict):
        # Prefer richer fields if present
        for k in ["text", "content", "body", "clause", "section"]:
            if k in r and isinstance(r[k], str) and r[k].strip():
                return r[k]
        # Fallback: join string-like values
        parts = []
        for v in r.values():
            if isinstance(v, str):
                parts.append(v)
        return "\n".join(parts)
    return str(r)

with open(PICKLE_PATH, "rb") as f:
    KB_RAW = pickle.load(f)

DOCS: List[str] = [_normalize_record(r) for r in (KB_RAW if isinstance(KB_RAW, list) else [KB_RAW]) if _normalize_record(r).strip()]

# ---- Build embeddings index ----
client = genai.Client()  # GEMINI_API_KEY is read from env as per SDK quickstart

def embed_texts(texts: List[str], task_type: str = "RETRIEVAL_DOCUMENT") -> np.ndarray:
    # Batch with the new embed_content API
    resp = client.models.embed_content(
        model=EMBED_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type)
    )
    vectors = []
    for e in resp.embeddings:
        v = np.array(e.values, dtype=np.float32)
        # Normalize for cosine similarity if not already
        norm = np.linalg.norm(v)
        vectors.append(v / norm if norm > 0 else v)
    return np.vstack(vectors)

DOC_EMB = embed_texts(DOCS, task_type="RETRIEVAL_DOCUMENT")

def cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    # With normalized vectors, cosine is dot product
    return float(np.dot(a, b))

def top_k(query: str, k: int = TOP_K):
    qv = embed_texts([query], task_type="RETRIEVAL_QUERY")[0]
    sims = DOC_EMB @ qv  # vectorized cosine with normalized vectors
    idx = np.argsort(-sims)[:k]
    return [(DOCS[i], float(sims[i])) for i in idx]

def in_domain(msg: str) -> bool:
    lm = msg.lower()
    return any(kw in lm for kw in DOMAIN_KEYWORDS)

class ChatReq(BaseModel):
    message: str
    language: Optional[str] = "hi" 

class ChatResp(BaseModel):
    answer: str

@app.post("/chat", response_model=ChatResp)
def chat(req: ChatReq):
    user_msg = (req.message or "").strip()
    lang = (req.language or "hi").lower()
    if not user_msg:
        raise HTTPException(status_code=400, detail="Empty message")

    # Domain gate
    candidates = top_k(user_msg, TOP_K)
    best_sim = candidates[0][1] if candidates else 0.0
    if not in_domain(user_msg) and best_sim < SIM_THRESHOLD:
        return ChatResp(answer=DEFAULT_REFUSAL_EN if lang == "en" else DEFAULT_REFUSAL_HI)

    # Build grounded context
    context_blocks = []
    for text, score in candidates:
        if score < SIM_THRESHOLD:
            continue
        context_blocks.append(f"[Context score={score:.2f}]\n{text}")

    context_text = "\n\n---\n\n".join(context_blocks[:TOP_K]) or "No highly relevant context found."

    # Language-specific system rules and instructions
    if lang == "en":
        system_rules = (
            "You are a helpful assistant that ONLY answers questions about Aadhaar, DBT (Direct Benefit Transfer), "
            "NSP scholarships, bank seeding, NPCI mapper, KYC/AePS, and closely-related beneficiary payment processes in India. "
            "If the user asks about anything else, politely refuse and redirect them to these topics. "
            "CRITICAL: You MUST respond ONLY in English. Never use Hindi words or phrases. "
            "If the reference context contains Hindi text, translate it to English before answering. "
            "Write in simple, clear English that anyone can understand. "
            "Never request or store full Aadhaar numbers; if any Aadhaar is shown, mask it as xxxx-xxxx-1234."
        )
        instructions = (
            "- Answer strictly from the provided context where possible; if unclear, say so and suggest checking official portals.\n"
            "- Respond ONLY in English - no Hindi words or phrases allowed.\n"
            "- If context is in Hindi, translate it to English in your answer.\n"
            "- If user's question is in Hindi, answer in English.\n"
            "- Keep within Aadhaar/DBT/NSP/bank seeding scope only.\n"
            "- Mask Aadhaar numbers as xxxx-xxxx-1234 if present.\n"
        )
        no_answer_fallback = "Sorry, I couldn't generate a proper answer from the available context. Please check official government portals for more information."
    else:
        system_rules = (
            "आप एक सहायक हैं जो केवल Aadhaar, DBT (Direct Benefit Transfer), NSP स्कॉलरशिप्स, "
            "बैंक सीडिंग, NPCI मैपर, KYC/AePS, और भारत में लाभार्थी भुगतान प्रक्रियाओं के बारे में प्रश्नों के उत्तर देते हैं। "
            "अगर उपयोगकर्ता कोई अन्य विषय पूछे तो विनम्रता से मना करें और इन्हीं विषयों की ओर निर्देशित करें। "
            "महत्वपूर्ण: आपको केवल हिंदी में उत्तर देना है। अंग्रेजी के शब्द या वाक्य का उपयोग न करें। "
            "अगर संदर्भ में अंग्रेजी का टेक्स्ट है तो उसका हिंदी में अनुवाद करके उत्तर दें। "
            "सरल, स्पष्ट हिंदी में लिखें जो सभी समझ सकें। "
            "कभी भी पूरा Aadhaar नंबर न मांगें; अगर कोई Aadhaar दिखे तो xxxx-xxxx-1234 की तरह मास्क करें।"
        )
        instructions = (
            "- जहां संभव हो, दिए गए संदर्भ से ही उत्तर दें; अगर स्पष्ट नहीं है तो हिंदी में कहें कि आधिकारिक पोर्टल देखें।\n"
            "- केवल हिंदी में उत्तर दें - कोई अंग्रेजी शब्द या वाक्य का उपयोग न करें।\n"
            "- अगर संदर्भ अंग्रेजी में है तो उसका हिंदी अनुवाद करके उत्तर दें।\n"
            "- अगर उपयोगकर्ता का प्रश्न अंग्रेजी में है तो हिंदी में उत्तर दें।\n"
            "- केवल Aadhaar/DBT/NSP/बैंक सीडिंग के दायरे में रहें।\n"
            "- Aadhaar नंबर को xxxx-xxxx-1234 की तरह मास्क करें।\n"
        )
        no_answer_fallback = "माफ़ कीजिए, उपलब्ध संदर्भ से उचित उत्तर नहीं दे पाया। कृपया अधिक जानकारी के लिए सरकारी पोर्टल देखें।"

    # Compose model input with system rules + retrieved context + user message
    prompt = (
        f"{system_rules}\n\n"
        f"Context (authoritative legal/policy text snippets):\n{context_text}\n\n"
        f"User question:\n{user_msg}\n\n"
        f"Instructions:\n{instructions}"
    )

    resp = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        # Optionally disable thinking to reduce latency/cost:
        # config=types.GenerateContentConfig(thinking_config=types.ThinkingConfig(thinking_budget=0))
    )
    answer = (resp.text or "").strip() if hasattr(resp, "text") else ""
    if not answer:
        answer = no_answer_fallback

    return ChatResp(answer=answer)
