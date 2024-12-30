import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, Legend);

const EnergySummary = ({ userId }) => {
  const [period, setPeriod] = useState("monthly"); // Default to monthly
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please sign in again.");
      }

      const queryParams = new URLSearchParams({
        period,
        userId,
      }).toString();

      const response = await fetch(
        `https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/summary?${queryParams}`,
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

      const data = await response.json();
      transformChartData(data);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const transformChartData = (data) => {
    const labels = data.map((item) => item.date);
    const usageData = data.map((item) => item.usage);

    setChartData({
      labels,
      datasets: [
        {
          label: `Energy Consumption (${period})`,
          data: usageData,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    fetchSummary();
  }, [period]);

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  return (
    <div className="component-section">
      <h2>Energy Consumption Trends</h2>

      <div className="period-selector">
        <label>
          Select Period:
          <select value={period} onChange={handlePeriodChange} disabled={loading}>
            <option value="daily">Daily (Last 30 Days)</option>
            <option value="weekly">Weekly (Last 9 Weeks)</option>
            <option value="monthly">Monthly (Last 12 Months)</option>
          </select>
        </label>
      </div>

      {loading && <p>Loading...</p>}

      {error && <div className="alert">{error}</div>}

      {chartData && (
        <div className="chart-container">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                },
                tooltip: {
                  mode: "index",
                  intersect: false,
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: period === "monthly" ? "Month" : "Date",
                    font: {
                      size: 14,
                    },
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Usage (kWh)",
                    font: {
                      size: 14,
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EnergySummary;