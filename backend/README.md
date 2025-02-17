# ChatBotAI
This Repository will serve the learning purpose of chat bot AI

# Customer Response Generator

This project is a full-stack application that uses Flask for the backend and React with Tailwind CSS for the frontend. The backend leverages LangChain for natural language processing.

## Project Structure
```
my_project/
│
├── backend/
│   ├── app.py
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── components/
│   │   │   └── ResponseGenerator.js
│   │   └── styles/
│   │       └── tailwind.css
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

## Backend Setup

1. Navigate to the `backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend` directory with the following content:
   ```
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```
5. Run the Flask app:
   ```bash
   python app.py
   ```

The backend should now be running on `http://localhost:5000`.

## Frontend Setup

1. Navigate to the `frontend` directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory with the following content:
   ```
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```
4. Start the React app:
   ```bash
   npm start
   ```

The frontend should now be running on `http://localhost:3000`.

## Usage

1. Open the React app in your browser.
2. Enter a customer message in the textarea.
3. Click the "Generate Response" button to get a response from the backend.

## License

This project is licensed under the MIT License.