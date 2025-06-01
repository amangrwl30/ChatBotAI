from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))

message = client.messages.create(
    body="Hello Aman! This is a test SMS from your AI re-engagement demo 🎯",
    from_=os.getenv("TWILIO_FROM_NUMBER"),
    to=os.getenv("TO_NUMBER")
)

print(message.sid)
