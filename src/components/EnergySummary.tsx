import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from "chart.js";

// Register required Chart.js components
ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, Legend);

// Define interfaces for the component props and data structures
interface EnergySummaryProps {
  userId: string;
}

interface EnergyDataItem {
  date: string;
  usage: number;
}

type PeriodType = "daily" | "weekly" | "monthly";

// Define the chart data structure
interface ChartDataStructure {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const EnergySummary: React.FC<EnergySummaryProps> = ({ userId }) => {
  const [period, setPeriod] = useState<PeriodType>("monthly");
  const [chartData, setChartData] = useState<ChartDataStructure | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchSummary = async (): Promise<void> => {
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

      const data: EnergyDataItem[] = await response.json();
      transformChartData(data);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const transformChartData = (data: EnergyDataItem[]): void => {
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
  }, [period, userId]); // Added userId to dependency array

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setPeriod(e.target.value as PeriodType);
  };

  // Define chart options with proper typing
  const chartOptions: ChartOptions<'bar'> = {
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
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default EnergySummary;