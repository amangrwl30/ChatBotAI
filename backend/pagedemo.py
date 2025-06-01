import os
import httpx
from fastapi import APIRouter, Request
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

SHOPIFY_STORE_URL = os.getenv("SHOPIFY_STORE_URL")
SHOPIFY_ADMIN_API_KEY = os.getenv("SHOPIFY_ADMIN_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

openai_client = OpenAI(api_key=OPENAI_API_KEY)

router = APIRouter()

@router.post("/generate-page")
async def generate_page(request: Request):
    data = await request.json()
    domain = data.get("domain")
    niche = data.get("niche", "general")

    # 1. Generate content using GPT-4
    prompt = f"""
    Create landing page content for a business called '{domain}' in the '{niche}' niche.
    Provide:
    - Headline
    - Subheadline
    - 3 benefits
    - 1 CTA
    - 3 FAQs
    """

    response = openai_client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    content = response.choices[0].message.content

    # 2. Format content into simple HTML
    html_body = f"""
    <div style='text-align: center;'>
        <h1>{domain} - {niche.capitalize()} Landing Page</h1>
        <p>{content}</p>
    </div>
    """

    # 3. Create page via Shopify Admin API
    page_data = {
        "page": {
            "title": f"{domain} Landing Page",
            "body_html": html_body,
            "published": True
        }
    }

    headers = {
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_KEY,
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SHOPIFY_STORE_URL}/admin/api/2024-01/pages.json",
            json=page_data,
            headers=headers
        )

    if response.status_code == 201:
        return {"message": "Page created", "shopify_response": response.json()}
    else:
        return {"error": response.text, "status_code": response.status_code}
