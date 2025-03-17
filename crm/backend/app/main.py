from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
import openai
from agora_token_builder import RtcTokenBuilder
import uuid
import json

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Configure Agora
AGORA_APP_ID = os.getenv("AGORA_APP_ID")
AGORA_APP_CERTIFICATE = os.getenv("AGORA_APP_CERTIFICATE")

class ChatMessage(BaseModel):
    message: str
    type: str = "text"  # "text" or "audio"

@app.get("/")
async def read_root():
    return {"message": "Voice Chat Bot API"}

@app.post("/chat")
async def chat(chat_message: ChatMessage):
    try:
        # Process the message with OpenAI
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": chat_message.message}
            ]
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/generate-token")
async def generate_token(channel_name: Optional[str] = None):
    if not channel_name:
        channel_name = str(uuid.uuid4())
    
    # Generate token for Agora
    expiration_time_in_seconds = 3600
    current_timestamp = 0
    token = RtcTokenBuilder.buildTokenWithUid(
        AGORA_APP_ID,
        AGORA_APP_CERTIFICATE,
        channel_name,
        0,  # uid
        1,  # role
        expiration_time_in_seconds
    )
    
    return {
        "token": token,
        "appId": AGORA_APP_ID,
        "channel": channel_name
    }

# WebSocket connection for real-time communication
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Process the received data (could be text or audio)
            message = json.loads(data)
            
            # Process with OpenAI and send response back
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": message.get("content", "")}
                ]
            )
            
            await websocket.send_text(json.dumps({
                "response": response.choices[0].message.content
            }))
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close() 