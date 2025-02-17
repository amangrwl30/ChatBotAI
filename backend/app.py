from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_huggingface import HuggingFaceEndpoint
import os
import time  
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_community.document_loaders import PDFMinerLoader

app = Flask(__name__)
CORS(app)

load_dotenv()

api_key = os.getenv("HUGGINGFACE_API_KEY")
if not api_key:
    raise ValueError("HUGGINGFACE_API_KEY not found in .env file")

def load_data():
    pdf_file_path = "data/medanta.pdf"  # Replace with your PDF file path
    pdf_loader = PDFMinerLoader(pdf_file_path)
    documents = pdf_loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)

    return chunks

documents = load_data()

embedding_model = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
texts = [doc.page_content for doc in documents]
db = FAISS.from_texts(texts, embedding_model)
llm = HuggingFaceEndpoint(
    endpoint_url="https://api-inference.huggingface.co/models/deepseek-ai/deepseek-r1",
    huggingfacehub_api_token=api_key,
    temperature=.7, 
    task="text-generation"
)

template = """
You are a helpful customer support assistant. Based on the following information:
{context}

Answer the customer's query in a friendly and professional manner:
{customer_message}

To answer the question:
0. If you are asked about any index like list of content , visit that index and fetch the data.
1. Thoroughly analyze the context, identifying key information or keywords from the files relevant to the question.
2. if information is somewhat matching to asked question, give those details as well.
3. Formulate a detailed answer that directly addresses the question, using only the information provided in the context.
4. Ensure to give response strictly from the files only that has been uploaded. Donot give any information from internet.
5. If the files  doesn't contain sufficient information or no information to fully answer the question, state this clearly in your response that give more information please.

Format your response as follows:
1. Use clear, concise language.
2. Organize your answer into paragraphs for readability.
3. Use bullet points or numbered lists where appropriate to break down complex information.
4. if no context is found, just say provide more info to help you out here.

Important: Base your entire response solely on the information provided in the context. Do not include any external knowledge or assumptions not present in the given text.
"""

prompt = PromptTemplate.from_template(template)
chain = prompt | llm

def generate_response(query):
    results = db.similarity_search(query, k=10)
    context = "\n".join([doc.page_content for doc in results])
    time.sleep(.3)
    response = chain.invoke({"context": context, "customer_message": query})
    return response

@app.route('/generate_response', methods=['POST'])
def generate_response_endpoint():
    data = request.json
    query = data.get('query')
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    response = generate_response(query)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)