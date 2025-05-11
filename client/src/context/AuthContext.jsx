import axios from 'axios';
import { createContext, useState, useEffect, useContext } from 'react';
import React from 'react';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  function isJSON(str) {
    try {
      const parsed = JSON.parse(str);
      // Optionally check if result is an object or array
      return typeof parsed === 'object' && parsed !== null;
    } catch (e) {
      return false;
    }
  }
  async function fetchUserDetails(token){
    try {
      const {data} = await axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/userdetails`, {headers:{Authorization:`Bearer ${token}`}});
      const user = data.data;
      if (user && user !== "undefined") {
        // user.date=Date.now()
        const now = new Date();
  
        const formattedDate = now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }); // e.g., "25 April 2025"
        
        const formattedTime = now.toLocaleTimeString('en-GB'); // e.g., "14:45:08"
        
        const userWithDate = {
          user,
          date: formattedDate,
          time: formattedTime,
        };
        
        setCurrentUser(userWithDate);
        
      }
    } catch (error) {
      console.log(error.message)
    }
    setLoading(false);
    // return user.data.data;
  }
  

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if(!token){
      setLoading(false);
      return;
    }
    fetchUserDetails(token);
    const storedUser = localStorage.getItem('user');
    if(!isJSON(storedUser)){
      localStorage.removeItem('user');
      setLoading(false);
      return;
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};