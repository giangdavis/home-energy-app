
import React, { useState, FormEvent, ChangeEvent } from "react";
import axios, { AxiosResponse } from "axios";

type FileUploadFormProps = {
  userId: string;
};

type PreSignedUrlResponse = {
  uploadUrl: string;
  fileKey: string;
};

const FileUploadForm: React.FC<FileUploadFormProps> = ({ userId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
    setUploadResult("");
  };

  const handleFileUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setUploadResult("Error: Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadResult("Starting upload process...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      setUploadResult("Getting upload URL...");
      const urlResponse: AxiosResponse<PreSignedUrlResponse> = await axios.post(
        `https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/upload?userId=${userId}`,
        {},
        { headers }
      );

      if (!urlResponse.data.uploadUrl) {
        throw new Error("Failed to get upload URL");
      }

      setUploadResult("Uploading file to S3...");
      await axios.put(urlResponse.data.uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      setUploadResult(`File uploaded successfully! Upload Location: ${urlResponse.data.fileKey}`);
      setFile(null);
    } catch (error: any) {
      setUploadResult(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Bulk Upload</h2>
      <form onSubmit={handleFileUpload}>
        <label htmlFor="file">Upload CSV File:</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          id="file"
          disabled={isUploading}
        />
        <button type="submit" disabled={!file || isUploading}>
          {isUploading ? "Uploading..." : "Upload File"}
        </button>
      </form>
      <pre>{uploadResult}</pre>
    </div>
  );
};

export default FileUploadForm;
