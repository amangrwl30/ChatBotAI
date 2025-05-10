import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from dotenv import load_dotenv
from openai import OpenAI
from werkzeug.utils import secure_filename
from pydantic import BaseModel

# Load environment variables
load_dotenv()

router = APIRouter()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "responses"
ALLOWED_EXTENSIONS = {"wav", "mp3", "m4a"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@router.get("/")
def index():
    return {"message": "Server is up and running!"}


# ✅ 1. Transcription-Only Endpoint
@router.post("/transcribe-audio")
async def transcribe_audio(audio: UploadFile = File(...)):
    if not allowed_file(audio.filename):
        raise HTTPException(status_code=400, detail="Invalid file type")

    filename = secure_filename(audio.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await audio.read())

    try:
        with open(file_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
        user_text = response.text
        return {"transcription": user_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ 2. Full Audio Processing Endpoint (Text + Speech)
@router.post("/process-audio")
async def process_audio(audio: UploadFile = File(...)):
    print("Received request at /process-audio")

    if not allowed_file(audio.filename):
        raise HTTPException(status_code=400, detail="Invalid file type")

    filename = secure_filename(audio.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await audio.read())
    print(f"Audio file saved at: {file_path}")

    try:
        # Step 1: Transcribe
        print("Transcribing audio...")
        with open(file_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
        user_text = response.text
        print(f"User: {user_text}")

        # Step 2: Get GPT-4 response
        print("Getting GPT-4 response...")
        chat_response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": user_text}],
            max_tokens=100,
            temperature=0.7
        )
        bot_text = chat_response.choices[0].message.content
        print(f"Bot: {bot_text}")

        # Step 3: Convert response to speech
        print("Converting to speech...")
        tts_response = client.audio.speech.create(
            model="tts-1",
            voice="fable",
            input=bot_text,
            speed=1.0,
            response_format="mp3"
        )

        response_audio_filename = "response.mp3"
        response_audio_path = os.path.join(OUTPUT_FOLDER, response_audio_filename)

        with open(response_audio_path, "wb") as f:
            f.write(tts_response.content)

        print(f"Response audio saved at: {response_audio_path}")

        return JSONResponse(content={
            "response_text": bot_text,
            "audio_file_url": f"/download-audio/{response_audio_filename}"
        })

    except Exception as e:
        print("Error processing request:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# ✅ 3. Download Endpoint for Audio
@router.get("/download-audio/{filename}")
def download_audio(filename: str):
    file_path = os.path.join(OUTPUT_FOLDER, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(path=file_path, media_type="audio/mp3", filename=filename)


class TextInput(BaseModel):
    prompt: str

# ✅ 4. Text-to-Text Endpoint
@router.post("/text-to-text")
async def text_to_text(input: TextInput):
    try:
        chat_response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": input.prompt}],
            max_tokens=200,
            temperature=0.7
        )
        response_text = chat_response.choices[0].message.content
        return {"response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
