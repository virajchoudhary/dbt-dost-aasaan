import os
import pickle
import math
from typing import List, Dict, Any, Optional
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# ---- Config ----
GEMINI_MODEL = "gemini-1.5-flash" # Using gemini for generative tasks
EMBED_MODEL = "models/embedding-001"
TOP_K = 5
SIM_THRESHOLD = 0.25

# ---- Environment and API Setup ----
load_dotenv() # Loads variables from .env file
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in .env file. The application may not function.")
else:
    genai.configure(api_key=GEMINI_API_KEY)

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Load KB (.pkl) ----
PICKLE_PATH = "dbt_index.pkl"

def _normalize_record(r: Any) -> str:
    if isinstance(r, str): return r
    if isinstance(r, dict):
        for k in ["text", "content", "body", "clause", "section"]:
            if k in r and isinstance(r[k], str) and r[k].strip():
                return r[k]
        return "\n".join(v for v in r.values() if isinstance(v, str))
    return str(r)

try:
    with open(PICKLE_PATH, "rb") as f:
        KB_RAW = pickle.load(f)
    DOCS: List[str] = [_normalize_record(r) for r in (KB_RAW if isinstance(KB_RAW, list) else [KB_RAW]) if _normalize_record(r).strip()]
except FileNotFoundError:
    print(f"Error: Pickle file not found at {PICKLE_PATH}")
    DOCS = []


# ---- Embeddings and Search ----
DOC_EMB = None
if DOCS and GEMINI_API_KEY:
    try:
        resp = genai.embed_content(model=EMBED_MODEL, content=DOCS, task_type="RETRIEVAL_DOCUMENT")
        DOC_EMB = np.array(resp['embedding'], dtype=np.float32)
    except Exception as e:
        print(f"Error creating document embeddings: {e}")

def top_k(query: str, k: int = TOP_K):
    if DOC_EMB is None or DOC_EMB.size == 0: return []
    try:
        query_embedding_result = genai.embed_content(model=EMBED_MODEL, content=[query], task_type="RETRIEVAL_QUERY")
        qv = np.array(query_embedding_result['embedding'][0], dtype=np.float32)
        sims = np.dot(DOC_EMB, qv)
        idx = np.argsort(-sims)[:k]
        return [(DOCS[i], float(sims[i])) for i in idx]
    except Exception as e:
        print(f"Error during top_k search: {e}")
        return []

def in_domain(msg: str) -> bool:
    return any(kw in msg.lower() for kw in DOMAIN_KEYWORDS)

class ChatReq(BaseModel):
    message: str
    language: Optional[str] = "hi"

class ChatResp(BaseModel):
    answer: str

@app.post("/chat", response_model=ChatResp)
def chat(req: ChatReq):
    user_msg = (req.message or "").strip()
    if not user_msg:
        raise HTTPException(status_code=400, detail="Empty message")
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured")

    candidates = top_k(user_msg, TOP_K)
    best_sim = candidates[0][1] if candidates else 0.0
    if not in_domain(user_msg) and best_sim < SIM_THRESHOLD:
        return ChatResp(answer=DEFAULT_REFUSAL_EN if req.language == "en" else DEFAULT_REFUSAL_HI)

    context = "\n\n---\n\n".join(f"[Context score={score:.2f}]\n{text}" for text, score in candidates if score >= SIM_THRESHOLD) or "No highly relevant context found."
    
    # Select prompts based on language
    is_english = req.language == "en"
    system_rules = DEFAULT_REFUSAL_EN if is_english else DEFAULT_REFUSAL_HI
    instructions = "Answer in English based on the context." if is_english else "दिए गए संदर्भ के आधार पर हिंदी में उत्तर दें।"
    no_answer_fallback = "Sorry, I couldn't find an answer in the provided documents." if is_english else "माफ़ कीजिए, मुझे दिए गए दस्तावेज़ों में कोई उत्तर नहीं मिला।"

    prompt = f"{system_rules}\n\nContext:\n{context}\n\nUser question:\n{user_msg}\n\nInstruction: {instructions}"

    try:
        model = genai.GenerativeModel(model_name=GEMINI_MODEL)
        resp = model.generate_content(contents=prompt)
        answer = (resp.text or "").strip() or no_answer_fallback
    except Exception as e:
        print(f"Error during Gemini API call: {e}")
        answer = no_answer_fallback
        
    return ChatResp(answer=answer)

