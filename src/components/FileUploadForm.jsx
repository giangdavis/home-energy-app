import React, { useState } from "react";
import axios from "axios";


const FileUploadForm = ({ userId }) => {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    setUploadResult("Starting upload process...");
    
    if (!file) {
      setUploadResult("Error: Please select a file first");
      return;
    }

    try {
      // 1. Get pre-signed URL
      setUploadResult("Getting upload URL...");
      console.log(userId);
      const urlResponse = await axios.post(
        `https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/upload?userId=${userId}`,
        {}
      );

      console.log('Pre-signed URL response:', urlResponse.data);

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

      setUploadResult(`File uploaded successfully!
        File: ${file.name}
        Size: ${(file.size / 1024).toFixed(2)} KB
        Type: ${file.type}
        Upload Location: ${urlResponse.data.fileKey}`);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult(
        `Upload failed: ${error.response?.data?.message || error.message}
        Details: ${JSON.stringify(error.response?.data?.details || {}, null, 2)}`
      );
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
        />
        <br />
        <br />
        <button type="submit">
          Upload File
        </button>
      </form>
      <p>{uploadResult}</p>
    </div>
  );
};

export default FileUploadForm;