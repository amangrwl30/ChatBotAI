from flask import request, jsonify
from services.utils import generate_response, initialize_chain
from services.vectorstore import setup_vectorstore
import os

api_key = os.getenv("HUGGINGFACE_API_KEY")
initialize_chain(api_key)
db = setup_vectorstore()

def generate_response_endpoint():
    data = request.json
    query = data.get('query')
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    response = generate_response(db, query)
    return jsonify({'response': response})