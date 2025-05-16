# Call Scoring Pipeline using AssemblyAI + GPT-4o
# Requirements: requests, openai

import requests
import time
import openai
import os
from openai import OpenAI
# ====== SETUP ======
ASSEMBLYAI_API_KEY = "89b99e1753134cbe85fdf991d1285456"  # Replace with your actual key or set as env var
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


ASSEMBLYAI_HEADERS = {
    "authorization": ASSEMBLYAI_API_KEY,
    "content-type": "application/json"
}

AUDIO_FILE = "/Users/amanagarwal/Documents/AI_LAB/ChatBotAI/backend/call/vishal_clean.wav"  # Replace with your own file

# ====== STEP 1: Upload Audio ======
def upload_audio(file_path):
    with open(file_path, 'rb') as f:
        response = requests.post("https://api.assemblyai.com/v2/upload", headers={"authorization": ASSEMBLYAI_API_KEY}, files={"file": f})
    response.raise_for_status()
    return response.json()['upload_url']

# ====== STEP 2: Transcription Request ======
def request_transcription(audio_url):
    endpoint = "https://api.assemblyai.com/v2/transcript"
    payload = {
        "audio_url": audio_url,
        "speaker_labels": True,
        "sentiment_analysis": True,
        "auto_chapters": False
    }
    response = requests.post(endpoint, json=payload, headers=ASSEMBLYAI_HEADERS)
    response.raise_for_status()
    return response.json()['id']

# ====== STEP 3: Poll Until Complete ======
def wait_for_completion(transcript_id):
    endpoint = f"https://api.assemblyai.com/v2/transcript/{transcript_id}"
    while True:
        response = requests.get(endpoint, headers=ASSEMBLYAI_HEADERS)
        result = response.json()
        if result['status'] == 'completed':
            return result
        elif result['status'] == 'error':
            raise Exception("Transcription failed:", result['error'])
        print("⏳ Waiting...")
        time.sleep(5)

# ====== STEP 4: Structure GPT-4o Prompt ======
def build_prompt(result):
    speaker_map = {}
    for utterance in result["utterances"]:
        speaker = speaker_map.setdefault(utterance["speaker"][:8], utterance["speaker"])

    agent_text = " ".join([u["text"] for u in result["utterances"] if "SPEAKER_00" in u["speaker"]])
    customer_text = " ".join([u["text"] for u in result["utterances"] if "SPEAKER_01" in u["speaker"]])

    return f"""
You are an expert sales coach.

Evaluate the following call between a sales agent and a customer.

Agent Transcript:
{agent_text}

Customer Transcript:
{customer_text}

Provide:
- Confidence (1–10)
- Rapport (1–10)
- Objection Handling (1–10)
- Closing Effectiveness (1–10)
- Overall Score (1–10)
- Justification and improvement feedback
"""

# ====== STEP 5: Get GPT-4o Scoring ======
def score_with_gpt(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
  
    return response.choices[0].message.content
# ====== MAIN ======
if __name__ == '__main__':
    print("🚀 Uploading audio...")
    url = upload_audio(AUDIO_FILE)

    print("📡 Requesting transcription...")
    transcript_id = request_transcription(url)

    print("🔄 Waiting for transcription to complete...")
    transcript_result = wait_for_completion(transcript_id)

    print("🧠 Building prompt and scoring with GPT-4o...")
    prompt = build_prompt(transcript_result)
    result = score_with_gpt(prompt)

    print("\n📊 Final Evaluation Report:\n")
    print(result)