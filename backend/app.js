const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const textract = require('textract');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Use express.json() for non-multipart JSON bodies.
app.use(express.json());

// Configure multer to store uploaded files temporarily.
// Allow only PDF, DOCX, and DOC files.
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.docx', '.doc'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and DOC documents are allowed.'));
    }
  }
});

// Use GEMINI_API_KEY from your environment variables.
const apiKey = process.env.GEMINI_API_KEY;

app.post('/api/gemini', upload.array('documents', 10), async (req, res) => {
  let fileInputs = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.pdf') {
        // For PDFs, read the file into a buffer and send as inline data.
        const pdfBuffer = fs.readFileSync(file.path);
        fileInputs.push({
          inlineData: {
            data: pdfBuffer.toString('base64'),
            mimeType: 'application/pdf'
          }
        });
      } else if (ext === '.docx') {
        // For DOCX files, use Mammoth to extract text.
        try {
          const result = await mammoth.extractRawText({ path: file.path });
          const extractedText = result.value;
          fileInputs.push({ text: extractedText });
        } catch (extractionError) {
          console.error(`Error extracting DOCX text from ${file.originalname}:`, extractionError);
          fileInputs.push({ text: `Error extracting text from ${file.originalname}.` });
        }
      } else if (ext === '.doc') {
        // For DOC files, use textract to extract text.
        try {
          const extractedText = await new Promise((resolve, reject) => {
            textract.fromFileWithPath(file.path, (error, text) => {
              if (error) {
                reject(error);
              } else {
                resolve(text);
              }
            });
          });
          fileInputs.push({ text: extractedText });
        } catch (extractionError) {
          console.error(`Error extracting DOC text from ${file.originalname}:`, extractionError);
          fileInputs.push({ text: `Error extracting text from ${file.originalname}.` });
        }
      }
      // Remove the temporary file.
      fs.unlinkSync(file.path);
    }
  }

  // Process text prompts.
  let textInputs = [];
  const promptField = req.body.prompt;
  if (promptField) {
    if (Array.isArray(promptField)) {
      textInputs = promptField.map(t => ({ text: t }));
    } else {
      textInputs.push({ text: promptField });
    }
  }

  // Combine file inputs and text prompt inputs.
  const inputs = [...fileInputs, ...textInputs];
  if (inputs.length === 0) {
    return res.status(400).json({ error: 'No files or text prompts provided' });
  }

  try {
    // Create an instance of GoogleGenerativeAI with your API key.
    const genAI = new GoogleGenerativeAI(apiKey);
    // Choose the generative model (adjust model name if needed).
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    // Generate content using the combined inputs.
    const result = await model.generateContent(inputs);
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
