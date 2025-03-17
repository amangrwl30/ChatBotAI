import openai
import os
from dotenv import load_dotenv

class Chatbot:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OpenAI API key not found in environment variables")
        openai.api_key = api_key
        self.conversation_history = []
        
    def add_message(self, role, content):
        """Add a message to the conversation history"""
        self.conversation_history.append({"role": role, "content": content})
    
    def get_response(self, user_input):
        """Get response from the LLM"""
        try:
            # Add user message to history
            self.add_message("user", user_input)
            
            # Get response from OpenAI
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=self.conversation_history,
                max_tokens=150,
                temperature=0.7
            )
            
            # Extract and store assistant's response
            assistant_response = response.choices[0].message['content']
            self.add_message("assistant", assistant_response)
            
            return assistant_response
            
        except Exception as e:
            print(f"Error in get_response: {str(e)}")  # Debug logging
            return f"Error getting response: {str(e)}"
    
    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history = [] 