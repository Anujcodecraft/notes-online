import axios from 'axios';
import { createContext, useState, useEffect, useContext } from 'react';
import React from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvotedNoteIds, setUpvotedNoteIds] = useState([]);

  function isJSON(str) {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === 'object' && parsed !== null;
    } catch (e) {
      return false;
    }
  }

  async function fetchUserDetails(token) {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/userdetails`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = data.data;
    

      if (user && user !== 'undefined') {
        setCurrentUser(user);

        // ✅ Use localStorage temporarily for fast UX on session start
        const localUpvotes = JSON.parse(localStorage.getItem('upvotedNoteIds') || '[]');
        setUpvotedNoteIds(localUpvotes);
      }
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchUserDetails(token);
  }, []);

  const login = async (userData, token) => {
    // Store user data and token
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setCurrentUser(userData);

    // try {
    //   // Step 1: Use localStorage upvotes temporarily for fast response
    //   const localUpvotes = JSON.parse(localStorage.getItem('upvotedNoteIds') || '[]');
    //   setUpvotedNoteIds(localUpvotes);

    //   // Step 2: Fetch upvoted noteIds from backend
    //   const res = await axios.get(
    //     `${import.meta.env.VITE_BASE_URL_BACKEND}/user-upvotes/${userData.emailtoSend}`,
    //     {
    //       headers: { Authorization: `Bearer ${token}` },
    //     }
    //   );
    //   const realUpvotes = res.data.upvotedNoteIds || [];

    //   // Step 3: Update state and sync with localStorage
    //   setUpvotedNoteIds(realUpvotes);
    //   localStorage.setItem('upvotedNoteIds', JSON.stringify(realUpvotes));
    // } catch (err) {
    //   console.error('Failed to fetch user upvoted notes during login', err);
    // }
  };

  const logout = () => {
    // Remove user, token, and upvotedNoteIds from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('upvotedNoteIds');

    // Reset the user and upvoted state
    setCurrentUser(null);
    setUpvotedNoteIds([]);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    // upvotedNoteIds,
    // setUpvotedNoteIds,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
