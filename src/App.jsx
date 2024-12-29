import React from "react";
import SingleEntryForm from "./components/SingleEntryForm";
import FileUploadForm from "./components/FileUploadForm";
import HistoricalDataForm from "./components/HistoricalDataForm";

const App = () => {
  const appStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full height of the viewport
    width: "100vw",  // Full width of the viewport
    textAlign: "center",
    margin: "0", // Ensure no extra spacing
    padding: "20px",
    boxSizing: "border-box", // Include padding in dimensions
  };

  return (
    <div style={appStyle}>
      <h1>Energy Data Input</h1>
      <SingleEntryForm />
      <hr style={{ margin: "20px 0", width: "80%" }} />
      <FileUploadForm/>
      <hr style={{ margin: "20px 0", width: "80%" }} />
      <HistoricalDataForm/>
    </div>
  );
};

export default App;