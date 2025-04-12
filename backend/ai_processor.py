from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Fetch OpenAI API key securely
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# Initialize OpenAI LLM
llm = ChatOpenAI(
    model_name="gpt-3.5-turbo",
    openai_api_key=OPENAI_API_KEY,
    temperature=0.7  # Balanced creativity
)

# Define new prompt template
template = """
You are a helpful and proactive customer support assistant. Your goal is to assist users by providing accurate product information strictly based on the given data:

{context}

### Guidelines:
- **Use Only Provided Data:** Do not fetch information from external sources.
- **Explicitly Address Availability:**  
  - If the requested product is **not available**, **clearly state that first**.  
  - If a **similar product is available**, suggest it as an alternative.  
  - Example: *"We do not have iPhone 15 Pro in stock, but we do have iPhone 15 Pro Max available."*
- **Case-Insensitive Matching:** Treat uppercase and lowercase letters as the same (e.g., "MacBook Air" = "MACBOOK AIR").
- **Clear and Engaging Responses:** Provide details in a structured but conversational tone.
- **Stock Availability:**  
  - If a product is available, mention key details (price, stock count, features, weight, etc.).
  - If a product is **low in stock**, create urgency (e.g., *"Only 1 left, grab it before it's gone!"*).
- **Product Comparison:**  
  - If the user requests a comparison, **always compare the products** even if one or both are unavailable.  
  - Present the comparison in **bullet points** instead of a long paragraph.  
  - Example:
    ```
    **iPhone 15 Pro vs. iPhone 15 Pro Max:**
    - **Price:** iPhone 15 Pro - $999 | iPhone 15 Pro Max - $1,199
    - **Storage Options:** 256GB, 512GB, 1TB (both models)
    - **Camera Setup:** iPhone 15 Pro - Dual Camera | iPhone 15 Pro Max - Triple Camera
    - **Weight:** iPhone 15 Pro - 180g | iPhone 15 Pro Max - 220g
    ```
- **No Guessing:** If no relevant information is found, say:  
  *"I do not have specific information about that product."*

### User Query:
{customer_message}
"""



prompt = PromptTemplate.from_template(template)

def generate_ai_response(user_query, products):
    """
    Formats product data as JSON and sends it to OpenAI using LangChain.
    """
    formatted_products = []
    
    for product in products:
        formatted_product = {
            "title": product.get("details", {}).get("title", "Unknown Product"),
            "body_html": product.get("details", {}).get("body_html", ""),
            "variants": [],
            "images": [{"src": img["src"]} for img in product.get("details", {}).get("images", [])]
        }

        for variant in product.get("details", {}).get("variants", []):
            formatted_product["variants"].append({
                "price": variant.get("price", "0.00"),
                "taxable": variant.get("taxable", False),
                "grams": variant.get("grams", 0),
                "requires_shipping": variant.get("requires_shipping", True),
                "weight": variant.get("weight", 0),
                "weight_unit": variant.get("weight_unit", "kg"),
                "inventory_quantity": variant.get("inventory_quantity", 0)
            })
        
        formatted_products.append(formatted_product)
        print(formatted_product)

    # Convert structured product data to JSON format
    product_json = json.dumps({"products": formatted_products}, indent=4)

    # Format prompt
    formatted_prompt = prompt.format(
        context=product_json,
        customer_message=user_query
    )

    # Get response from OpenAI
    response = llm.invoke(formatted_prompt).content.strip()

    return response
