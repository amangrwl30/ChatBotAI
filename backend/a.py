# from flask import Flask, request, jsonify
# import requests
# import re
# from langchain_community.llms import HuggingFaceEndpoint
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# # Configuration
# GOOGLE_API_KEY = "AIzaSyAZIfLq7nOUiYo0wWv-MbG9Rqk1b77Z1NI"
# GOOGLE_CSE_ID = "55ade5a9aac4d47cd"
# HUGGINGFACE_API_KEY = "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"

# def google_search(query, api_key, cse_id):
#     try:
#         url = "https://www.googleapis.com/customsearch/v1"
#         params = {"q": query, "key": api_key, "cx": cse_id}
#         response = requests.get(url, params=params)
#         response.raise_for_status()
#         return response.json()
#     except requests.RequestException as e:
#         print(f"Error during Google search: {e}")
#         return None

# def setup_deepseek_r1():
#     try:
#         llm = HuggingFaceEndpoint(
#             endpoint_url="https://api-inference.huggingface.co/models/deepseek-ai/deepseek-r1",
#             huggingfacehub_api_token=HUGGINGFACE_API_KEY,
#             temperature=0.7,
#             task="text-generation",
#         )
#         return llm
#     except Exception as e:
#         print(f"Error setting up DeepSeek-R1 model: {e}")
#         return None

# def has_repetitive_phrases(text, n=3, threshold=2):
#     words = text.split()
#     ngrams = {}
#     for i in range(len(words) - n + 1):
#         phrase = " ".join(words[i:i+n])
#         ngrams[phrase] = ngrams.get(phrase, 0) + 1
#     for phrase, count in ngrams.items():
#         if count > threshold:
#             return True
#     return False

# def chatbot(query, website, use_site_operator):
#     # Build the search query with site operator if required.
#     if use_site_operator:
#         clean_site = website.replace("https://", "").replace("http://", "").rstrip("/")
#         primary_query = f"site:{clean_site} {query}"
#     else:
#         primary_query = query

#     # Perform search
#     search_results = google_search(primary_query, GOOGLE_API_KEY, GOOGLE_CSE_ID)
#     top_results = search_results.get("items", [])[:6] if search_results else []
    
#     if not top_results:
#         if use_site_operator:
#             return {"answer": f"Sorry, I couldn't find any relevant information on {website}.", "links": []}
#         else:
#             return {"answer": "Sorry, I couldn't find any relevant information.", "links": []}

#     # Build context and links from search results.
#     context_text = ""
#     links_list = []
#     for i, result in enumerate(top_results, start=1):
#         title = result.get("title", "No Title")
#         snippet = result.get("snippet", "No snippet available.")
#         link = result.get("link", "")
#         context_text += f"{i}. {title}:\n{snippet}\n\n"
#         links_list.append({"title": title, "link": link})

#     if not context_text.strip():
#         return {"answer": f"**Relevant Links from {website}:**", "links": links_list}

#     # Build prompt for the LLM.
#     prompt = (
#         f"Below is a set of information extracted from {website} that may be relevant to the user's query. "
#         f"Based solely on the following context, provide a concise and accurate answer to the question. "
#         f"Include key details if they are present, and do not add any information that is not supported by the context. "
#         f"If the context does not contain enough relevant information, respond with: "
#         f"I could not find a relevant answer based on the provided information.\n\n"
#         f"Extracted Information:\n{context_text}\n"
#         f"Question: {query}\n\n"
#         f"Answer:"
#     )

#     llm = setup_deepseek_r1()
#     if not llm:
#         return {"answer": "LLM is not available at the moment.", "links": links_list}

#     try:
#         generated_answer = llm(prompt)
#     except Exception as e:
#         return {"answer": f"Error generating answer: {e}", "links": links_list}

#     answer_strip = generated_answer.strip()
#     # Fallback logic for short or unsatisfactory answers.
#     if len(answer_strip) < 10 or not re.search(r"[A-Za-z]", answer_strip):
#         generated_answer = "Here’s what we found:"
#     elif has_repetitive_phrases(answer_strip, n=3, threshold=2):
#         generated_answer = "Here’s what we found:"

#     if generated_answer == "Here’s what we found:":
#         return {
#             "answer": "Here’s what we have found:",
#             "links": links_list
#         }
#     else:
#         return {
#             "answer": generated_answer,
#             "links": links_list
#         }

# @app.route('/chat', methods=['POST'])
# def chat():
#     # Expecting JSON payload with keys: query, website, use_site_operator (optional).
#     data = request.get_json()
#     query = data.get('query')
#     website = data.get('website')
#     use_site_operator = data.get('use_site_operator', True)

