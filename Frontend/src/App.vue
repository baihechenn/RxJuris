<template>
  <div class="app-container">
    <!-- Left-side Logo/Branding (if needed) -->
    <div class="branding">
      <h1>RxJuris</h1>
    </div>

    <!-- Main Content Section -->
    <div class="content-wrapper">
      <!-- Header/Title Section -->
      <div class="header-section">
        <h2>Medio- Legal Consent Reader</h2>
        <p>
          Ensure accuracy and compliance in consent forms and medical
          documentation with AI-driven validation
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
              Verify patient details, procedure accuracy,
              and legal compliance
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
              Verify procedure accuracy and compliance
              for imaging records
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
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      selectedLanguage: "English",
    };
  },
  methods: {
    handlePdfUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // Handle the PDF file here
        // Example: console.log(file)
        console.log("PDF uploaded:", file);
        // You can use FileReader, send the file to an API endpoint, etc.
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // Handle the image file here
        // Example: console.log(file)
        console.log("Image uploaded:", file);
      }
    },
  },
};
</script>

<style scoped>
/* Overall container with a light gray background */
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
  color: #000; /* Default text color */
  padding: 0px
}

/* Left branding section */
.branding {
  background-color: #ffffff;
  padding: 2rem 1.5rem;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* or center, depending on your needs */
  justify-content: center;
  min-width: 200px;
}

.branding h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
}

/* Main content wrapper */
.content-wrapper {
  flex: 1;
  padding: 2rem;
}

/* Header section with a soft blue background */
.header-section {
  background-color: #f0f4ff; /* slightly lighter than #e7f1ff */
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.header-section h2 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  color: #000;
}

.header-section p {
  margin: 0 0 1rem;
  color: #555; /* Slightly muted text for the description */
}


.badges {
  display: flex;
  justify-content: space-evenly;
  gap: 1rem;
  margin-top: 1rem;
}

.badge {
  background-color: #fff; 
  border: 1px solid #000; /* Black border to match screenshot text color */
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* "Select Medical Note Format" section */
.note-format-section h3 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #000;
}

/* Card container */
.format-cards {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Individual cards (Consent Form, Radiology Image, etc.) */
.format-card {
  background-color: #dfecf4;
  border-radius: 8px;
  /* Subtle shadow instead of a solid border */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  width: 280px;
  padding: 1.5rem;
  text-align: center;
}

.format-card h4 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: #000;
}

.format-card p {
  margin: 0 0 1rem;
  color: #555;
}

/* "Upload PDF" / "Upload Image" label styled as a button */
.upload-label {
  display: inline-block;
  background-color: #00264e;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

/* Hide the actual file input */
.file-input {
  display: none;
}

/* Language selection section */
.language-section {
  margin-top: 1rem;
}

.language-section label {
  margin-right: 0.5rem;
}

.language-section select {
  padding: 0.4rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
