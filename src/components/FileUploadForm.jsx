import React, { useState } from "react";
import axios from "axios";

const FileUploadForm = ({ userId }) => {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadResult(""); // Clear previous results
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setUploadResult("Error: Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadResult("Starting upload process...");

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please sign in again.');
      }

      // Common headers for all requests
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // 1. Get pre-signed URL
      setUploadResult("Getting upload URL...");
      console.log(`Requesting upload URL for user: ${userId}`);
      
      const urlResponse = await axios.post(
        `https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/upload?userId=${userId}`,
        {},
        { headers }
      );

      console.log('Pre-signed URL response:', urlResponse.data);

      if (!urlResponse.data.uploadUrl) {
        throw new Error('Failed to get upload URL');
      }

      // 2. Upload file using pre-signed URL
      setUploadResult("Uploading file to S3...");
      const uploadResponse = await axios.put(
        urlResponse.data.uploadUrl,
        file,
        {
          headers: {
            'Content-Type': 'text/csv',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );

      console.log('S3 upload response:', uploadResponse);

      setUploadResult(
        `File uploaded successfully!\n` +
        `File: ${file.name}\n` +
        `Size: ${(file.size / 1024).toFixed(2)} KB\n` +
        `Type: ${file.type}\n` +
        `Upload Location: ${urlResponse.data.fileKey}`
      );

      // Clear file input after successful upload
      setFile(null);
      const fileInput = document.getElementById('file');
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Upload failed: ';

      if (error.response) {
        // Server responded with error
        errorMessage += error.response.data?.message || error.response.data?.error || error.message;
      } else if (error.request) {
        // Request made but no response
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        // Error setting up request
        errorMessage += error.message;
      }

      setUploadResult(errorMessage);

      // Handle authentication errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Optionally redirect to login
        // window.location.href = '/signin';
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Bulk Upload</h2>
      <form onSubmit={handleFileUpload}>
        <label htmlFor="file">Upload CSV File:</label>
        <br />
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          id="file"
          disabled={isUploading}
        />
        <br />
        <br />
        <button 
          type="submit" 
          disabled={!file || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
      <pre style={{ 
        whiteSpace: 'pre-wrap', 
        wordBreak: 'break-word',
        marginTop: '10px'
      }}>
        {uploadResult}
      </pre>
    </div>
  );
};

export default FileUploadForm;