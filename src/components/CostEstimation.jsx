import React, { useState } from "react";

const initialValues = {
  usage: "",
  costPerKwh: "",
};

const CostEstimation = () => {
  const [values, setValues] = useState(initialValues);
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
      const response = await fetch(
        `https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/cost-estimation?usage=${values.usage}&costPerKwh=${values.costPerKwh || 0.12}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(`Total Cost: $${data.totalCost.toFixed(2)}`);
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
        <label htmlFor="usage">Energy Usage (kWh):</label>
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
          disabled={isCalculating}
        />
        <br />
        <br />

        <label htmlFor="costPerKwh">Cost per kWh (USD):</label>
        <br />
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
        <br />
        <br />

        <button
          type="submit"
          id="calculate-button"
          disabled={isCalculating}
        >
          {isCalculating ? "Calculating..." : "Calculate"}
        </button>
      </form>
      <p style={{
        color: result.includes("Total Cost") ? "green" : "red",
        marginTop: "10px"
      }}>
        {result}
      </p>
    </div>
  );
};

export default CostEstimation;
