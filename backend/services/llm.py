from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint
import os

def get_embedding_model():
    return HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')

def get_llm(api_key):
    return HuggingFaceEndpoint(
        endpoint_url="https://api-inference.huggingface.co/models/gpt3.5",
        huggingfacehub_api_token=api_key,
        temperature=0.7,
        task="text-generation"
    )