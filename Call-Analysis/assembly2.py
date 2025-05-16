import requests
import time
import openai
from openai import OpenAI
import os

# ========== CONFIG ==========

AUDIO_FILE_URL = "https://assemblyaiusercontent.com/playground/Hphs-QCvGN2.m4a"

ASSEMBLYAI_API_KEY = "89b99e1753134cbe85fdf991d1285456"  # Replace with your actual key or set as env var
openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

headers = {
    "authorization": ASSEMBLYAI_API_KEY
}

# ========== TRANSCRIPTION REQUEST ==========
def request_transcription(audio_url):
    endpoint = "https://api.assemblyai.com/v2/transcript"
    payload = {
        "audio_url": audio_url,
        "speech_model": "universal",
        "sentiment_analysis": True,
        "language_detection": True,
        "speaker_labels": True
    }
    response = requests.post(endpoint, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()['id']

# ========== POLL FOR COMPLETION ==========
def wait_for_transcription(transcript_id):
    polling_endpoint = f"https://api.assemblyai.com/v2/transcript/{transcript_id}"
    while True:
        response = requests.get(polling_endpoint, headers=headers)
        result = response.json()
        if result['status'] == 'completed':
            return result
        elif result['status'] == 'error':
            raise RuntimeError(f"Transcription failed: {result['error']}")
        print("⏳ Waiting for transcription to complete...")
        time.sleep(5)

# ========== PROMPT STRUCTURE ==========

def build_prompt_from_result(result):
    utterances = result.get("utterances", [])

    agent_transcript = ""
    customer_transcript = ""

    for u in utterances:
        speaker = u["speaker"]
        text = u["text"]

        if speaker == "A":
            agent_transcript += text + " "
        elif speaker == "B":
            customer_transcript += text + " "

    prompt = f"""
You are an expert sales coach.

Evaluate the following call between a sales agent and a customer.

Agent Transcript:
{agent_transcript}

Customer Transcript:
{customer_transcript}

Please evaluate the agent on the following:
- Confidence (1–10)
- Rapport (1–10)
- Objection Handling (1–10)
- Closing Effectiveness (1–10)
- Overall Score (1–10)

Also provide a brief explanation and suggestions for improvement.
"""

    return prompt.strip()


# ========== GPT-4o SCORING ==========
def score_call(prompt):
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# ========== MAIN ==========
if __name__ == "__main__":
    print("📡 Submitting transcription job...")
    transcript_id = request_transcription(AUDIO_FILE_URL)

    print("🔄 Polling AssemblyAI...")
    result = wait_for_transcription(transcript_id)
    

    print("🧠 Building GPT-4o prompt...")
    prompt = build_prompt_from_result(result)

    print("🤖 Scoring with GPT-4o...")
    evaluation = score_call(prompt)

    print("\n📊 Final Evaluation:\n")
    print(evaluation)
