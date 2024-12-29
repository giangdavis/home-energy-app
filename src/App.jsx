import React, { useState } from "react";
import axios from "axios";

const initialValues = {
  userId: "",
  year: "",
  usage: "",
};

const App = () => {
  const [values, setValues] = useState(initialValues);
  const [result, setResult] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log('Input changing:', name, value);  // Debug line

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
    <div className="App">
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

        <div className="flex flex-col">
        <label htmlFor="year">Date (YYYY-MM-DD):</label>
        <br />
        <input
          type="text"
          name="year"
          value={values.year}
          onChange={handleInputChange}
          id="year"
        />
        </div>

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

export default App;
