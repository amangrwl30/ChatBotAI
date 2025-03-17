import os
import openai
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS  # Import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set OpenAI API Key
OPENAI_API_KEY = "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"
openai.api_key = OPENAI_API_KEY

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "responses"
ALLOWED_EXTENSIONS = {"wav", "mp3", "m4a"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET'])
def index():
    return "Server is up and running!"

@app.route('/process-audio', methods=['POST'])
def process_audio():
    print("Received request at /process-audio")
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400
    
    audio_file = request.files['audio']

    if not allowed_file(audio_file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    filename = secure_filename(audio_file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    audio_file.save(file_path)
    print(f"Audio file saved at: {file_path}")

    try:
        # Step 1: Transcribe Audio to Text
        print("Transcribing audio to text...")
        with open(file_path, "rb") as audio:
            response = openai.Audio.transcriptions.create(
                model="whisper-1",
                file=audio
            )
        user_text = response['text']
        print(f"User: {user_text}")

        # Step 2: Get GPT-4 Response
        print("Getting GPT-4 response...")
        chat_response = openai.Chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": user_text}]
        )
        bot_text = chat_response['choices'][0]['message']['content']
        print(f"Bot: {bot_text}")

        # Step 3: Convert Bot Response to Speech
        print("Converting bot response to speech...")
        tts_response = openai.Audio.speech.create(
            model="tts-1",
            voice="alloy",
            input=bot_text
        )

        response_audio_path = os.path.join(OUTPUT_FOLDER, "response.mp3")
        with open(response_audio_path, "wb") as f:
            f.write(tts_response['content'])

        print(f"Response audio saved at: {response_audio_path}")
        return send_file(response_audio_path, mimetype="audio/mp3")

    except Exception as e:
        print("Error processing request:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)