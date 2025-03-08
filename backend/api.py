import time
import hmac
import hashlib
import base64
import json
import requests
from dotenv import load_dotenv
import os
from google import genai

# Load the .env file
load_dotenv()

# Access the environment variables
api_key = os.getenv("API_KEY")

client = genai.Client(api_key=api_key)

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Explain how AI works",
)

print(response.text)


