import React, { useState } from "react";

const CostEstimation = ({ userId }) => {
  const [values, setValues] = useState({
    startDate: "",
    endDate: "",
    costPerKwh: "",
  });
  const [result, setResult] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleCalculate = async (event) => {
    event.preventDefault();
    setIsCalculating(true);
    setResult("");

    try {
      const params = {
        userId,
        startDate: values.startDate,
        endDate: values.endDate,
        costPerKwh: String(values.costPerKwh || 0.12), // Ensure costPerKwh is a string
      };

      const queryParams = new URLSearchParams(params).toString();

      const response = await fetch(
        `https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/cost-estimation?${queryParams}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(`Total Usage: ${data.totalUsage} kWh\nTotal Cost: $${data.totalCost.toFixed(2)}`);
    } catch (error) {
      console.error("Calculation error:", error);
      setResult(`Error: ${error.message}`);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div>
      <h2>Cost Estimation</h2>
      <form onSubmit={handleCalculate}>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={values.startDate}
            onChange={handleInputChange}
            id="startDate"
            required
            disabled={isCalculating}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            name="endDate"
            value={values.endDate}
            onChange={handleInputChange}
            id="endDate"
            required
            disabled={isCalculating}
          />
        </div>

        <div className="form-group">
          <label htmlFor="costPerKwh">Cost per kWh (USD):</label>
          <input
            type="number"
            name="costPerKwh"
            value={values.costPerKwh}
            onChange={handleInputChange}
            id="costPerKwh"
            step="0.01"
            min="0"
            placeholder="Default: 0.12"
            disabled={isCalculating}
          />
        </div>

        <div className="form-group">
          <button type="submit" disabled={isCalculating}>
            {isCalculating ? "Calculating..." : "Calculate"}
          </button>
        </div>
      </form>

      {result && (
        <pre
          style={{
            color: result.includes("Total Cost") ? "green" : "red",
            marginTop: "10px",
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
};

export default CostEstimation;
