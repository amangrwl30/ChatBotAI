import streamlit as st
import requests
import re
from langchain_community.llms import HuggingFaceEndpoint
import os

# Configuration
GOOGLE_API_KEY = "AIzaSyAZIfLq7nOUiYo0wWv-MbG9Rqk1b77Z1NI"
GOOGLE_CSE_ID = "55ade5a9aac4d47cd"

# Get API key from environment variable
api_key = os.getenv("HUGGINGFACE_API_KEY")
if not api_key:
    raise ValueError("HUGGINGFACE_API_KEY not found in environment variables")

# Function to perform Google Custom Search
def google_search(query, api_key, cse_id):
    try:
        url = "https://www.googleapis.com/customsearch/v1"
        params = {"q": query, "key": api_key, "cx": cse_id}
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        st.error(f"Error during Google search: {e}")
        return None

# Function to set up the DeepSeek-R1 model
def setup_deepseek_r1():
    try:
        llm = HuggingFaceEndpoint(
            endpoint_url="https://api-inference.huggingface.co/models/deepseek-ai/deepseek-r1",
            huggingfacehub_api_token=api_key,
            temperature=0.7,
            task="text-generation",
        )
        return llm
    except Exception as e:
        st.error(f"Error setting up DeepSeek-R1 model: {e}")
        return None

# Main chatbot function
def chatbot(query, website, use_site_operator):
    # Clean the website string if necessary
    if use_site_operator:
        clean_site = website.replace("https://", "").replace("http://", "").rstrip("/")
        primary_query = f"site:{clean_site} {query}"
    else:
        primary_query = query

    # Primary search with the site operator (if enabled)
    search_results = google_search(primary_query, GOOGLE_API_KEY, GOOGLE_CSE_ID)
    print('search_results', search_results)
    top_results = search_results.get("items", [])[:6] if search_results else []
    print('top_results', top_results)
    
    # Fallback: if fewer than 3 results are found and we're restricting search,
    # perform an additional search without the site operator.
    # if use_site_operator and len(top_results) < 3:
    #     fallback_results = google_search(query, GOOGLE_API_KEY, GOOGLE_CSE_ID)
    #     if fallback_results:
    #         fallback_items = fallback_results.get("items", [])
    #         # Avoid duplicates based on the link URL.
    #         existing_links = {item.get("link", "") for item in top_results}
    #         for result in fallback_items:
    #             if len(top_results) >= 3:
    #                 break
    #             link = result.get("link", "")
    #             if link and link not in existing_links:
    #                 top_results.append(result)

    if not top_results or len(top_results) == 0:
        if use_site_operator:
            return f"Sorry, I couldn't find any relevant information on {website}."
        else:
            return "Sorry, I couldn't find any relevant information."

    # Build a context string from titles and snippets and prepare a links list
    context_text = ""
    links_text = ""
    for i, result in enumerate(top_results, start=1):
        title = result.get("title", "No Title")
        snippet = result.get("snippet", "No snippet available.")
        link = result.get("link", "")
        context_text += f"{i}. {title}:\n{snippet}\n\n"
        links_text += f"{i}. [{title}]({link})\n"

    print('context_text', context_text)
    print('links_text', links_text)
    # Enhanced prompt: instruct LLM to generate a concise, accurate answer based on context.
    prompt = (
        f"Below is a set of information extracted from {website} that may be relevant to the user's query. "
        f"Using only the following context, generate a concise and accurate answer to the question. "
        f"Do not include irrelevant details or long numeric sequences. "
        f"If there is not enough relevant information, respond with: "
        f"'I could not find a relevant answer based on the provided information.'\n\n"
        f"Extracted Information:\n{context_text}\n"
        f"Question: {query}\n\n"
        f"Answer:"
    )

    llm = setup_deepseek_r1()
    if not llm:
        return "LLM is not available at the moment."
    
    try:
        generated_answer = llm(prompt)
    except Exception as e:
        return f"Error generating answer: {e}"

    # Enhanced post-processing: if the generated answer is too short or contains a high ratio of digits, fallback.
    answer_strip = generated_answer.strip()
    digit_count = len(re.findall(r'\d', answer_strip))
    if len(answer_strip) < 20 or (digit_count / len(answer_strip) > 0.3):
        generated_answer = "Here's what we found:"

    final_response = (
        f"**Answer:**\n{generated_answer}\n\n"
        f"**Relevant Links from {website}:**\n{links_text}"
    )
    return final_response

# Streamlit App
def main():
    st.title("Dynamic Website Chatbot")
    st.write("Enter a website domain and your question to get a detailed answer based on that site and relevant links!")
    
    website = st.text_input("Enter the website domain (e.g., ncert.nic.in or www.airindia.com):", "ncert.nic.in")
    use_site_operator = st.checkbox("Restrict search to this domain", value=True)
    user_query = st.text_input("Enter your question:")
    
    if user_query:
        with st.spinner("Searching for answers..."):
            bot_response = chatbot(user_query, website, use_site_operator)
        st.markdown(bot_response)

if __name__ == "__main__":
    main()
