// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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
  
      const response = await axios.post(`${BASE_URL}/api/register`, { email, password, name });
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
    <div className="border mx-auto w-1/3 rounded-xl mt-20 h-1/2">
      <h2 className="border text-lg bg-navy text-yellow text-center rounded-lg">Register</h2>
      <form onSubmit={handleSubmit} className="login-register-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="block mb-5 px-5 border rounded-lg mx-auto w-2/3 mt-10"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="block mb-5 px-5 border rounded-lg mx-auto w-2/3"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="block mb-5 px-5 border rounded-lg mx-auto w-2/3"
        />

        <button type="submit" className="rounded-lg bg-orange text-lg text-navy p-2 block mx-auto mt-10">Register</button>
      </form>
    </div>
  );
};

export default Register;
