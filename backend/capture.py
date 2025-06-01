from fastapi import APIRouter, Request, BackgroundTasks
from pydantic import BaseModel
from twilio.rest import Client
from dotenv import load_dotenv
from openai import OpenAI
import os
import asyncio
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()

# Twilio Setup
twilio_client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
FROM_PHONE = os.getenv("TWILIO_FROM_NUMBER")

# OpenAI Setup
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Email Setup
EMAIL_USER = os.getenv("EMAIL_USER", "hello@umbrellax.in")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")  # This should be an App Password from Gmail

router = APIRouter()

# In-memory store for demo (can be replaced with DB)
leads = {}

class Lead(BaseModel):
    name: str
    phone: str
    email: str

@router.post("/submit-lead")
async def submit_lead(lead: Lead, background_tasks: BackgroundTasks):
    # Generate AI welcome message
    prompt = f"You are an assistant for a gym. A lead named {lead.name} submitted a tour form. Send a friendly SMS to confirm and ask if they want to book for tomorrow or weekend."

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "system", "content": prompt}]
    )

    message = response.choices[0].message.content

    # Send SMS
    twilio_client.messages.create(
        to=lead.phone,
        from_=FROM_PHONE,
        body=message
    )

    # Store lead info
    leads[lead.phone] = {
        "name": lead.name,
        "phone": lead.phone,
        "email": lead.email,
        "message_time": datetime.utcnow(),
        "replied": False,
        "slot": None
    }

    # Schedule re-engagement in background
    background_tasks.add_task(check_and_reengage, lead.phone)

    return {"status": "Initial message sent"}

@router.post("/twilio-inbound")
async def receive_twilio_sms(request: Request):
    form_data = await request.form()
    phone = form_data.get("From")
    user_msg = form_data.get("Body", "").strip().lower()

    if phone not in leads:
        return "Unknown lead"

    lead = leads[phone]

    # Basic intent matching
    if "yes" in user_msg and lead.get("slot"):
        # Confirm booking
        try:
            send_confirmation_email(lead["email"], lead["name"], lead["slot"])
            twilio_client.messages.create(
                to=phone,
                from_=FROM_PHONE,
                body=f"Awesome! Your tour is confirmed for {lead['slot']}. A confirmation email has been sent to you."
            )
        except Exception as e:
            twilio_client.messages.create(
                to=phone,
                from_=FROM_PHONE,
                body=f"Your tour is confirmed for {lead['slot']}, but we couldn't send the confirmation email. Please save this message as confirmation."
            )
    elif "tomorrow" in user_msg:
        lead["slot"] = "6 PM tomorrow"
        twilio_client.messages.create(
            to=phone,
            from_=FROM_PHONE,
            body="Got it! How about 6 PM tomorrow? Reply 'Yes' to confirm."
        )
    elif "weekend" in user_msg:
        lead["slot"] = "11 AM Saturday"
        twilio_client.messages.create(
            to=phone,
            from_=FROM_PHONE,
            body="Great! Let's plan for 11 AM this Saturday. Reply 'Yes' to confirm."
        )
    else:
        # Default AI fallback using OpenAI
        prompt = f"The user said: '{user_msg}'. Continue the conversation to help schedule a tour."
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}]
        )
        reply = response.choices[0].message.content

        twilio_client.messages.create(
            to=phone,
            from_=FROM_PHONE,
            body=reply
        )

    # Mark as replied
    lead["replied"] = True
    return "OK"

async def check_and_reengage(phone):
    await asyncio.sleep(300)  # Wait 5 minutes
    lead = leads.get(phone)

    if lead and not lead["replied"]:
        follow_up_prompt = f"You are an AI assistant for a gym. The user {lead['name']} didn't reply to the tour SMS. Send a polite follow-up message asking if they're still interested."

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": follow_up_prompt}]
        )

        follow_up = response.choices[0].message.content

        twilio_client.messages.create(
            to=phone,
            from_=FROM_PHONE,
            body=follow_up
        )

def send_confirmation_email(to_email, name, time_slot):
    if not EMAIL_PASSWORD:
        raise ValueError("Email password not configured")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Alpha Gym Tour Confirmation"
    msg["From"] = EMAIL_USER
    msg["To"] = to_email

    html = f"""
    <html>
      <body>
        <h3>Hi {name},</h3>
        <p>Your tour at <strong>Alpha Gym</strong> is confirmed for <strong>{time_slot}</strong>.</p>
        <p>We're excited to see you!</p>
      </body>
    </html>
    """

    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_USER, to_email, msg.as_string())
