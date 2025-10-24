from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import google.generativeai as genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API key - with fallback
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBoS-XQy7UhJc8tYXQ-TrpOf_FWP_wg6gs")
genai.configure(api_key=GEMINI_API_KEY)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {"message": "Combine Zenith AI Agent Backend is live!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Combine Zenith AI Agent"}

@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        if not req.message or req.message.strip() == "":
            return {"response": "Message cannot be empty"}
        
        model = genai.GenerativeModel("models/gemini-2.0-flash")
        
        system_prompt = "You are a digital marketing expert for Combine Zenith. Be professional and helpful."
        full_prompt = f"{system_prompt}\n\nUser: {req.message}\nAssistant:"
        
        response = model.generate_content(full_prompt)
        return {"response": response.text}

    except Exception as e:
        return {"response": f"Error: {str(e)}"}

@app.options("/api/chat")
async def options_chat():
    return {"message": "OK"}