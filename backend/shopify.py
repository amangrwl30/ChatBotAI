# main.py
from fastapi import APIRouter, Request, BackgroundTasks
import requests
import sqlite3
import faiss
import json
import os
import time
import threading
import numpy as np
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from ai_processor import generate_ai_response

router = APIRouter()

# Load environment variables
load_dotenv()
SHOPIFY_API_URL = os.getenv("SHOPIFY_API_URL")
SHOPIFY_API_TOKEN = os.getenv("SHOPIFY_ACCESS_TOKEN")
FACEBOOK_PAGE_ACCESS_TOKEN = os.getenv("FACEBOOK_PAGE_ACCESS_TOKEN")
VERIFY_TOKEN = os.getenv("FACEBOOK_VERIFY_TOKEN")
FACEBOOK_GRAPH_API_URL = "https://graph.facebook.com/v18.0/me/messages"

# Embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# SQLite setup
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

# FAISS setup
d = 384
index = faiss.IndexFlatL2(d)
id_to_index = {}
index_to_id = []

def refresh_cache():
    print("Refreshing cache...")
    HEADERS = {"X-Shopify-Access-Token": SHOPIFY_API_TOKEN}
    response = requests.get(SHOPIFY_API_URL, headers=HEADERS)
    if response.status_code == 200:
        data = response.json()
        products = []
        embeddings = []
        global index, id_to_index, index_to_id

        id_to_index.clear()
        index_to_id.clear()

        for idx, product in enumerate(data.get("products", [])):
            title = product.get("title", "Unknown")
            product_id = str(product.get("id", ""))
            details = json.dumps(product)
            products.append((product_id, title, details))
            embeddings.append(model.encode(title))
            id_to_index[product_id] = idx
            index_to_id.append(product_id)

        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM products")
        cursor.executemany("INSERT INTO products VALUES (?, ?, ?)", products)
        conn.commit()
        conn.close()

        index = faiss.IndexFlatL2(d)
        index.add(np.array(embeddings).astype('float32'))

        print("Cache updated successfully.")
    else:
        print("Failed to fetch Shopify data.")

def schedule_refresh():
    while True:
        refresh_cache()
        time.sleep(120)

threading.Thread(target=schedule_refresh, daemon=True).start()

async def query_product(query: str):
    embedding = model.encode([query])
    _, indices = index.search(embedding, 5)

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

async def query_with_ai(query: str):
    products = await query_product(query)
    ai_response = generate_ai_response(query, products)
    return {"query": query, "response": ai_response}

@router.get("/webhook")
async def verify_facebook_webhook(request: Request):
    params = request.query_params
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        print("WEBHOOK VERIFIED")
        return int(challenge)
    else:
        return {"error": "Invalid verification token"}, 403

@router.post("/webhook")
async def handle_facebook_message(request: Request, background_tasks: BackgroundTasks):
    data = await request.json()
    print("Received Messenger data:", json.dumps(data, indent=2))

    if "entry" in data:
        for entry in data["entry"]:
            if "messaging" in entry:
                for message_event in entry["messaging"]:
                    sender_id = message_event["sender"]["id"]
                    if "message" in message_event and "text" in message_event["message"]:
                        user_message = message_event["message"]["text"]
                        background_tasks.add_task(process_user_message, sender_id, user_message)

    return {"status": "Message received"}

async def process_user_message(sender_id, user_message):
    products = await query_product(user_message)
    ai_response = generate_ai_response(user_message, products)
    send_facebook_message(sender_id, ai_response)

def send_facebook_message(recipient_id, message_text):
    payload = {
        "recipient": {"id": recipient_id},
        "message": {"text": message_text}
    }

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(
        FACEBOOK_GRAPH_API_URL,
        params={"access_token": FACEBOOK_PAGE_ACCESS_TOKEN},
        headers=headers,
        json=payload
    )

    print("Messenger Response:", response.json())
