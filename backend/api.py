from flask import Flask, request, jsonify
from google import genai
import os
import base64
from PyPDF2 import PdfReader
from pdf2image import convert_from_path
from io import BytesIO
from PIL import Image

app = Flask(__name__)

api_key = os.getenv("API_KEY")
client = genai.Client(api_key=api_key)

@app.route("/api/gemini", methods=["POST"])
def gemini_api():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files['pdf']
    text = request.form.get("text", "") #get optional text input.
    contents = [text]

    try:
        # Extract text from PDF
        pdf_reader = PdfReader(pdf_file)
        pdf_text = ""
        for page in pdf_reader.pages:
            pdf_text += page.extract_text() or ""
        contents = [pdf_text + "\n" + text] #add the pdf text to the content sent to gemini.

        #extract images from pdf.
        images = convert_from_path(pdf_file.filename)
        if len(images) > 0:
            buffered = BytesIO()
            images[0].save(buffered, format="JPEG") #Save the first page as a jpeg.
            img_str = base64.b64encode(buffered.getvalue()).decode()
            image_part = {"mime_type": "image/jpeg", "data": base64.b64decode(img_str)}
            contents = [pdf_text + "\n" + text, image_part]

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=contents,
        )
        return jsonify({"geminiResponse": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)