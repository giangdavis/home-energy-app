import React, { useState, FormEvent } from "react";

type DataItem = {
  date: string;
  usage: number;
};

type HistoricalDataFormProps = {
  userId: string;
};

const HistoricalDataForm: React.FC<HistoricalDataFormProps> = ({ userId }) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [data, setData] = useState<DataItem[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        userId,
      }).toString();

      const response = await fetch(
        `https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/history?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized access. Please sign in again.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData: DataItem[] = await response.json();
      setData(jsonData);
    } catch (err: any) {
      setError(`Error fetching data: ${err.message}`);
      console.error("Fetch error:", err);

      if (err.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-section">
      <h2>Historical Energy Usage</h2>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="date-group">
          <div className="input-group">
            <label htmlFor="startDate">Start Date:</label>
            <br />
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="input-box"
            />
          </div>

          <div className="input-group">
            <label htmlFor="endDate">End Date:</label>
            <br />
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="input-box"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="primary-button">
          {loading ? "Loading..." : "Fetch Data"}
        </button>
      </form>

      {error && <div className="alert">{error}</div>}

      {data.length > 0 && (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Usage (kWh)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.date}>
                  <td>{item.date}</td>
                  <td>{item.usage}</td>
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
