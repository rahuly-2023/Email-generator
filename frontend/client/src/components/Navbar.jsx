import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, guestLogin, owner } = useContext(AuthContext);
  const ownerName = localStorage.getItem("ownerName");

  return (
    <nav className="flex gap-10 items-center py-4 border justify-between px-10">
      <div className=" flex justify-start w-48">
        <img
          src="\cover.png"
          alt="logo"
          className="object-contain"
        />
      </div>

      <div className=" justify-start">
        <ul className="  flex justify-between items-center text-lg ">
          {isAuthenticated ? (
            <>
              <li className="mr-4">
                <Link to="/" className="text-gray-600 hover:text-gray-900 border-e-2 border-e-gray-300 pr-2">
                  Home
                </Link>
              </li>
              <li className="mr-4">
                <Link to="/events" className="text-gray-600 hover:text-gray-900 border-e-2 border-e-gray-300 pr-2">
                  View Previous Events
                </Link>
              </li>
              <li className="mr-4">
                <Link to="/create-event" className="text-gray-600 hover:text-gray-900 border-e-2 border-e-gray-300 pr-2">
                  Create New Event
                </Link>
              </li>
              <li className="mr-4">
                <Link to="/scan" className="text-gray-600 hover:text-gray-900 ">
                  QR Scan
                </Link>
              </li>
              <li className="mr-4">
                <span className="nav-username rounded-md p-2 bg-yellow-300 bg-navy text-white py-2 px-4">Welcome {ownerName}</span>
              </li>
              <li>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="mr-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
              </li>
              <li className="mr-4">
                <Link to="/register" className="text-gray-600 hover:text-gray-900">
                  Register
                </Link>
              </li>
              <li>
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-yellow  font-bold py-2 px-4 rounded-lg bg-navy"
                  onClick={guestLogin}
                >
                  Guest Login
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

    </nav>
  );
};

export default Navbar;