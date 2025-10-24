# api_server.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from dotenv import load_dotenv
import os
from agents import Agent, OpenAIChatCompletionsModel, Runner  # from your existing code

load_dotenv()

app = FastAPI()

# Allow Next.js frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    message = data.get("message", "")

    agent = Agent(
        name="TerraAI Assistant",
        instructions="You are a helpful AI assistant for the Terra AI farming platform.",
        model=OpenAIChatCompletionsModel(
            model="gemini-2.0-flash",
            openai_client=client
        ),
    )

    result = await Runner.run(agent, message)
    return {"response": result.final_output}
