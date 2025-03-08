// src/components/PdfUploader.js
import React, { useState } from 'react';
import axios from 'axios';

function PdfUploader() {
  const [pdfFile, setPdfFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePdfChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (!pdfFile) {
      alert('Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('text', textInput);

    setLoading(true);
    try {
      const response = await axios.post('/api/gemini', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.geminiResponse);
    } catch (error) {
      console.error('Error:', error);
      setResult('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        placeholder="Enter optional text"
        value={textInput}
        onChange={handleTextChange}
      />
      <br />
      <input type="file" accept=".pdf" onChange={handlePdfChange} />
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Send PDF to Gemini'}
      </button>
      <br />
      {result && <div style={{ whiteSpace: 'pre-wrap' }}>{result}</div>}
    </div>
  );
}

export default PdfUploader;