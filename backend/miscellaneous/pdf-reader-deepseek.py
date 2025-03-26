import streamlit as st
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
from langchain_community.document_loaders import PDFMinerLoader  # Loader for single PDF file

st.set_page_config(
    page_title="Customer Response Generator", page_icon=":bird:"
)

load_dotenv()

api_key = os.getenv("HUGGINGFACE_API_KEY")
if not api_key:
    raise ValueError("HUGGINGFACE_API_KEY not found in .env file")

@st.cache_resource
def load_data():
    # Path to your single static PDF file
    pdf_file_path = "data/medanta.pdf"  # Replace with your PDF file path
    
    # Load the PDF file
    pdf_loader = PDFMinerLoader(pdf_file_path)
    documents = pdf_loader.load()

    # Split the documents into smaller chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,  # Adjust chunk size based on your model's token limit
        chunk_overlap=200,  # Overlap to maintain context between chunks
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)

    print(f"Loaded {len(documents)} documents and split into {len(chunks)} chunks.")
    return chunks

documents = load_data()

embedding_model = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')

# Extract text from documents and store in FAISS
texts = [doc.page_content for doc in documents]
db = FAISS.from_texts(texts, embedding_model)

# Testing of embedding accuracy
x = embedding_model.embed_query("vinay")
y = embedding_model.embed_query("harry potter")

similarity = cosine_similarity([x], [y])

print(f"Cosine similarity between 'x' and 'y': {similarity[0][0]}")

# Initialize LLM with DeepSeek R1 model
llm = HuggingFaceEndpoint(
    endpoint_url="https://api-inference.huggingface.co/models/deepseek-ai/deepseek-r1",  # DeepSeek R1 model endpoint
    huggingfacehub_api_token=api_key,  # Pass the API key here
    temperature=.7, 
    task="text-generation"
)

# Define prompt template
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

# Create chain
chain = prompt | llm

def generate_response(query):
    # Retrieve relevant info
    results = db.similarity_search(query, k=10)
    context = "\n".join([doc.page_content for doc in results])

    # Add a delay to avoid rate limiting
    time.sleep(.3)

    response = chain.invoke({"context": context, "customer_message": query})
    return response

# Streamlit UI
def main():
    st.header("Customer Response Generator :bird:")
    message = st.text_area("Customer Message")

    if st.button("Generate Response"):
        if message:
            st.write("Generating the best response...")

            result = generate_response(message)

            st.success(result)
        else:
            st.warning("Please enter a customer message.")

if __name__ == '__main__':
    main()