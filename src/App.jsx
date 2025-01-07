import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SingleEntryForm from './components/SingleEntryForm';
import FileUploadForm from './components/FileUploadForm';
import HistoricalDataForm from './components/HistoricalDataForm';
import ConfirmAccount from './components/ConfirmAccount';
import AlertsForm from './components/AlertsForm';
import ExportData from './components/ExportData';
import EnergySummary from './components/EnergySummary';
import CostEstimation from './components/CostEstimation';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setUserId(localStorage.getItem('userId'));
    }
  }, []);

  const handleSignIn = (userId) => {
    setIsAuthenticated(true);
    setUserId(userId);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserId('');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  return (
    <Router>
      <div className="min-h-screen bg-app-dark text-white">
        {isAuthenticated ? (
          <div className="flex">
            <Sidebar onSignOut={handleSignOut} />

            <div className="flex-1 p-8">
              <Routes>
                <Route path="/summary" element={<EnergySummary userId={userId} />} />
                <Route path="/new-entry" element={<SingleEntryForm userId={userId} />} />
                <Route path="/history" element={<HistoricalDataForm userId={userId} />} />
                <Route path="/upload" element={<FileUploadForm userId={userId} />} />
                <Route path="/alerts" element={<AlertsForm userId={userId} />} />
                <Route path="/export" element={<ExportData userId={userId} />} />
                <Route path="/trends" element={<EnergySummary userId={userId} />} />
                <Route path="/calculator" element={<CostEstimation userId={userId} />} />
                <Route path="*" element={<Navigate to="/summary" />} />
              </Routes>
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-app-gray p-8 rounded-lg w-full max-w-md">
              <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
                <Route path="/confirm-account" element={<ConfirmAccount />} />
                <Route path="*" element={<Navigate to="/signin" />} />
              </Routes>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
