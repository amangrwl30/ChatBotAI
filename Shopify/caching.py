from fastapi import FastAPI, BackgroundTasks
import requests
import sqlite3
import faiss
import pandas as pd
import time
import threading
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os
import json
import numpy as np
from ai_processor import generate_ai_response

# Load environment variables
load_dotenv()
SHOPIFY_API_URL = os.getenv("SHOPIFY_API_URL")
SHOPIFY_API_TOKEN = os.getenv("SHOPIFY_ACCESS_TOKEN")

# Initialize FastAPI app
app = FastAPI()

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# SQLite Database for caching API response
db_path = "shopify_cache.db"

def setup_db():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            title TEXT,
            details TEXT
        )
    ''')
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_product_id ON products(id);")
    conn.commit()
    conn.close()

setup_db()

# FAISS Index for embeddings
d = 384  # Dimension of MiniLM embeddings
index = faiss.IndexFlatL2(d)
id_to_index = {}  # Dictionary mapping product IDs to FAISS indices
index_to_id = []  # List mapping FAISS indices back to product IDs

# Function to fetch Shopify data and cache it
def refresh_cache():
    print("Refreshing cache...")
    HEADERS = {"X-Shopify-Access-Token": SHOPIFY_API_TOKEN}
    
    response = requests.get(SHOPIFY_API_URL, headers=HEADERS)
    if response.status_code == 200:
        data = response.json()
        products = []
        embeddings = []
        global index, id_to_index, index_to_id

        # Reset mappings
        id_to_index.clear()
        index_to_id.clear()

        for idx, product in enumerate(data.get("products", [])):
            title = product.get("title", "Unknown")
            product_id = str(product.get("id", ""))
            details = json.dumps(product)  # Store full details as JSON
            
            products.append((product_id, title, details))
            embeddings.append(model.encode(title))  # Generate embedding
            
            # Update mapping
            id_to_index[product_id] = idx
            index_to_id.append(product_id)

        # Store in SQLite
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM products")  # Clear old data
        cursor.executemany("INSERT INTO products VALUES (?, ?, ?)", products)
        conn.commit()
        conn.close()

        # Store embeddings in FAISS
        index = faiss.IndexFlatL2(d)  # Reset FAISS index
        index.add(np.array(embeddings).astype('float32'))
        
        print("Cache updated successfully.")
    else:
        print("Failed to fetch Shopify data.")

# Background task to refresh cache every 2 minutes
def schedule_refresh():
    while True:
        refresh_cache()
        time.sleep(120)  # Run every 2 minutes

threading.Thread(target=schedule_refresh, daemon=True).start()

# API Endpoint to query products
@app.get("/query")
def query_product(query: str):
    embedding = model.encode([query])
    _, indices = index.search(embedding, 10)  # Get top 2 results
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    result = []
    
    for idx in indices[0]:
        if idx < len(index_to_id):
            product_id = index_to_id[idx]
            cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
            row = cursor.fetchone()
            if row:
                result.append({"id": row[0], "title": row[1], "details": json.loads(row[2])})
    
    conn.close()
    return result

@app.get("/query_with_ai")
def query_with_ai(query: str):
    products = query_product(query) 
    ai_response = generate_ai_response(query, products)  # Generate AI response using LangChain
    return {"query": query, "response": ai_response}