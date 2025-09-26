import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import logging

# --- Initial Setup & Configuration ---
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="DBT Dost AI Backend", version="1.0.0")

# Add CORS middleware for better API compatibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure the Gemini API
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
    logger.info("Gemini API configured successfully")
except Exception as e:
    logger.error(f"Error configuring Gemini API: {e}")
    model = None

# --- Pydantic Models for Request and Response ---
class QueryRequest(BaseModel):
    query: str
    knowledge_base: str

class AnswerResponse(BaseModel):
    answer: str
    success: bool = True
    error: str = None

# --- System Prompt for the AI Model ---
SYSTEM_PROMPT = """
You are a helpful AI assistant for the DBT Dost Helpdesk, designed to help users with:
- Direct Benefit Transfer (DBT) information
- National Scholarship Portal (NSP) processes  
- Aadhaar seeding and bank account linking

IMPORTANT INSTRUCTIONS:
1. Answer questions based ONLY on the provided knowledge base text
2. Give direct, helpful answers from the available information
3. Keep answers clear, concise and user-friendly
4. If you cannot find the exact answer, say "I don't have specific information about this in my current knowledge base. Please contact the support team."
5. Never say the question is "out of scope" - always try to help based on available information
6. Format your response clearly with proper spacing when listing steps or processes

Answer the user's question directly and helpfully based on the knowledge base provided.
"""

# --- API Endpoints ---
@app.get("/")
async def root():
    """Root endpoint to check if API is running"""
    return {
        "message": "DBT Dost AI Backend is running",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    model_status = "configured" if model else "not configured"
    return {
        "status": "healthy",
        "gemini_model": model_status,
        "api_version": "1.0.0"
    }

@app.post("/generate-answer", response_model=AnswerResponse)
async def generate_answer(request: QueryRequest):
    """Generate answer using Gemini AI based on knowledge base"""
    
    if not model:
        logger.error("Gemini model is not configured")
        raise HTTPException(
            status_code=500, 
            detail="AI model is not configured. Please check the API key configuration."
        )
    
    if not request.query.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )
    
    if not request.knowledge_base.strip():
        logger.warning("Knowledge base is empty")
        return AnswerResponse(
            answer="I don't have access to the knowledge base right now. Please try again later or contact support.",
            success=False,
            error="Knowledge base is empty"
        )
    
    try:
        logger.info(f"Processing query: {request.query[:100]}...")
        
        # Combine the system prompt, knowledge base, and user query
        full_prompt = f"""{SYSTEM_PROMPT}

--- Knowledge Base Text ---
{request.knowledge_base}

--- User's Question ---
{request.query}

Please provide a helpful and accurate answer based on the knowledge base above."""

        # Generate content using the Gemini model
        response = model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                candidate_count=1,
                max_output_tokens=800,
                temperature=0.2,  # Slightly higher for more natural responses
            )
        )
        
        # Extract and clean the generated text
        generated_answer = response.text.strip()
        
        if not generated_answer:
            logger.warning("Empty response from Gemini model")
            return AnswerResponse(
                answer="I'm sorry, I couldn't generate an answer right now. Please try rephrasing your question or contact support.",
                success=False,
                error="Empty response from AI model"
            )
        
        logger.info(f"Successfully generated answer: {generated_answer[:100]}...")
        return AnswerResponse(answer=generated_answer, success=True)
        
    except Exception as e:
        logger.error(f"Error during API call: {e}")
        error_message = "I'm experiencing technical difficulties right now. Please try again in a moment or contact support if the issue persists."
        
        # Return a user-friendly error response instead of raising HTTPException
        return AnswerResponse(
            answer=error_message,
            success=False,
            error=str(e)
        )

# --- Test Endpoint for Development ---
@app.post("/test-connection")
async def test_connection():
    """Test endpoint to verify Gemini API connection"""
    if not model:
        raise HTTPException(status_code=500, detail="Gemini model is not configured")
    
    try:
        test_prompt = "Say 'Hello, I am working correctly!' if you can read this."
        response = model.generate_content(test_prompt)
        return {
            "status": "success",
            "response": response.text.strip(),
            "message": "Gemini API is working correctly"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API test failed: {str(e)}")

# --- Main Execution Block ---
#if __name__ == "__main__":
   # import uvicorn
   # logger.info("Starting DBT Dost AI Backend...")
   # uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")