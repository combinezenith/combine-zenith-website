from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = FastAPI()

# Allow all origins (for local + frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def root():
    return {"message": "Combine Zenith AI Agent Backend is live!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Combine Zenith AI Agent"}

@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        # Check if message is provided
        if not req.message or req.message.strip() == "":
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        model = genai.GenerativeModel("models/gemini-2.0-flash")
        
        # Enhanced system prompt for Combine Zenith digital marketing
        system_prompt = """You are a professional digital marketing expert AI assistant for Combine Zenith. 

Key Services: Digital Strategy, SEO & SEM, Social Media Marketing, Content Creation, Brand Identity, Web Development.

Response Guidelines:
- Be professional and helpful
- Focus on digital marketing solutions
- Keep responses concise (2-4 sentences)
- Highlight business growth and ROI
- Redirect unrelated questions to marketing topics

Tone: Professional, knowledgeable, client-focused."""

        full_prompt = f"{system_prompt}\n\nUser: {req.message}\nAssistant:"
        
        response = model.generate_content(full_prompt)

        return {"response": response.text}

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Add this to handle preflight OPTIONS requests
@app.options("/api/chat")
async def options_chat():
    return {"message": "OK"}