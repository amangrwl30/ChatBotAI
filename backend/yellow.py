from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import requests
from bs4 import BeautifulSoup
from openai import OpenAI
from dotenv import load_dotenv
from playwright.async_api import async_playwright
import os
import httpx
import time
import asyncio

load_dotenv()

router = APIRouter()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

def log_duration(start_time, label):
    duration = time.monotonic() - start_time
    print(f"[TIMER] {label} took {duration:.2f} seconds")

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
async def scrape_with_playwright(url):
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                timeout=30000,
                args=[
                    '--disable-gpu',
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            )
            context = await browser.new_context(
                # Keep JavaScript enabled for proper content rendering
                java_script_enabled=True,
                # But block unnecessary resources
                bypass_csp=False,
                # Set viewport to desktop size
                viewport={'width': 1280, 'height': 800}
            )
            
            # Block unnecessary resources
            await context.route("**/*.{png,jpg,jpeg,gif,svg,webp}", lambda route: route.abort())
            await context.route("**/*.css", lambda route: route.abort())
            await context.route("**/*.woff2", lambda route: route.abort())
            
            page = await context.new_page()
            
            # Set reasonable timeout with DOM content loaded
            await page.goto(url, timeout=15000, wait_until="domcontentloaded")
            
            # Wait briefly for main content (adjust as needed)
            await page.wait_for_selector("body", timeout=2000)
            
            # Get clean HTML content
            content = await page.content()
            
            await browser.close()
            
            # Use BeautifulSoup for reliable text extraction
            soup = BeautifulSoup(content, "html.parser")
            
            # Remove unwanted elements but keep structure
            for element in soup(['script', 'style', 'nav', 'footer', 'iframe', 'noscript']):
                element.decompose()
                
            # Get text with better formatting
            text = soup.get_text(separator='\n', strip=True)
            return ' '.join(text.split())  # Normalize whitespace

    except Exception as e:
        print(f"Scraping error for {url}: {e}")
        return ""
def enhance_context(raw_context):
    if not raw_context:
        return ""
    enhanced = ' '.join(raw_context.split()[:2000])
    return f"SEARCH RESULTS CONTEXT:\n{enhanced}\n\nIMPORTANT: Focus on these key details:"

async def chatbot(query, website, use_site_operator):
    overall_start = time.monotonic()

    clean_site = website.replace("https://", "").replace("http://", "").rstrip("/")
    search_query = f"site:{clean_site} {query}" if use_site_operator else query

    search_start = time.monotonic()
    results = google_search(search_query, GOOGLE_API_KEY, GOOGLE_CSE_ID)
    log_duration(search_start, "Google Search")

    process_start = time.monotonic()
    items = [
        item for item in (results.get("items", []) if results else [])
        if 'link=http' not in item.get('link', '')
    ][:2]
    log_duration(process_start, "Processing Search Results")

    if not items:
        log_duration(overall_start, "Entire Chatbot Flow")
        return {"answer": f"No results found on {website}", "links": []}

    # Parallel scraping with optimized function
    scrape_start = time.monotonic()
    scrape_tasks = [scrape_with_playwright(item.get("link", "")) for item in items]
    scraped_results = await asyncio.gather(*scrape_tasks, return_exceptions=True)
    log_duration(scrape_start, "Scraping All URLs")

    combined_content = ""
    for i, result in enumerate(scraped_results):
        if isinstance(result, Exception):
            print(f"Error scraping {items[i].get('link', '')}: {result}")
            continue
        combined_content += (
            f"\nSource: {items[i].get('title', '')}\n"
            f"URL: {items[i].get('link', '')}\n"
            f"Content: {result}\n"
        )

    prompt_start = time.monotonic()
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
    log_duration(prompt_start, "Building GPT Prompt")

    gpt_start = time.monotonic()
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
    log_duration(gpt_start, "OpenAI GPT Completion")

    log_duration(overall_start, "Entire Chatbot Flow")

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

    response = await chatbot(query, website, use_site_operator)
    return JSONResponse(content=response)

@router.get("/proxy")
async def proxy(query: str = None):
    print('query', query)
    if not query:
        return JSONResponse(content={'error': 'Query parameter is required'}, status_code=400)

    try:
        api_url = f"https://autocomplete.clearbit.com/v1/companies/suggest?query={query}"
        async with httpx.AsyncClient() as client:
            response = await client.get(api_url)
        return JSONResponse(content=response.json())
    except httpx.RequestError as e:
        return JSONResponse(content={'error': f'Error with external API: {str(e)}'}, status_code=500)