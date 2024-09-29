import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import ViewPreviousEvents from "./pages/ViewPreviousEvents";
import EventDetails from "./pages/EventDetails";
import QRScan from "./pages/QRScan";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute

const App = () => {
  return (
    <div className="container">
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/create-event" element={<PrivateRoute><CreateEvent /></PrivateRoute>} />
            <Route path="/events" element={<PrivateRoute><ViewPreviousEvents /></PrivateRoute>} />
            <Route path="/event/:id" element={<PrivateRoute><EventDetails /></PrivateRoute>} />
            <Route path="/scan" element={<PrivateRoute><QRScan /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;