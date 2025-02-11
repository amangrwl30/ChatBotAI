import streamlit as st
from langchain_community.vectorstores import FAISS
from langchain.document_loaders import CSVLoader
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_huggingface import HuggingFaceEndpoint
import os
import time  # For rate limiting

# Set page config FIRST
st.set_page_config(
    page_title="Customer Response Generator", page_icon=":bird:"
)

# Load environment variables from .env file
load_dotenv()

# Access the Hugging Face API key
api_key = os.getenv("HUGGINGFACE_API_KEY")
if not api_key:
    raise ValueError("HUGGINGFACE_API_KEY not found in .env file")

# Load documents from CSV
@st.cache_resource  # Cache the document loading to avoid reloading on every interaction
def load_data():
    loader = CSVLoader(file_path="customers.csv")
    documents = loader.load()
    print(f"Loaded {len(documents)} documents.")
    return documents

documents = load_data()

# Initialize embeddings
embedding_model = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')

# Extract text from documents
texts = [doc.page_content for doc in documents]

# Store in FAISS
db = FAISS.from_texts(texts, embedding_model)

# Initialize LLM
llm = HuggingFaceEndpoint(
    endpoint_url="https://api-inference.huggingface.co/models/gpt2",
    huggingfacehub_api_token=api_key,  # Pass the API key here
    temperature=0.5,
    task="text-generation"
)

# Define prompt template
template = """
You are a helpful customer support assistant. Based on the following information:
{context}

Answer the customer's query in a friendly and professional manner:
{customer_message}
"""

prompt = PromptTemplate.from_template(template)

# Create chain
chain = prompt | llm

# Function to generate a response
def generate_response(query):
    # Retrieve relevant info
    results = db.similarity_search(query, k=3)
    context = "\n".join([doc.page_content for doc in results])

    # Add a delay to avoid rate limiting
    time.sleep(1)

    # Invoke the chain
    response = chain.invoke({"context": context, "customer_message": query})
    return response

# Streamlit UI
def main():
    st.header("Customer Response Generator :bird:")
    message = st.text_area("Customer Message")

    if st.button("Generate Response"):
        if message:
            st.write("Generating the best response...")

            # Generate the response
            result = generate_response(message)

            # Display the response
            st.success(result)
        else:
            st.warning("Please enter a customer message.")

# Run the app
if __name__ == '__main__':
    main()