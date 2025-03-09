<template>
  <div class="app-container">
    <!-- Left-side Logo/Branding -->
    <div class="branding">
      <div class = 'banana'>
        <img src="/image.png" alt="RxJuris Logo" class="branding-logo" />
        <h1>RxJuris</h1>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="content-wrapper">
      <!-- Header/Title Section -->
      <div class="header-section">
        <h2>Medio- Legal Consent Reader</h2>
        <p>
          Ensure accuracy and compliance in consent forms and medical documentation with AI-driven validation
        </p>
        <div class="badges">
          <span class="badge">HIPAA Compliant</span>
          <span class="badge">Real Time Feedback</span>
        </div>
      </div>

      <!-- Select Medical Note Format Section -->
      <div class="note-format-section">
        <h3>Select Medical Note Format</h3>
        <div class="format-cards">
          <!-- Consent Form Processing Card -->
          <div class="format-card">
            <h4>Consent Form Processing</h4>
            <p>
              Verify patient details, procedure accuracy, and legal compliance
            </p>
            <label class="upload-label" for="pdfUpload">
              Upload PDF
            </label>
            <input
              id="pdfUpload"
              class="file-input"
              type="file"
              accept="application/pdf"
              @change="handlePdfUpload"
            />
          </div>

          <!-- Radiology Image Processing Card -->
          <div class="format-card">
            <h4>Radiology Image Processing</h4>
            <p>
              Verify procedure accuracy and compliance for imaging records
            </p>
            <label class="upload-label" for="imageUpload">
              Upload Image
            </label>
            <input
              id="imageUpload"
              class="file-input"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
            />
          </div>
        </div>
      </div>

      <!-- Language Selection -->
      <div class="language-section">
        <label for="languageSelect">Select Language: </label>
        <select id="languageSelect" v-model="selectedLanguage">
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <!-- Add more languages as needed -->
        </select>
      </div>

      <!-- Display API Response -->
      <div v-if="response" class="response-section">
        <h3>Response:</h3>
        <pre>{{ response }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      selectedLanguage: "English",
      response: null,
    };
  },
  methods: {
    async handlePdfUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Create form data with the PDF and fixed prompt.
      
      const formData = new FormData();
      formData.append("documents", file);
      formData.append("prompt", "give medial advice");

      try {
        const res = await fetch("/api/gemini", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log(data)
        this.response = data.geminiResponse || data.error;
      } catch (error) {
        console.error("Error uploading PDF:", error);
        this.response = error.toString();
      }
    },
  },
};
import './App.css'; // Import the CSS file here
</script>
