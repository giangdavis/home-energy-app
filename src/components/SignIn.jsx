import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SignIn = ({ onSignIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/auth/login",
        { username, password }
      );
      console.log(response.data);
      const { token, userId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      onSignIn(userId);
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <div>
          <h2 className="text-center text-3xl font-bold text-white mb-2">
            Home Energy Data
          </h2>
          <p className="text-center text-sm text-gray-400">
            Sign in to start tracking your energy usage
          </p>
        </div>

        <div className="mt-8 bg-app-gray p-8 rounded-lg">
          <form onSubmit={handleSignIn}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm text-gray-300">
                  Username:
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full rounded border border-gray-700 p-2 bg-app-dark text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-gray-300">
                  Password:
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded border border-gray-700 p-2 bg-app-dark text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
                <Link
                  to="/signup"
                  className="bg-app-dark text-gray-300 p-2 rounded text-center hover:bg-gray-700 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
