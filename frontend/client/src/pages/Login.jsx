import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("isAuth", isAuthenticated)
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    navigate("/", { replace: true });     //if not true then after redirecting to HOME, still the body shows login form
  };

  return (
    <div className="border mx-auto w-1/3 rounded-xl mt-20 h-1/2">
      <h2 className="border text-lg bg-navy text-yellow text-center rounded-lg">Login</h2>
      <form onSubmit={handleSubmit} className="mt-10">
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
        <button type="submit" className="rounded-lg bg-orange text-lg text-navy p-2 block mx-auto mt-10">Login</button>
      </form>
    </div>
  );
};

export default Login;