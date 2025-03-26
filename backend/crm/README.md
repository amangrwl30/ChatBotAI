# Voice-Enabled Chat Bot

A chat bot that accepts both text and voice inputs, powered by OpenAI's GPT and Agora for voice handling.

## Features

- Text chat interface
- Voice input support via Agora
- Real-time responses
- WebSocket support for live communication
- Audio processing and conversion

## Prerequisites

- Python 3.8+
- Node.js 16+
- Agora account and credentials
- OpenAI API key

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your actual API keys and credentials.

5. Run the backend server:
```bash
uvicorn app.main:app --reload
```

The backend will be available at http://localhost:8000

## Frontend Setup

The frontend setup will be implemented in React with TypeScript. Instructions will be added once the frontend is implemented.

## API Endpoints

- `GET /`: Health check endpoint
- `POST /chat`: Send text messages to the chat bot
- `GET /generate-token`: Generate Agora token for voice chat
- `WebSocket /ws`: Real-time communication endpoint

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `AGORA_APP_ID`: Your Agora app ID
- `AGORA_APP_CERTIFICATE`: Your Agora app certificate

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT 