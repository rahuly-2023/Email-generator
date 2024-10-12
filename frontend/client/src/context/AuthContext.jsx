import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// const navigate = useNavigate();

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isGuest, setIsGuest] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    // const storedIsGuest = localStorage.getItem("isGuest");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    // if (storedIsGuest === "true") {
    //   setIsGuest(true);
    //   setIsAuthenticated(false);
    // }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);


  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      if (response.status === 200) {
        if (response.data.token) {
          // Store token in localStorage or sessionStorage
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("ownerName", response.data.name);
          setIsAuthenticated(true);
          // setIsGuest(false);
          console.log("Email ",response.data.email);
          setUser({ email: response.data.email }); // Set the user's email in the AuthContext
        } else {
          alert("Invalid email or password");
        }
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      if (error.response) {
        console.error("Login error", error.response.data);
        alert("Login failed. Please try again.");
      } else {
        console.error("Login error", error.message);
        alert("Login failed. Please try again.");
      }
    }
  };

  const guestLogin = async() => {
    // setIsGuest(true);
    // setIsAuthenticated(false);
    // localStorage.setItem("isGuest", "true");

    const guestEmail = 'guest@user.com';
    const guestName = 'guest';
    const guestPassword = 'guest';
    // const guestUser = {
    //   email: 'guest@user.com',
    //   password: 'guest',
    //   name: 'guest'
    // };
    try {
      const res = await axios.get(`http://localhost:5000/api/user-exists?guestEmail=${guestEmail}`);
      if (!res.data.exists) {
        console.log("Guest account doesnt exist, made one");
        await axios.post('http://localhost:5000/api/register',{email: guestEmail, password:guestPassword, name:guestName});
      }
      const response = await axios.post("http://localhost:5000/api/login", {email: guestEmail, password: guestPassword});
      if (response.status === 200) {
        if (response.data.token) {
          // Store token in localStorage or sessionStorage
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("ownerName", response.data.name);
          setIsAuthenticated(true);
          // setIsGuest(true);
          console.log("Email ",response.data.email);
          setUser({ email: response.data.email }); // Set the user's email in the AuthContext
          // navigate("/", { replace: true });
        } else {
          alert("Guest Login Error, Try again");
        }
      } else {
        alert("Guest Login Error, Try again");
      }
    } catch (error) {
      console.error("Login error", error);
      alert("Login2 failed. Please try again.");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    // setIsGuest(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ login, guestLogin, logout, isAuthenticated, user, token}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // Export the useAuth hook

export { AuthProvider, AuthContext };