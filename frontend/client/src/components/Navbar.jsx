import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, isGuest, logout, guestLogin, owner } = useContext(AuthContext);
  const ownerName = localStorage.getItem("ownerName");


  return (
    <nav className="nav">
      <h1 className="nav-header">Event Management System</h1>
      
      {isAuthenticated || isGuest ? (
        <>
          <Link to="/">Home</Link>
          <Link to="/events">View Previous Events</Link>
          <Link to="/create-event">Create New Event</Link>
          <Link to="/scan">QR Scan</Link>
          <span className="nav-username">Welcome {isGuest? "Guest" :ownerName}</span>
          <button className="nav-button" onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <button className="nav-button" onClick={guestLogin}>Guest Login</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;