
import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

type SignInProps = {
  onSignIn: (userId: string) => void;
};

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/auth/login", {
        username,
        password,
      });
      const { token, userId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      onSignIn(userId);
    } catch (error: any) {
      alert("Invalid username or password. Please try again.");
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
