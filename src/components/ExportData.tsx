import React, { useState } from "react";

const ExportData = ({ userId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
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
        `https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/download?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized access. Please sign in again.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `energy_data_${userId}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Error exporting data: ${err.message}`);
      console.error("Export error:", err);

      if (err.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-section">
      <h2>Export Energy Data</h2>

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
          {loading ? "Exporting..." : "Export Data"}
        </button>
      </form>

      {error && <div className="alert">{error}</div>}
    </div>
  );
};

export default ExportData;