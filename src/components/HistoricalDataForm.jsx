import React, { useState } from 'react';

const HistoricalDataForm = ({userId}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        userId
      }).toString();

      const response = await fetch(
        `https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/history?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please sign in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(`Error fetching data: ${err.message}`);
      console.error('Fetch error:', err);
      
      // Handle authentication errors
      if (err.message.includes('Unauthorized')) {
        // You might want to trigger a sign-out or redirect to login
        localStorage.removeItem('token');
        // navigate('/signin'); // If using react-router
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h2>Historical Energy Usage</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label htmlFor="startDate" style={{ display: 'block', marginBottom: '5px' }}>
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              style={{ 
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '200px'
              }}
            />
          </div>
          
          <div>
            <label htmlFor="endDate" style={{ display: 'block', marginBottom: '5px' }}>
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              style={{ 
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '200px'
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
      </form>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {data.length > 0 && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ 
                  padding: '10px',
                  borderBottom: '2px solid #ddd',
                  textAlign: 'left'
                }}>
                  Date
                </th>
                <th style={{ 
                  padding: '10px',
                  borderBottom: '2px solid #ddd',
                  textAlign: 'left'
                }}>
                  Usage (kWh)
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.date}>
                  <td style={{ 
                    padding: '10px',
                    borderBottom: '1px solid #ddd'
                  }}>
                    {item.date}
                  </td>
                  <td style={{ 
                    padding: '10px',
                    borderBottom: '1px solid #ddd'
                  }}>
                    {item.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoricalDataForm;