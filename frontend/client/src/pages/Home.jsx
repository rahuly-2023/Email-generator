import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <h2 className="home-header">Welcome to the Event Management System</h2>
      <div className="home-section">
        <h3 className="home-subheader">Create a New Event</h3>
        <Link to="/create-event" className="home-button">Go to Create Event</Link>
      </div>
      <div className="home-section">
        <h3 className="home-subheader">View Previous Events</h3>
        <Link to="/events" className="home-button">Go to View Events</Link>
      </div>
    </div>
  );
};

export default Home;