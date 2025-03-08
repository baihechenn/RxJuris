import time
import hmac
import hashlib
import base64
import json
import requests
from dotenv import load_dotenv
import os

# Load the .env file
load_dotenv()

# Access the environment variables
api_key = os.getenv("API_KEY")

# Replace with your actual API credentials
api_key = f'{API_KEY}'
url = 'https://api.gemini.com/v1/order/new'

# Create the payload for a new order
payload = {
    "request": "/v1/order/new",
    "nonce": str(int(time.time() * 1000)),
    "symbol": "btcusd",         # Trading pair, e.g., BTC/USD
    "amount": "0.01",           # Order amount
    "price": "50000",           # Order price
    "side": "buy",              # Order side: "buy" or "sell"
    "type": "exchange limit"    # Order type: "exchange limit", "market", etc.
}

# Convert payload to JSON and encode to base64
encoded_payload = json.dumps(payload).encode()
b64_payload = base64.b64encode(encoded_payload)

# Create the signature using HMAC with SHA-384
signature = hmac.new(api_secret.encode(), b64_payload, hashlib.sha384).hexdigest()

# Set up the headers required for Gemini authentication
headers = {
    'Content-Type': 'text/plain',
    'Content-Length': '0',
    'X-GEMINI-APIKEY': api_key,
    'X-GEMINI-PAYLOAD': b64_payload.decode(),
    'X-GEMINI-SIGNATURE': signature
}

# Send the POST request
response = requests.post(url, headers=headers)
print(response.json())
