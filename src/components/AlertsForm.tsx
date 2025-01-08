import React, { useState } from 'react';
import axios from 'axios';

const AlertsForm = ({ userId }) => {
  const [threshold, setThreshold] = useState('');
  const [result, setResult] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please sign in again.');
      }

      const response = await axios.post(
        'https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/alerts',
        {
          userId: userId,
          threshold: Number(threshold)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setResult('Alert threshold set successfully!');
      setThreshold(''); // Clear form after success
    } catch (error) {
      console.error('Error setting alert:', error);
      let errorMessage = 'Failed to set alert threshold: ';

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
      <h2>Set Energy Usage Alert</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="threshold">Energy Usage Threshold (kWh):</label>
        <br />
        <input
          type="number"
          id="threshold"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          required
          min="0"
          step="0.01"
          disabled={isSubmitting}
          placeholder="Enter threshold value"
        />
        <br />
        <br />
        <button 
          type="submit"
          disabled={isSubmitting || !threshold}
        >
          {isSubmitting ? 'Setting Alert...' : 'Set Alert'}
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

export default AlertsForm;