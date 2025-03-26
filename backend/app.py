import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get OpenAI API Key from environment variable
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

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
    print("33Received request at /process-audio")
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400
    
    audio_file = request.files['audio']

    if not allowed_file(audio_file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    filename = secure_filename(audio_file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    audio_file.save(file_path)
    print(f"45Audio file saved at: {file_path}")

    try:
        # Step 1: Transcribe Audio to Text
        print("Transcribing audio to text...")
        with open(file_path, "rb") as audio:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio
            )
        user_text = response.text
        print(f"User56: {user_text}")

        # Step 2: Get GPT-4 Response with limited length
        print("59Getting GPT-4 response...")
        chat_response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": user_text}],
            max_tokens=50,  # Limit response length to get ~5 seconds of audio
            temperature=0.7
        )
        bot_text = chat_response.choices[0].message.content
        print(f"Bot67: {bot_text}")

        # Step 3: Convert Bot Response to Speech
        print("Converting bot response to speech...")
        tts_response = client.audio.speech.create(
            model="tts-1",
            voice="shimmer",
            input=bot_text,
            speed=1.0,  # Slightly faster speech
            response_format="mp3"
        )

#         voice="alloy"      # Default neutral voice
# voice="echo"       # Male voice
# voice="fable"      # British accent
# voice="onyx"       # Deep male voice
# voice="nova"       # Female voice
# voice="shimmer"

# speed=0.8    # Slower speech
# speed=1.0    # Default speed
# speed=1.2    # Faster speech
# speed=1.5 

# response_format="mp3"    # Standard audio format
# response_format="opus"   # High-quality audio format
# response_format="aac"    # Advanced audio coding
# response_format="flac" 

        response_audio_path = os.path.join(OUTPUT_FOLDER, "response.mp3")
        with open(response_audio_path, "wb") as f:
            f.write(tts_response.content)

        print(f"Response audio saved at: {response_audio_path}")
        return send_file(response_audio_path, mimetype="audio/mp3")

    except Exception as e:
        print("Error processing request:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)





# import os
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from werkzeug.utils import secure_filename
# from openai import OpenAI
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# app = Flask(__name__)
# CORS(app)

# # Get OpenAI API Key from environment variable
# client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# UPLOAD_FOLDER = "uploads"
# OUTPUT_FOLDER = "responses"
# ALLOWED_EXTENSIONS = {"wav", "mp3", "m4a"}

# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# def allowed_file(filename):
#     return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# @app.route('/', methods=['GET'])
# def index():
#     return "Server is up and running!"

# @app.route('/process-audio', methods=['POST'])
# def process_audio():
#     print("Received request at /process-audio")
#     if 'audio' not in request.files:
#         return jsonify({"error": "No audio file uploaded"}), 400
    
#     audio_file = request.files['audio']

#     if not allowed_file(audio_file.filename):
#         return jsonify({"error": "Invalid file type"}), 400

#     filename = secure_filename(audio_file.filename)
#     file_path = os.path.join(UPLOAD_FOLDER, filename)
#     audio_file.save(file_path)
#     print(f"Audio file saved at: {file_path}")

#     try:
#         # Step 1: Transcribe Audio to Text
#         print("Transcribing audio to text...")
#         with open(file_path, "rb") as audio:
#             response = client.audio.transcriptions.create(
#                 model="whisper-1",
#                 file=audio
#             )
#         user_text = response.text
#         print(f"User: {user_text}")

#         # Step 2: Get GPT-4 Response with limited length
#         print("Getting GPT-4 response...")
#         chat_response = client.chat.completions.create(
#             model="gpt-4",
#             messages=[{"role": "user", "content": user_text}],
#             max_tokens=50,  # Limit response length to get ~5 seconds of audio
#             temperature=0.7
#         )
#         bot_text = chat_response.choices[0].message.content
#         print(f"Bot: {bot_text}")

#         # Step 3: Convert Bot Response to Speech
#         print("Converting bot response to speech...")
#         tts_response = client.audio.speech.create(
#             model="tts-1",
#             voice="shimmer",
#             input=bot_text,
#             speed=1.0,  # Slightly faster speech
#             response_format="mp3"
#         )

# #         voice="alloy"      # Default neutral voice
# # voice="echo"       # Male voice
# # voice="fable"      # British accent
# # voice="onyx"       # Deep male voice
# # voice="nova"       # Female voice
# # voice="shimmer"

# # speed=0.8    # Slower speech
# # speed=1.0    # Default speed
# # speed=1.2    # Faster speech
# # speed=1.5 

# # response_format="mp3"    # Standard audio format
# # response_format="opus"   # High-quality audio format
# # response_format="aac"    # Advanced audio coding
# # response_format="flac" 

#         response_audio_path = os.path.join(OUTPUT_FOLDER, "response.mp3")
#         with open(response_audio_path, "wb") as f:
#             f.write(tts_response.content)

#         print(f"Response audio saved at: {response_audio_path}")

#         # Return STT text, TTS text, and audio file link
#         return jsonify({
#             "stt_text": user_text,  # Transcribed Speech-to-Text
#             "tts_text": bot_text,   # Generated Text-to-Speech Response
#             "audio_url": f"http://localhost:5000/get-audio"  # URL to fetch audio
#         })

#     except Exception as e:
#         print("Error processing request:", str(e))
#         return jsonify({"error": str(e)}), 500

# # New route to serve the generated audio file
# @app.route('/get-audio', methods=['GET'])
# def get_audio():
#     response_audio_path = os.path.join(OUTPUT_FOLDER, "response.mp3")
#     return send_file(response_audio_path, mimetype="audio/mp3")

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
