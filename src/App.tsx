import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import SingleEntryForm from "./components/SingleEntryForm";
import FileUploadForm from "./components/FileUploadForm";
import HistoricalDataForm from "./components/HistoricalDataForm";
import ConfirmAccount from "./components/ConfirmAccount";
import AlertsForm from "./components/AlertsForm";
import ExportData from "./components/ExportData";
import EnergySummary from "./components/EnergySummary";
import CostEstimation from "./components/CostEstimation";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (token && storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    }
  }, []);

  const handleSignIn = (userId: string) => {
    setIsAuthenticated(true);
    setUserId(userId);
    localStorage.setItem("userId", userId);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserId("");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated ? (
          <div className="dashboard">
            <h1>Welcome, {userId}!</h1>

            <section className="component-section">
              <SingleEntryForm userId={userId} />
            </section>

            <hr className="section-divider" />

            <section className="component-section">
              <HistoricalDataForm userId={userId} />
            </section>

            <hr className="section-divider" />

            <section className="component-section">
              <FileUploadForm userId={userId} />
            </section>

            <hr className="section-divider" />

            <section className="component-section">
              <AlertsForm userId={userId} />
            </section>

            <hr className="section-divider" />

            <section className="component-section">
              <ExportData userId={userId} />
            </section>

            <hr className="section-divider" />

            <section className="component-section">
              <EnergySummary userId={userId} />
            </section>

            <hr className="section-divider" />

            <section className="component-section">
              <CostEstimation userId={userId} />
            </section>

            <button className="signout-button" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        ) : (
          <div className="auth-container">
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
