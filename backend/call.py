import os
import json
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
from werkzeug.utils import secure_filename
from deepgram import DeepgramClient, PrerecordedOptions, FileSource
import httpx

load_dotenv()

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize Deepgram
deepgram = DeepgramClient(DEEPGRAM_API_KEY)

def build_prompt(transcript: str) -> str:
    return f"""
You are an expert sales manager. Analyze the following call transcript and rate the salesperson on these attributes on a scale from 1 to 10:

Definitions:
- Tone: Friendliness and professionalism of the voice.
- Soft Spoken: Calm, polite, and non-aggressive tone.
- Anger: Detect if the salesperson shows frustration, irritation, or hostility. Score 1 for no anger, 10 for extreme anger.
- Clarity: Clear pronunciation and sentence formation.
- Persuasiveness: Ability to convince or influence the listener.
- Engagement: Conversational flow and interest maintained.
- Sales Potential: Likelihood that the call could lead to a sale.
- Confidence: Self-assurance and authority in speech.
- Product Knowledge: Demonstrates understanding of the product.
- Objection Handling: Ability to respond to concerns effectively.
- Call to Action Clarity: Whether a clear next step was suggested.

Also provide:
- An overall score (average)
- 2 points on what was done well
- 2 areas for improvement

Call Transcript:
\"\"\"
{transcript}
\"\"\"
Return your response in the following JSON format:
{{
  "scores": {{
    "Tone": int,
    "Soft Spoken": int,
    "Anger": int,
    "Clarity": int,
    "Persuasiveness": int,
    "Engagement": int,
    "Sales Potential": int,
    "Confidence": int,
    "Product Knowledge": int,
    "Objection Handling": int,
    "Call to Action Clarity": int,
    "Overall Score": int
  }},
  "what_went_well": ["...", "..."],
  "what_to_improve": ["...", "..."]
}}
"""

def select_deepgram_model(language: str) -> dict:
    """
    Determine the appropriate Deepgram model and optional sentiment flag
    based on the provided language code.
    """
    language = language.lower()
    if language in ["en-in", "en-gb"]:
        return {"model": "nova-3", "sentiment": True}
    elif language == "hi":
        return {"model": "nova-2", "sentiment": False}
    elif language == "no":
        return {"model": "whisper", "sentiment": False}
    else:
        return {"model": "nova-2", "sentiment": False}

@router.post("/analyze-call")
async def analyze_call(
    audio: UploadFile = File(...),
    language: str = Form(...)
):
    try:
        filename = secure_filename(audio.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        with open(file_path, "wb") as f:
            f.write(await audio.read())

        with open(file_path, "rb") as file:
            buffer_data = file.read()

        payload: FileSource = {"buffer": buffer_data}

        model_info = select_deepgram_model(language)

        options = PrerecordedOptions(
            model=model_info["model"],
            language=language,
            smart_format=True,
            diarize=True,
            paragraphs=True,
            sentiment=model_info.get("sentiment", False)
        )

        print(f"🔊 Transcribing via Deepgram using model='{model_info['model']}' and language='{language}'...")
        response = deepgram.listen.rest.v("1").transcribe_file(
            payload, options, timeout=httpx.Timeout(300.0, connect=10.0)
        )

        results = response.results.channels[0].alternatives[0]
        paragraphs_wrapper = getattr(results, "paragraphs", None)
        transcript_text = getattr(paragraphs_wrapper, "transcript", results.transcript)

        print("🧠 Analyzing via GPT-4o...")
        gpt_response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a professional sales call evaluator."},
                {"role": "user", "content": build_prompt(transcript_text)}
            ],
            temperature=0.4
        )

        gpt_text = gpt_response.choices[0].message.content.strip()

        if gpt_text.startswith("```json"):
            gpt_text = gpt_text.removeprefix("```json").removesuffix("```").strip()

        analysis_data = json.loads(gpt_text)

        return JSONResponse(content={
            "transcript": transcript_text,
            **analysis_data
        })

    except Exception as e:
        print(f"Exception: {e}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
