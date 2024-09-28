import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ViewPreviousEvents = () => {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  console.log(user.email);
  

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get(`http://localhost:5000/api/view-events?ownerEmail=${user.email}`);
      // console.log(response);
      
      setEvents(response.data);
    };
    fetchEvents();
  }, [user]);

  return (
    <div>
      <h2>View Previous Events</h2>
      <div className="view-previous-events-container">
        {events.map((event) => (
          <Link to={`/event/${event._id}`} key={event._id}>
            <div className="view-previous-events-list">
              <h3>{event.name}</h3>
              <p>Date: {event.date}</p>
              <p>Time: {event.time}</p>
              <p>Venue: {event.venue}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ViewPreviousEvents;










// return (
//   <div>
//     <h2>View Previous Events</h2>
//     <div className="view-previous-events-container">
//       {events.map((event) => (
//         <Link to={`/events/${event._id}`} key={event._id}>
//           <div className="view-previous-events-list">
//             <h3>{event.name}</h3>
//             <p>Date: {event.date}</p>
//             <p>Time: {event.time}</p>
//             <p>Venue: {event.venue}</p>
//           </div>
//         </Link>
//       ))}
//     </div>
//   </div>
// );