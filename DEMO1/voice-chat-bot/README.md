# AI Voice and Text Chatbot

This is an AI-powered chatbot that can handle both voice and text inputs, using OpenAI's GPT-3.5 for processing and Agora for audio handling.

## Setup

1. Create a virtual environment and activate it:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with your API keys:
```
OPENAI_API_KEY=your_openai_api_key_here
AGORA_APP_ID=your_agora_app_id_here
AGORA_APP_CERTIFICATE=your_agora_app_certificate_here
```

## Running the Application

1. Start the Flask server:
```bash
python app.py
```

2. The server will start on `http://localhost:5000`

## API Endpoints

### Text Chat
- **POST** `/chat/text`
- Body: `{"message": "Your text message here"}`

### Audio Chat
- **POST** `/chat/audio`
- Body: Raw audio data (16-bit PCM)

### Record Audio
- **POST** `/audio/record`
- Body: `{"duration": 5}` (duration in seconds, optional)

### Agora Channel Management
- **POST** `/channel/join`
- Body: `{"channel": "channel_name"}`
- **POST** `/channel/leave`

## Features

- Text-based chat using OpenAI's GPT-3.5
- Voice input processing with speech-to-text conversion
- Real-time audio handling with Agora
- Conversation history management
- Error handling and recovery

## Requirements

- Python 3.7+
- OpenAI API key
- Agora account and credentials
- Internet connection for API calls 