from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from services.llm import get_embedding_model

import os
from services.loaders import PDFMinerLoader, CSVLoader, TXTLoader

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
            print(f"Unsupported file type: {file_path}")
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

def setup_vectorstore():
    file_extensions = ['.pdf', '.csv', '.txt']
    file_paths = get_file_paths("data", file_extensions)

    documents = read_multiple_files(file_paths)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)

    embedding_model = get_embedding_model()
    texts = [chunk.page_content for chunk in chunks]
    db = FAISS.from_texts(texts, embedding_model)
    
    return db