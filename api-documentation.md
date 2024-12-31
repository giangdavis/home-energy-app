# Energy Monitoring System API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication) 
3. [API Endpoints](#api-endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
   - [Energy Data Endpoints](#energy-data-endpoints)
   - [Energy Summary](#energy-summary)  
   - [Export Data](#export-data)
   - [Cost Estimation](#cost-estimation)
   - [Alert Management](#alert-management)
4. [File Upload Specifications](#file-upload-specifications)  
5. [Error Handling](#error-handling)

## Overview

This document provides comprehensive documentation for the Energy Monitoring System API. The API allows users to manage energy usage data, set alerts, retrieve historical information, get energy summaries, export data, and estimate costs.

Base URL: `https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com`

## Authentication

All endpoints except `/auth/signup` and `/auth/login` require authentication using JWT tokens. Tokens should be included in the Authorization header using the Bearer scheme.

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  
```

## API Endpoints

### Authentication Endpoints

#### 1. User Registration
- **Endpoint**: `/auth/signup`
- **Method**: POST
- **Headers**: None required
- **Request Body**:  
  ```json
  {
    "username": "string",
    "email": "string", 
    "password": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "User registration successful"
  }
  ```

#### 2. User Login  
- **Endpoint**: `/auth/login`
- **Method**: POST
- **Headers**: None required
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string" 
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "userId": "string"
  }
  ```

#### 3. Account Confirmation
- **Endpoint**: `/auth/confirm` 
- **Method**: POST
- **Headers**: None required
- **Request Body**:
  ```json 
  {
    "username": "string",
    "confirmationCode": "string"
  }
  ```
- **Response**:  
  ```json
  {
    "message": "Account confirmed successfully" 
  }
  ```

### Energy Data Endpoints

#### 1. Single Energy Reading
- **Endpoint**: `/energy/input` 
- **Method**: POST
- **Headers**: 
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Request Body**:
  ```json
  {
    "userId": "string",  
    "date": "YYYY-MM-DD",
    "usage": number 
  }
  ```
- **Response**:
  ```json
  {  
    "message": "Energy data saved successfully"
  }
  ```

#### 2. Historical Data Retrieval
- **Endpoint**: `/energy/history`
- **Method**: GET 
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**: 
  - userId: string
  - startDate: YYYY-MM-DD
  - endDate: YYYY-MM-DD  
- **Response**:
  ```json
  [
    {
      "date": "YYYY-MM-DD",
      "usage": number
    }
  ]
  ```

#### 3. Bulk Upload
- **Endpoint**: `/energy/upload`
- **Method**: POST
- **Headers**: Authorization: Bearer {token} 
- **Query Parameters**: userId: string
- **Response**:
  ```json
  {
    "uploadUrl": "string",
    "fileKey": "string"  
  }
  ```

### Energy Summary

#### 1. Retrieve Energy Summary 
- **Endpoint**: `/energy/summary`
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - userId: string
  - period: string (daily, weekly, monthly)
- **Response**:
  ```json
  [
    {
      "date": "YYYY-MM-DD",
      "usage": number
    }
  ]
  ```

### Export Data

#### 1. Export Energy Data as CSV
- **Endpoint**: `/energy/export`
- **Method**: GET 
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - userId: string 
  - startDate: YYYY-MM-DD
  - endDate: YYYY-MM-DD
- **Response**:
  - **Headers**:
    ```
    Content-Type: text/csv
    Content-Disposition: attachment; filename="energy_data.csv"
    ```
  - **Body**:
    ```csv
    Date,Usage
    2024-01-01,25.5
    2024-01-02,27.3
    ```

### Cost Estimation

#### 1. Estimate Energy Cost
- **Endpoint**: `/energy/cost-estimation`
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**: 
  - userId: string
  - startDate: YYYY-MM-DD
  - endDate: YYYY-MM-DD
  - costPerKwh: number (default: 0.12)
- **Response**:  
  ```json
  {
    "totalUsage": number,
    "costPerKwh": number,
    "totalCost": number
  }
  ```

### Alert Management

#### 1. Set Usage Threshold
- **Endpoint**: `/alerts`
- **Method**: POST  
- **Headers**: 
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Request Body**:
  ```json
  {
    "userId": "string",
    "threshold": number  
  }
  ```
- **Response**:
  ```json
  {
    "message": "Alert threshold set successfully",
    "threshold": number
  }
  ```

## File Upload Specifications

### CSV File Format  
Files uploaded through the bulk upload endpoint must follow this format:

```csv 
date,usage
2024-01-01,25.5
2024-01-02,27.3
```

Requirements:
- File must be in CSV format  
- Required columns: date, usage
- Date format: YYYY-MM-DD
- Usage must be a numeric value representing kWh

## Error Handling

All endpoints use standard HTTP status codes and return error messages in a consistent format:

```json
{
  "error": "Error description"
}
```

Common Status Codes: 
- 200: Success
- 400: Bad Request (invalid input)
- 401: Unauthorized (invalid/missing token) 
- 403: Forbidden (unauthorized access)
- 500: Internal Server Error

Example Error Response:
```json
{
  "error": "Invalid threshold value"  
}
```