from flask import Flask, request, jsonify
from google import genai
import os
import base64

app = Flask(__name__)

api_key = os.getenv("API_KEY")
client = genai.Client(api_key=api_key)

@app.route("/api/gemini", methods=["POST"])
def gemini_api():
    data = request.get_json()
    text = data.get("text")
    image_base64 = data.get("image")

    contents = [text]

    if image_base64:
        image_bytes = base64.b64decode(image_base64)
        image_part = {"mime_type": "image/jpeg", "data": image_bytes} #Adjust mime type if needed.
        contents = [text, image_part]

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=contents,
        )
        return jsonify({"geminiResponse": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)