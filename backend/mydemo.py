from twilio.rest import Client
from fastapi import FastAPI
from pydantic import BaseModel
import openai, os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

twilio_client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))

openai.api_key = os.getenv("OPENAI_API_KEY")

conversation_memory = {}

class MessageIn(BaseModel):
    lead_id: str
    message: str

@app.post("/send-initial")
def send_initial(lead_id: str, name: str):
    prompt = f"Generate a warm SMS to {name} who received a roofing quote but never booked. Offer a 10% discount."
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    ai_msg = response['choices'][0]['message']['content']

    conversation_memory[lead_id] = [{"role": "assistant", "content": ai_msg}]

    twilio_client.messages.create(
        body=ai_msg,
        from_=os.getenv("TWILIO_FROM_NUMBER"),
        to=os.getenv("TO_NUMBER")
    )
    return {"status": "sent", "message": ai_msg}

@app.post("/reply")
def handle_reply(msg: MessageIn):
    memory = conversation_memory.get(msg.lead_id, [])
    memory.append({"role": "user", "content": msg.message})

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You're a friendly assistant helping users book a roofing appointment."}
        ] + memory
    )
    reply = response['choices'][0]['message']['content']
    memory.append({"role": "assistant", "content": reply})
    conversation_memory[msg.lead_id] = memory

    twilio_client.messages.create(
        body=reply,
        from_=os.getenv("TWILIO_FROM_NUMBER"),
        to=os.getenv("TO_NUMBER")
    )
    return {"response": reply}
