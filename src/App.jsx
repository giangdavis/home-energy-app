import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import SingleEntryForm from "./components/SingleEntryForm";
import FileUploadForm from "./components/FileUploadForm";
import HistoricalDataForm from "./components/HistoricalDataForm";
import ConfirmAccount from "./components/ConfirmAccount";

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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Check if the user is already authenticated
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  const handleSignIn = (userId) => {
    setIsAuthenticated(true);
    setUserId(userId);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserId("");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };


  return (
    <Router>
      <div style={appStyle}>
        {isAuthenticated ? (
          <div>
            <h1>Welcome, {userId}!</h1>
            <SingleEntryForm userId={userId} />
            <FileUploadForm />
            <HistoricalDataForm />
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div>
            <h1>Home Energy Data</h1>
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
              <Route path="*" element={<Navigate to="/signin" />} />
              <Route path="/confirm-account" element={<ConfirmAccount />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;