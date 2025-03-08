const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Use express.json() for non-multipart JSON bodies.
app.use(express.json());

// Configure multer to store uploaded PDF files temporarily.
const upload = multer({ dest: 'uploads/' });

// Use GEMINI_API_KEY from your environment variables.
const apiKey = process.env.GEMINI_API_KEY;

app.post('/api/gemini', upload.array('pdf', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No PDF file provided' });
  }

  // Retrieve prompt text from form-data.
  // When using multipart/form-data, multer parses text fields into req.body.
  const promptText = req.body.prompt || 'Transcribe and summarize the PDF document.';

  try {
    // Process each uploaded PDF file.
    const pdfInputs = req.files.map(file => {
      // Read the file into a buffer.
      const pdfBuffer = fs.readFileSync(file.path);
      // Remove the temporary file.
      fs.unlinkSync(file.path);
      // Convert the PDF file into inline Base64 data.
      return {
        inlineData: {
          data: Buffer.from(pdfBuffer).toString('base64'),
          mimeType: 'application/pdf',
        },
      };
    });

    // Create an instance of GoogleGenerativeAI with your API key.
    const genAI = new GoogleGenerativeAI(apiKey);

    // Choose the generative model. Adjust model name if needed.
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Prepare the prompt as an object.
    const prompt = { text: promptText };

    // Combine PDF inputs and the prompt.
    // The prompt is appended as the last element.
    const inputs = [...pdfInputs, prompt];

    // Generate content using the combined inputs.
    const result = await model.generateContent(inputs);

    // Return the generated text.
    res.json({ geminiResponse: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
