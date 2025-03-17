import streamlit as st
import requests
import re
from langchain_community.llms import HuggingFaceEndpoint

# Configuration
GOOGLE_API_KEY = "AIzaSyAZIfLq7nOUiYo0wWv-MbG9Rqk1b77Z1NI"
GOOGLE_CSE_ID = "55ade5a9aac4d47cd"
HUGGINGFACE_API_KEY = "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"

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
            huggingfacehub_api_token=HUGGINGFACE_API_KEY,
            temperature=0.7,
            task="text-generation",
        )
        return llm
    except Exception as e:
        st.error(f"Error setting up DeepSeek-R1 model: {e}")
        return None

# Utility function to check for repetitive n-word phrases.
def has_repetitive_phrases(text, n=3, threshold=2):
    words = text.split()
    ngrams = {}
    for i in range(len(words) - n + 1):
        phrase = " ".join(words[i:i+n])
        ngrams[phrase] = ngrams.get(phrase, 0) + 1
    for phrase, count in ngrams.items():
        if count > threshold:
            return True
    return False

# Main chatbot function
def chatbot(query, website, use_site_operator):
    # Clean the website string if necessary.
    if use_site_operator:
        clean_site = website.replace("https://", "").replace("http://", "").rstrip("/")
        primary_query = f"site:{clean_site} {query}"
    else:
        primary_query = query

    # Perform search and get up to 10 results for richer context.
    search_results = google_search(primary_query, GOOGLE_API_KEY, GOOGLE_CSE_ID)
    top_results = search_results.get("items", [])[:10] if search_results else []
    
    if not top_results or len(top_results) == 0:
        if use_site_operator:
            return f"Sorry, I couldn't find any relevant information on {website}."
        else:
            return "Sorry, I couldn't find any relevant information."

    # Build context and links from search results.
    context_text = ""
    links_text = ""
    for i, result in enumerate(top_results, start=1):
        title = result.get("title", "No Title")
        snippet = result.get("snippet", "No snippet available.")
        link = result.get("link", "")
        context_text += f"{i}. {title}:\n{snippet}\n\n"
        links_text += f"{i}. [{title}]({link})\n"

    if not context_text.strip():
        return f"**Relevant Links from {website}:**\n{links_text}"

    # Enhanced prompt: instruct the LLM to answer precisely using the provided context.
    prompt = (
        f"Below is a set of information extracted from {website} that may be relevant to the user's query. "
        f"Based solely on the following context, provide a concise and accurate answer to the question."
        f"Include key details if they are present, and do not add any information that is not supported by the context. "
        f"If the context does not contain enough relevant information, respond with: "
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

    answer_strip = generated_answer.strip()
    digit_count = len(re.findall(r'\d', answer_strip))
    
    # Fallback if answer is too short or unsatisfactory.
    if len(answer_strip) < 10 or not re.search(r"[A-Za-z]", answer_strip):
        generated_answer = "Here’s what we found:"
    elif has_repetitive_phrases(answer_strip, n=3, threshold=2):
        generated_answer = "Here’s what we found:"

    # If fallback triggered, only show the fallback message with the links.
    if generated_answer == "Here’s what we found:":
        final_response = (
            f"**Answer:**\nHere’s what we have found:\n\n"
            f"**Relevant Links from {website}:**\n{links_text}"
        )
    else:
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
