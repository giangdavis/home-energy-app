import React, { useState } from "react";
import axios from "axios";

const initialValues = {
  year: "",
  usage: "",
};

const SingleEntryForm = ({ userId }) => {
  const [values, setValues] = useState(initialValues);
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("");

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please sign in again.');
      }

      const response = await axios.post(
        "https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/input",
        {
          userId: userId,
          date: values.year,
          usage: Number(values.usage),
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(response);
      setResult("Energy data saved successfully");
      setValues(initialValues);
    } catch (error) {
      console.error('Submission error:', error);
      let errorMessage = 'Failed to save energy data: ';

      if (error.response) {
        // Server responded with error
        errorMessage += error.response.data?.error || error.response.data?.message || error.message;
        
        // Handle authentication errors
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = 'Authentication error. Please sign in again.';
          // Optionally redirect to login
          // window.location.href = '/signin';
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        // Error setting up request
        errorMessage += error.message;
      }

      setResult(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Single Entry Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="year">Date (YYYY-MM-DD):</label>
        <br />
        <input
          type="date"
          name="year"
          value={values.year}
          onChange={handleInputChange}
          id="year"
          required
          disabled={isSubmitting}
        />
        <br />
        <br />

        <label htmlFor="usage">Usage:</label>
        <br />
        <input
          type="number"
          name="usage"
          value={values.usage}
          onChange={handleInputChange}
          id="usage"
          step="0.01"
          min="0"
          required
          disabled={isSubmitting}
        />
        <br />
        <br />

        <button 
          type="submit" 
          id="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      <p style={{ 
        color: result.includes('successfully') ? 'green' : 'red',
        marginTop: '10px'
      }}>
        {result}
      </p>
    </div>
  );
};

export default SingleEntryForm;