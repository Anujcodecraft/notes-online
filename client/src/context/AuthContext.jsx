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
  

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if(!isJSON(storedUser)){
      localStorage.removeItem('user');
      setLoading(false);
      return;
    }
    const user = localStorage.getItem('user');
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
        ...JSON.parse(user),
        date: formattedDate,
        time: formattedTime,
      };
      
      setCurrentUser(userWithDate);
      
    }
    setLoading(false);
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