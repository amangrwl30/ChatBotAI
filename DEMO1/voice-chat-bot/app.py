from flask import Flask, request, jsonify
import numpy as np
from audio_handler import AudioHandler

app = Flask(__name__)
audio_handler = AudioHandler()

@app.route('/chat/audio', methods=['POST'])
def audio_chat():
    try:
        # Get audio data from request
        audio_data = np.frombuffer(request.data, dtype=np.int16)

        # Validate audio data
        if len(audio_data) < 16000:  # Less than 1 second of audio at 16kHz
            return jsonify({'error': 'Audio data too short'}), 400

        # Convert speech to text
        text = audio_handler.convert_speech_to_text(audio_data.tobytes())
        if not text:
            return jsonify({'error': 'Could not understand audio'}), 400

        return jsonify({'recognized_text': text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)