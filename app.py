from langchain_community.document_loaders import CSVLoader  
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings  
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI  
from langchain.chains import LLMChain
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer  
from langchain.llms import Anthropic
from langchain_community.llms import HuggingFaceHub
import os

api_key = os.getenv("HUGGINGFACEHUB_API_TOKEN")


load_dotenv()

loader = CSVLoader(file_path="customers.csv")
documents = loader.load()

print(f"Loaded {len(documents)} documents.")  


#2 function to generate embeddings

model = SentenceTransformer('all-MiniLM-L6-v2')

class CustomEmbedding:
    def __call__(self, text):
        """FAISS expects a callable function, so we define __call__"""
        return model.encode(text, convert_to_tensor=False).tolist()

    def embed_documents(self, texts):
        """Function to embed multiple documents"""
        return model.encode(texts, convert_to_tensor=False).tolist()

    def embed_query(self, query):
        """Function to embed a single query"""
        return model.encode(query, convert_to_tensor=False).tolist()

embedding_model = CustomEmbedding()

# Extract text from documents
texts = [doc.page_content for doc in documents]

# Store in FAISS with the custom embedding function
db = FAISS.from_texts(texts, embedding_model)

def retrieve_info(query):
    similar_response = db.similarity_search(query, k=3)

    page_content_array = [doc.page_content for doc in similar_response]

    print(page_content_array)
    return page_content_array

# Example customer query
customer_message = """
Hi chatBot/Vishal,

I'm looking for information about only one customer Sheryl. Can you help me with that?

Regards, Singhal
"""

results = retrieve_info(customer_message)



#3 LLM model code

llm = HuggingFaceHub(
    repo_id="gpt2",  # Change model if needed
    huggingfacehub_api_token='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',
    model_kwargs={"temperature": 0.5, "max_length": 1000}
)

template = """
Hiiiiiiiii , {customer_message}
"""

prompt = PromptTemplate.from_template(template)

chain = prompt | llm

response = chain.invoke({"customer_message": customer_message})

print(response)

#print(response.content)