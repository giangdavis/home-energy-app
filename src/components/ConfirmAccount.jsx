import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ConfirmAccount = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const usernameParam = params.get("username");
    if (usernameParam) {
      setUsername(usernameParam);
    }
  }, [location]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await axios.post(
        "https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/auth/confirm",
        { username, confirmationCode }
      );
      alert("Account confirmed successfully!");
      navigate("/signin");
    } catch (error) {
      setError(error.response?.data?.error || "Error confirming account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      await axios.post(
        "https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/auth/resend-code",
        { username }
      );
      alert("Verification code resent successfully!");
    } catch (error) {
      setError(error.response?.data?.error || "Error resending code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Confirm Your Account</h2>
      {error && <div>{error}</div>}
      <form onSubmit={handleConfirm}>
        <div>
          <input
            type="text"
            placeholder="Confirmation Code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Confirming..." : "Confirm Account"}
        </button>
      </form>
      <button onClick={handleResendCode} disabled={isLoading}>
        {isLoading ? "Sending..." : "Resend Code"}
      </button>
    </div>
  );
};

export default ConfirmAccount;