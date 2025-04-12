from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import requests
import re
from bs4 import BeautifulSoup
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CSE_ID =  os.getenv("GOOGLE_CSE_ID")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

# def google_search(query, api_key, cse_id):
#     try:
#         url = "https://www.googleapis.com/customsearch/v1"
#         params = {"q": query, "key": api_key, "cx": cse_id, "num": 8}
#         response = requests.get(url, params=params)
#         response.raise_for_status()
#         return response.json()
#     except requests.RequestException as e:
#         print(f"Search error: {e}")
#         return None

def google_search(query, api_key, cse_id):
    try:
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "q": query, 
            "key": api_key, 
            "cx": cse_id, 
            "num": 8,
            "sort": "date:r:20230101:20251231"  # Sort by date range (2023-2025)
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Search error: {e}")
        return None

def enhance_context(raw_context):
    """Transform raw context into LLM-friendly format"""
    if not raw_context:
        return ""
    
    # Remove excessive whitespace and truncate
    enhanced = ' '.join(raw_context.split()[:2000])  # Keep ~2000 words
    
    # Add structure markers
    return f"SEARCH RESULTS CONTEXT:\n{enhanced}\n\nIMPORTANT: Focus on these key details:"

def chatbot(query, website, use_site_operator):
    # Build query
    clean_site = website.replace("https://", "").replace("http://", "").rstrip("/")
    search_query = f"site:{clean_site} {query}" if use_site_operator else query
    
    results = google_search(search_query, GOOGLE_API_KEY, GOOGLE_CSE_ID)

    # Filter out any links containing 'link=http' (case-sensitive)
    items = [
        item for item in (results.get("items", []) if results else [])
        if 'link=http' not in item.get('link', '')
    ][:5]  # Take first 5 filtered results

    print('items',items)
    
    if not items:
        return {"answer": f"No results found on {website}", "links": []}

    # Build context
    context = "\n".join([
        f"Source {i+1}: {item.get('title', '')}\n"
        f"URL: {item.get('link', '')}\n"
        f"Content: {item.get('snippet', '')}\n"
        for i, item in enumerate(items)
    ])
    
    # Enhanced prompt
    prompt = f"""Analyze this technical content and answer precisely:

QUERY: {query}

CONTEXT FROM {website}:
{enhance_context(context)}

RULES:
1. Answer ONLY using provided context
2. Be technical and precise 
3. fetch latest data first to answer
4. Never hallucinate
5. Format clearly with:
   - Direct answer first
   - Supporting points
6. Donot explicitly mention **Source x mentions** or **supporting points** or **based on your website** or **Direct answer** in answers.
7. Add in last of our answers **for more information, check suggested links shared below** .

ANSWER:"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a technical research assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,  # More deterministic , 0.5 for ncert, 0.9 for moneycontrol.com
            max_tokens=400,
            top_p=0.95,
        )
        answer = response.choices[0].message.content.strip()
    except Exception as e:
         if e.status_code == 401:
            return {"answer": "Error: Error code: 401 - Error generating answer: Incorrect API key provided", "links": []}
         else:
            return {"answer": f"Error: {str(e)}", "links": []}

    # Format response
    links = [{"title": item.get("title", ""), "link": item.get("link", "")} for item in items]
    return {"answer": answer, "links": links}

@router.post("/chat")
async def chat(request: Request):
    data = await request.json()
    query = data.get('query')
    website = data.get('website')
    use_site_operator = data.get('use_site_operator', True)

    if not query or not website:
        return JSONResponse(content={'error': 'Query and website required'}, status_code=400)

    return JSONResponse(content=chatbot(query, website, use_site_operator))