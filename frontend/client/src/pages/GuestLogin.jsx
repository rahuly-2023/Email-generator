// src/pages/GuestLogin.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const GuestLogin = () => {
  const { guestLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return navigate("/", { replace: true });
  }
  

  const handleGuestLogin = () => {
    guestLogin(); // Call the guest login function
    navigate("/", { replace: true }); 
  };

  return (
    <div>
      <h2>Guest Login</h2>
      <button onClick={handleGuestLogin}>Login as Guest</button>
    </div>
  );
};

export default GuestLogin;
