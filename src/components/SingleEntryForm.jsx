import React, { useState } from "react";
import axios from "axios";

const initialValues = {
  userId: "",
  year: "",
  usage: "",
};

const SingleEntryForm = () => {
  const [values, setValues] = useState(initialValues);
  const [result, setResult] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  function handleSubmit(event) {
    event.preventDefault();
 
    axios
      .post(
        "https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/input",
        {
          userId: values.userId,
          date: values.year,
          usage: Number(values.usage),
        }
      )
      .then((response) => {
        console.log(response);
        setResult("Energy data saved successfully")
      })
      .catch((error) => {
        console.log(error);
        console.log(values.userId + values.year + values.usage);
        setResult("Something went wrong!")
      });
  }

  return (
    <div>
      <h2>Single Entry Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userId">userId:</label>
        <br />
        <input
          type="text"
          name="userId"
          value={values.userId}
          onChange={handleInputChange}
          id="userId"
        />
        <br />
        <br />

        <label htmlFor="year">Date (YYYY-MM-DD):</label>
        <br />
        <input
          type="text"
          name="year"
          value={values.year}
          onChange={handleInputChange}
          id="year"
        />
        <br />
        <br />

        <label htmlFor="usage">Usage:</label>
        <br />
        <input
          type="text"
          name="usage"
          value={values.usage}
          onChange={handleInputChange}
          id="usage"
        />
        <br />
        <br />

        <button type="submit" id="submit-button">
          Submit
        </button>
      </form>
      <p>{result}</p>
    </div>
  );
};

export default SingleEntryForm;