#     if not query or not website:
#         return jsonify({'error': 'Both query and website are required.'}), 400

#     response_data = chatbot(query, website, use_site_operator)
#     return jsonify(response_data)

# if __name__ == '__main__':
#     app.run(debug=True)











from flask import Flask, request, jsonify
import requests
import re
from bs4 import BeautifulSoup
from langchain_community.llms import HuggingFaceEndpoint
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuration
GOOGLE_API_KEY = "AIzaSyAZIfLq7nOUiYo0wWv-MbG9Rqk1b77Z1NI"
GOOGLE_CSE_ID = "55ade5a9aac4d47cd"
HUGGINGFACE_API_KEY = "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"

def google_search(query, api_key, cse_id):
    try:
        url = "https://www.googleapis.com/customsearch/v1"
        params = {"q": query, "key": api_key, "cx": cse_id}
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error during Google search: {e}")
        return None

def setup_deepseek_r1():
    try:
        llm = HuggingFaceEndpoint(
            endpoint_url="https://api-inference.huggingface.co/models/deepseek-ai/deepseek-r1",
            huggingfacehub_api_token=HUGGINGFACE_API_KEY,
            temperature=0.4,  # Lowered temperature for less randomness
            max_tokens=350,  # Limit the number of tokens in the response
            top_p=0.9,
            task="text-generation",
        )
        return llm
    except Exception as e:
        print(f"Error setting up DeepSeek-R1 model: {e}")
        return None

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

def is_meaningful_text(text):
    return re.search(r"[A-Za-z]", text) and len(text) > 10

def chatbot(query, website, use_site_operator):
    # Build the search query with site operator if required.
    if use_site_operator:
        clean_site = website.replace("https://", "").replace("http://", "").rstrip("/")
        primary_query = f"site:{clean_site} {query}"
    else:
        primary_query = query

    # Perform search
    search_results = google_search(primary_query, GOOGLE_API_KEY, GOOGLE_CSE_ID)
    top_results = search_results.get("items", [])[:6] if search_results else []
    
    if not top_results:
        if use_site_operator:
            return {"answer": f"Sorry, I couldn't find any relevant information on {website}.", "links": []}
        else:
            return {"answer": "Sorry, I couldn't find any relevant information.", "links": []}

    # Build context and links from search results.
    context_text = ""
    links_list = []
    for i, result in enumerate(top_results, start=1):
        title = result.get("title", "No Title")
        snippet = result.get("snippet", "No snippet available.")
        link = result.get("link", "")
        context_text += f"{i}. {title}:\n{snippet}\n\n"
        links_list.append({"title": title, "link": link})

    if not context_text.strip():
        return {"answer": f"**Relevant Links from {website}:**", "links": links_list}

    # Build prompt for the LLM.
    prompt = (
        f"Below is a set of information extracted from {website} that may be relevant to the user's query. "
        f"Based solely on the following context, provide a concise and accurate answer to the question. "
        f"Include key details if they are present, and do not add any information that is not supported by the context. "
        f"If the context does not contain enough relevant information, respond with: "
        f"I could not find a relevant answer based on the provided information.\n\n"
        f"Extracted Information:\n{context_text}\n"
        f"Question: {query}\n\n"
        f"Answer:"
    )

    llm = setup_deepseek_r1()
    if not llm:
        return {"answer": "LLM is not available at the moment.", "links": links_list}

    try:
        generated_answer = llm(prompt)
    except Exception as e:
        return {"answer": f"Error generating answer: {e}", "links": links_list}

    answer_strip = generated_answer.strip()
    # Fallback logic for short or unsatisfactory answers.
    if not is_meaningful_text(answer_strip) or has_repetitive_phrases(answer_strip, n=3, threshold=2):
        generated_answer = "Here’s what we found:"

    if generated_answer == "Here’s what we found:":
        return {
            "answer": "Here’s what we have found:",
            "links": links_list
        }
    else:
        return {
            "answer": generated_answer,
            "links": links_list
        }

@app.route('/chat', methods=['POST'])
def chat():
    # Expecting JSON payload with keys: query, website, use_site_operator (optional).
    data = request.get_json()
    query = data.get('query')
    website = data.get('website')
    use_site_operator = data.get('use_site_operator', True)

    if not query or not website:
        return jsonify({'error': 'Both query and website are required.'}), 400

    response_data = chatbot(query, website, use_site_operator)
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)