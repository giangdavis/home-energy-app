import React, { useState } from 'react';
import axios from 'axios';

const AlertsForm = ({ userId }) => {
  const [threshold, setThreshold] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/alerts',
        {
          userId: userId,
          threshold: Number(threshold)
        }
      );
      setResult('Alert threshold set successfully!');
      setThreshold(''); // Clear form after success
    } catch (error) {
      console.error('Error setting alert:', error);
      setResult('Failed to set alert threshold. Please try again.');
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
        />
        <br />
        <br />
        <button type="submit">Set Alert</button>
      </form>
      <p>{result}</p>
    </div>
  );
};

export default AlertsForm;