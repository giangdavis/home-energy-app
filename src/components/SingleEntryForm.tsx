
import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";

type SingleEntryFormProps = {
  userId: string;
};

const SingleEntryForm: React.FC<SingleEntryFormProps> = ({ userId }) => {
  const [values, setValues] = useState({ date: "", usage: "" });
  const [result, setResult] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      await axios.post(
        "https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/input",
        {
          userId,
          date: values.date,
          usage: Number(values.usage),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResult("Energy data saved successfully");
      setValues({ date: "", usage: "" });
    } catch (error: any) {
      setResult(`Failed to save energy data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Single Entry Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          name="date"
          value={values.date}
          onChange={handleInputChange}
          id="date"
          required
          disabled={isSubmitting}
        />
        <label htmlFor="usage">Energy Usage (kWh):</label>
        <input
          type="number"
          name="usage"
          value={values.usage}
          onChange={handleInputChange}
          id="usage"
          step="0.01"
          min="0"
          required
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      <p>{result}</p>
    </div>
  );
};

export default SingleEntryForm;
