import streamlit as st
from langchain_community.vectorstores import FAISS
from langchain.document_loaders import DirectoryLoader
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



st.set_page_config(
    page_title="Customer Response Generator", page_icon=":bird:"
)

load_dotenv()

api_key = os.getenv("HUGGINGFACE_API_KEY")
if not api_key:
    raise ValueError("HUGGINGFACE_API_KEY not found in .env file")

@st.cache_resource  # Cache the document loading to avoid reloading on every interaction
def load_data():
    data_dir = "Data" 
    # loader = CSVLoader(file_path="customers.csv") 
    loader = DirectoryLoader(data_dir, glob="**/*")
    documents = loader.load()
    print(f"Loaded {len(documents)} documents.")
    return documents

documents = load_data()


embedding_model = HuggingFaceEmbeddings(model_name='sentence-transformers/paraphrase-MiniLM-L6-v2')
# model = SentenceTransformer('all-MiniLM-L6-v2')
# model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
# model = SentenceTransformer('BAAI/bge-large-en')  #not working
# model = SentenceTransformer('intfloat/e5-large-v2')  #very slow 


# Extract text from documents and storing in FAISS
texts = [doc.page_content for doc in documents]
db = FAISS.from_texts(texts, embedding_model)


#testing of embedding accuracy
x = embedding_model.embed_query("vinay")
y = embedding_model.embed_query("harry potter")

similarity = cosine_similarity([x], [y])

print(f"Cosine similarity between 'x' and 'y': {similarity[0][0]}")


# splitting documents into chunks (to check accuracy of reading details)

# def split_text(documents: list[Document]):
#     text_splitter = RecursiveCharacterTextSplitter(
#         chunk_size=300,
#         chunk_overlap=100,
#         length_function=len,
#         add_start_index=True,
#     )
#     chunks = text_splitter.split_documents(documents)
#     print(f"Split {len(documents)} documents into {len(chunks)} chunks.")

#     document = chunks[135]
#     print(document.page_content)
#     print(document.metadata)

#     return chunks

# split_text(documents)


# Initialize LLM
llm = HuggingFaceEndpoint(
    endpoint_url="https://api-inference.huggingface.co/models/gpt2",
    huggingfacehub_api_token=api_key,  # Pass the API key here
    temperature=0.7,
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

def generate_response(query):
    # Retrieve relevant info
    results = db.similarity_search(query, k=10)
    context = "\n".join([doc.page_content for doc in results])

    # Add a delay to avoid rate limiting
    time.sleep(1)

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