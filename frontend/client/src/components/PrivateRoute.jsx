// src/components/PrivateRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  console.log("isAuthenticated", isAuthenticated);


  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setLoading(false);
    }
  }, [isAuthenticated]);


  if (loading) {
    return <div>Loading...</div>;
  }
  

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
