import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ViewPreviousEvents = () => {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  console.log(user.email);
  console.log(useAuth())
  

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get(`${BASE_URL}/api/view-events?ownerEmail=${user.email}`);
      // console.log(response);
      
      setEvents(response.data);
    };
    fetchEvents();
  }, [user]);

  return (
    <>

    <div className="flex flex-wrap justify-center mb-4 mt-10">
      {events.map((event) => (
        <div
        key={event._id}
        className="m-5 cursor-pointer ring-1 ring-gray-900/5 bg-white px-3 pb-3 max-w-sm rounded-lg overflow-hidden shadow-lg mb-4 mr-4  hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl "
        > 
          <Link to={`/event/${event._id}`}>
            <div className="px-4 py-4 transition-all duration-300 group-hover:bg-sky-400">
              
              <div className="bg-navy font-semibold text-yellow rounded-lg text-center text-lg py-2  transition-all">
                {event.name}
              </div>
              
              <div className="mt-3 transition-all duration-300 group-hover:text-white/90">
                <p className="text-base text-gray-600">
                  <span className="font-bold">Date:</span> {event.date}
                </p>
                <p className="text-base text-gray-600">
                  <span className="font-bold">Time:</span> {event.time}
                </p>
                <p className="text-base text-gray-600">
                  <span className="font-bold">Venue:</span> {event.venue}
                </p>
              </div>

              <div class="pt-3 text-base font-semibold leading-7">
                <p>
                  <div class="text-sky-500 transition-all duration-300 group-hover:text-white">View Details &rarr;</div>
                </p>
              </div>

            </div>
          </Link>
        </div>
      ))}
    </div>
    </>
  );
};

export default ViewPreviousEvents;