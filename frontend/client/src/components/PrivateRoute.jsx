// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isGuest } = useAuth();

  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
