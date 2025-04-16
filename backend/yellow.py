from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import requests
from bs4 import BeautifulSoup
from openai import OpenAI
from dotenv import load_dotenv
from playwright.async_api import async_playwright  # Use async Playwright
import os

load_dotenv()

router = APIRouter()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

def google_search(query, api_key, cse_id):
    try:
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "q": query,
            "key": api_key,
            "cx": cse_id,
            "num": 2,
            "sort": "date:r:20230101:20251231"
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Search error: {e}")
        return None

# Updated scrape_with_playwright function to use async
async def scrape_with_playwright(url):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, timeout=60000)
        await page.wait_for_load_state("load")
        await page.wait_for_timeout(3000)
        content = await page.content()
        await browser.close()
    soup = BeautifulSoup(content, "html.parser")
    return soup.get_text(separator=' ', strip=True)

def enhance_context(raw_context):
    if not raw_context:
        return ""
    enhanced = ' '.join(raw_context.split()[:2000])
    return f"SEARCH RESULTS CONTEXT:\n{enhanced}\n\nIMPORTANT: Focus on these key details:"

# Updated chatbot function to be async
async def chatbot(query, website, use_site_operator):
    clean_site = website.replace("https://", "").replace("http://", "").rstrip("/")
    search_query = f"site:{clean_site} {query}" if use_site_operator else query

    results = google_search(search_query, GOOGLE_API_KEY, GOOGLE_CSE_ID)

    items = [
        item for item in (results.get("items", []) if results else [])
        if 'link=http' not in item.get('link', '')
    ][:2]

    if not items:
        return {"answer": f"No results found on {website}", "links": []}

    combined_content = ""
    print(f"Items: {items}")
    for item in items:
        try:
            # Make sure to call the async function properly with await
            scraped_text = await scrape_with_playwright(item.get("link", ""))
            combined_content += f"\nSource: {item.get('title', '')}\nURL: {item.get('link', '')}\nContent: {scraped_text}\n"
            print(f"Scraped text: {combined_content}")
        except Exception as e:
            print(f"Error scraping {item.get('link', '')}: {e}")

    prompt = f"""Analyze this technical content and answer precisely:

QUERY: {query}

CONTEXT FROM {website}:
{enhance_context(combined_content)}

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
            temperature=0.5,
            max_tokens=400,
            top_p=0.95,
        )
        answer = response.choices[0].message.content.strip()
    except Exception as e:
        if hasattr(e, 'status_code') and e.status_code == 401:
            return {"answer": "Error: Error code: 401 - Incorrect API key provided", "links": []}
        else:
            return {"answer": f"Error: {str(e)}", "links": []}

    links = [{"title": item.get("title", ""), "link": item.get("link", "")} for item in items]
    return {"answer": answer, "links": links}

# Updated /chat route to be async
@router.post("/chat")
async def chat(request: Request):
    data = await request.json()
    query = data.get('query')
    website = data.get('website')
    use_site_operator = data.get('use_site_operator', True)

    if not query or not website:
        return JSONResponse(content={'error': 'Query and website required'}, status_code=400)

    # Use await to call the async chatbot function
    response = await chatbot(query, website, use_site_operator)
    return JSONResponse(content=response)
