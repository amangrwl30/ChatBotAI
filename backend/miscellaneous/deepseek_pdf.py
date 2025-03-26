import streamlit as st
import requests
import re
from urllib.parse import urlparse
from langchain_community.llms import HuggingFaceEndpoint
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_huggingface import HuggingFaceEndpoint
import os
import time
import pandas as pd
from pdfminer.high_level import extract_text
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

# Load environment variables
load_dotenv()

api_key = os.getenv("HUGGINGFACE_API_KEY")
if not api_key:
    st.error("HUGGINGFACE_API_KEY not found in .env file")
    st.stop()

class PDFMinerLoader:
    def __init__(self, pdf_file_path):
        self.pdf_file_path = pdf_file_path

    def load(self):
        try:
            text = extract_text(self.pdf_file_path)
            return text
        except Exception as e:
            st.error(f"Error reading {self.pdf_file_path}: {e}")
            return ""

class CSVLoader:
    def __init__(self, csv_file_path):
        self.csv_file_path = csv_file_path

    def load(self):
        try:
            df = pd.read_csv(self.csv_file_path)
            text = df.to_string(index=False)
            return text
        except Exception as e:
            st.error(f"Error reading {self.csv_file_path}: {e}")
            return ""

class TXTLoader:
    def __init__(self, txt_file_path):
        self.txt_file_path = txt_file_path

    def load(self):
        try:
            with open(self.txt_file_path, 'r', encoding='utf-8') as file:
                text = file.read()
            return text
        except Exception as e:
            st.error(f"Error reading {self.txt_file_path}: {e}")
            return ""

def read_multiple_files(file_paths):
    all_documents = []
    for file_path in file_paths:
        if file_path.endswith('.pdf'):
            loader = PDFMinerLoader(file_path)
        elif file_path.endswith('.csv'):
            loader = CSVLoader(file_path)
        elif file_path.endswith('.txt'):
            loader = TXTLoader(file_path)
        else:
            st.warning(f"Unsupported file type: {file_path}")
            continue
        document_text = loader.load()
        document = Document(page_content=document_text, metadata={"source": file_path})
        all_documents.append(document)
    return all_documents

def get_file_paths(directory, extensions):
    file_paths = []
    for file_name in os.listdir(directory):
        if any(file_name.endswith(ext) for ext in extensions):
            file_paths.append(os.path.join(directory, file_name))
    return file_paths

# Get all file paths from the data folder with specific extensions
file_extensions = ['.pdf', '.csv', '.txt']
file_paths = get_file_paths("../data", file_extensions)

# Read all files
documents = read_multiple_files(file_paths)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=200,
    length_function=len,
)
chunks = text_splitter.split_documents(documents)

# Initialize embeddings and FAISS database
embedding_model = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
texts = [chunk.page_content for chunk in chunks]
db = FAISS.from_texts(texts, embedding_model)

llm = HuggingFaceEndpoint(
    endpoint_url="https://api-inference.huggingface.co/models/gpt3.5",
    huggingfacehub_api_token=api_key,
    temperature=0.7,
    task="text-generation"
)

template = """
You are a helpful customer support assistant. Based on the following information:
{context}

Answer the customer's query in a friendly and professional manner:
{customer_message}

To answer the question:
0. Ensure to give response strictly from the data folder only. Donot give any information from internet or any other source.
1. Thoroughly analyze the context, identifying key information or keywords from the files relevant to the question.
2. if information is somewhat matching to asked question, give those details as well.
3. Formulate a detailed answer that directly addresses the question, using only the information provided in the context.
4. If you are asked about any index like list of content , visit that index and fetch the data.
5. If the files  doesn't contain sufficient information or no information to fully answer the question, state this clearly in your response that give more information please.
6. whenever your answering, always provide a reference to the file(s) that contain the relevant information.

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

# Streamlit App
def main():
    st.title("Document-Based Query Response System")
    st.write("Upload your documents and ask questions to get detailed responses based on the document content.")

    uploaded_files = st.file_uploader("Upload files", type=['pdf', 'csv', 'txt'], accept_multiple_files=True)
    query = st.text_input("Enter your question:")

    if uploaded_files and query:
        # Save uploaded files to the data directory
        for uploaded_file in uploaded_files:
            with open(os.path.join("data", uploaded_file.name), "wb") as f:
                f.write(uploaded_file.getbuffer())

        # Re-read all files
        file_paths = get_file_paths("data", file_extensions)
        documents = read_multiple_files(file_paths)
        chunks = text_splitter.split_documents(documents)
        texts = [chunk.page_content for chunk in chunks]
        db = FAISS.from_texts(texts, embedding_model)

        with st.spinner("Generating response..."):
            response = generate_response(query)
        st.markdown(response)

if __name__ == "__main__":
    main()