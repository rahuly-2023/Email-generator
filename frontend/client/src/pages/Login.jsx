import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated, isGuest } = useAuth();
  const navigate = useNavigate();

  // if (isAuthenticated) {
  //   return navigate("/", { replace: true });
  // }

  // if (isAuthenticated || isGuest) {
  //   navigate("/", { replace: true });
  //   return null;
  // }
  useEffect(() => {
    if (isAuthenticated || isGuest) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isGuest, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    navigate("/", { replace: true });     //if not true then after redirecting to HOME, still the body shows login form
  };

  return (
    <div className="login-register-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-register-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="login-register-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="login-register-input"
        />
        <button type="submit" className="login-register-button">Login</button>
      </form>
    </div>
  );
};

export default Login;