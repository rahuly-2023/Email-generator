// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password || !name) {
        alert("All Fields Are Required");
        return;
      }
  
      const response = await axios.post("http://localhost:5000/api/register", { email, password, name });
      if (response.data.token) {
        // Store token in localStorage or sessionStorage
        localStorage.setItem("token", response.data.token);
        navigate("/"); // Redirect to Home after successful registration
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Registration error", error.response.data);
      alert(`Registration failed : ${error.response.data.message}`);
    }
  };

  return (
    <div className="login-register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="login-register-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="login-register-input"
        />
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

        <button type="submit" className="login-register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
