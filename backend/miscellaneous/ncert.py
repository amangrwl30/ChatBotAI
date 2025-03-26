# import os
# import requests
# from bs4 import BeautifulSoup
# from dotenv import load_dotenv
# from langchain_community.embeddings import HuggingFaceEmbeddings
# from langchain_community.vectorstores import FAISS
# from langchain.chains import RetrievalQA
# from langchain.prompts import PromptTemplate
# from langchain_community.llms import HuggingFaceEndpoint
# import streamlit as st
# import csv
# from urllib.parse import urljoin
# import PyPDF2
# import pdfplumber
# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait, Select
# from selenium.webdriver.support import expected_conditions as EC

# # Set up Hugging Face API key
# load_dotenv()
# api_key = os.getenv("HUGGINGFACE_API_KEY")
# if not api_key:
#     raise ValueError("HUGGINGFACE_API_KEY not found in .env file")

# @st.cache_resource
# def setup_deepseek_r1():
#     llm = HuggingFaceEndpoint(
#         endpoint_url="https://api-inference.huggingface.co/models/deepseek-ai/deepseek-r1",
#         huggingfacehub_api_token=api_key,
#         temperature=0.7,
#         task="text-generation",
#     )
#     return llm

# @st.cache_data
# def scrape_static_website(url):
#     response = requests.get(url)
#     soup = BeautifulSoup(response.content, "html.parser")
#     page_title = soup.title.string.strip() if soup.title else "No Title"
#     links_data = []
#     for link in soup.find_all("a", href=True):
#         link_text = link.text.strip()
#         link_url = urljoin(url, link["href"])
#         link_description = link.get("title", "").strip()
#         parent_section = ""
#         for parent in link.parents:
#             if parent.name in ["h1", "h2", "h3", "h4", "h5", "h6"]:
#                 parent_section = parent.text.strip()
#                 break
#         link_type = "internal" if url in link_url else "external"
#         links_data.append({
#             "text": link_text,
#             "url": link_url,
#             "description": link_description,
#             "parent_section": parent_section,
#             "link_type": link_type,
#             "page_title": page_title
#         })
#     return links_data

# def write_to_csv(links_data, filename="website_links.csv"):
#     fieldnames = ["text", "url", "description", "parent_section", "link_type", "page_title"]
#     with open(filename, mode="w", newline="", encoding="utf-8") as file:
#         writer = csv.DictWriter(file, fieldnames=fieldnames)
#         writer.writeheader()
#         writer.writerows(links_data)
#     print(f"Links data saved to {filename}")

# # New function for dynamic scraping using Selenium
# def scrape_dynamic_website(url, dropdown_option_text, dropdown_id, submit_button_id):
#     chrome_options = Options()
#     chrome_options.add_argument("--headless")
#     driver = webdriver.Chrome(options=chrome_options)
#     try:
#         driver.get(url)
#         wait = WebDriverWait(driver, 10)
#         dropdown_element = wait.until(EC.presence_of_element_located((By.ID, dropdown_id)))
#         select = Select(dropdown_element)
#         select.select_by_visible_text(dropdown_option_text)
#         submit_button = wait.until(EC.element_to_be_clickable((By.ID, submit_button_id)))
#         submit_button.click()
#         wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, "a")))
#         html = driver.page_source
#     finally:
#         driver.quit()
    
#     soup = BeautifulSoup(html, "html.parser")
#     page_title = soup.title.string.strip() if soup.title else "No Title"
#     links_data = []
#     for link in soup.find_all("a", href=True):
#         link_text = link.text.strip()
#         link_url = urljoin(url, link["href"])
#         link_description = link.get("title", "").strip()
#         parent_section = ""
#         for parent in link.parents:
#             if parent.name in ["h1", "h2", "h3", "h4", "h5", "h6"]:
#                 parent_section = parent.text.strip()
#                 break
#         link_type = "internal" if url in link_url else "external"
#         links_data.append({
#             "text": link_text,
#             "url": link_url,
#             "description": link_description,
#             "parent_section": parent_section,
#             "link_type": link_type,
#             "page_title": page_title
#         })
#     return links_data

# def main():
#     st.title("Website Chatbot")
#     st.write("Welcome to the Website Chatbot! Ask me anything about the website or the local PDFs, and I'll guide you.")
    
#     # Choose which mode to scrape: static (all links) or dynamic (based on dropdown interaction)
#     mode = st.radio("Select Scraping Mode", ["Static", "Dynamic"])
    
#     website_url = "https://ncert.nic.in"
    
#     if mode == "Static":
#         with st.spinner("Scraping static website..."):
#             links_data = scrape_static_website(website_url)
#         write_to_csv(links_data, filename="website_links.csv")
#         st.success("Static links data saved to website_links.csv")
#         st.table(links_data)
    
#     else:
#         # For dynamic scraping, the user provides additional details
#         st.write("For dynamic scraping, please provide the dropdown option and element IDs.")
#         dropdown_option = st.text_input("Dropdown Option", "Option Text Here")
#         dropdown_id = st.text_input("Dropdown Element ID", "dropdown_id")
#         submit_button_id = st.text_input("Submit Button ID", "submit_button_id")
        
#         if st.button("Scrape Dynamic Content"):
#             with st.spinner("Scraping dynamic website..."):
#                 links_data = scrape_dynamic_website(website_url, dropdown_option, dropdown_id, submit_button_id)
#             write_to_csv(links_data, filename="website_links.csv")
#             st.success("Dynamic links data saved to website_links.csv")
#             st.table(links_data)

# if __name__ == "__main__":
#     main()





