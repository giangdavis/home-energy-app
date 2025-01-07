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
import { ArrowUp, ArrowDown, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card.jsx";

// Register Chart.js components
ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, Legend);

// Energy cost per kWh
const ENERGY_COST_PER_KWH = 0.15;

const EnergySummary = ({ userId }) => {
  // State management
  const [period, setPeriod] = useState("monthly");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [todayUsage, setTodayUsage] = useState(0);
  const [monthlyAverage, setMonthlyAverage] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [vsYesterday, setVsYesterday] = useState(0);
  const [vsLastMonth, setVsLastMonth] = useState(0);

  // Fetch data
  const fetchSummary = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please sign in again.");

      const queryParams = new URLSearchParams({ period, userId }).toString();
      const response = await fetch(
        `https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/summary?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      console.log(data);

      // Sort data by date to ensure the most recent usage is last
      const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Get today's usage (most recent usage value)
      const sortedDailyData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      const dailyUsage = sortedDailyData[sortedDailyData.length - 1]?.usage || 0;

      // Calculate monthly average
      const sortedMonthlyData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      const monthlyUsage = sortedMonthlyData.reduce((sum, item) => sum + item.usage, 0) / sortedMonthlyData.length;

      const calculatedCost = monthlyUsage * ENERGY_COST_PER_KWH;

      setTodayUsage(dailyUsage);
      setMonthlyAverage(monthlyUsage);
      setEstimatedCost(calculatedCost);

      // Transform data for chart
      transformChartData(data);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Transform data for Chart.js
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

  // Fetch data on component load or when period changes
  useEffect(() => {
    fetchSummary();
  }, [period]);

  // UI Render
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">Track and manage your energy consumption</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Today's Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Usage</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayUsage.toFixed(1)} kWh</div>
            <p className="text-xs text-muted-foreground">
              <span className={`inline-flex items-center ${vsYesterday < 0 ? "text-green-500" : "text-red-500"}`}>
                {vsYesterday < 0 ? <ArrowDown className="mr-1 h-4 w-4" /> : <ArrowUp className="mr-1 h-4 w-4" />}
                {Math.abs(vsYesterday)}%
              </span>{" "}
              vs. yesterday
            </p>
          </CardContent>
        </Card>

        {/* Monthly Average */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyAverage.toFixed(1)} kWh</div>
            <p className="text-xs text-muted-foreground">
              <span className={`inline-flex items-center ${vsLastMonth < 0 ? "text-green-500" : "text-red-500"}`}>
                {vsLastMonth < 0 ? <ArrowDown className="mr-1 h-4 w-4" /> : <ArrowUp className="mr-1 h-4 w-4" />}
                {Math.abs(vsLastMonth)}%
              </span>{" "}
              vs. last month
            </p>
          </CardContent>
        </Card>

        {/* Estimated Cost */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
            <Zap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${estimatedCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Based on current usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="bg-app-gray rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Usage Trends</h3>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-app-dark text-white px-3 py-1 rounded border border-gray-700"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : chartData ? (
          <div className="h-64">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: "rgba(255, 255, 255, 0.1)" },
                    ticks: { color: "#a0a0a0" },
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: "#a0a0a0" },
                  },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EnergySummary;
