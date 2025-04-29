import React from 'react';
import { Chrome } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authenticationPopup, getGoogleToken } from '../../firebase/firebasePopup';
import { toast } from 'react-hot-toast';
import axios from 'axios'
import { useAuth } from '../context/AuthContext';

const GoogleAuthButton = () => {
  const navigate = useNavigate();
  const {login} = useAuth()

  const chromeIconStyle = {
    width: "1.25rem",
    height: "1.25rem",
    marginRight: "0.75rem",
    color: "#3b82f6",
  };

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "20rem",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 500,
    color: "#4b5563", 
    backgroundColor: "#ffffff", 
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem", 
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    transition: "background-color 0.2s, color 0.2s",
    cursor: "pointer",
  };

  const buttonHoverStyle = {
    backgroundColor: "#f9fafb", 
  };

  const buttonFocusStyle = {
    outline: "none",
    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)", 
  };


  async function handleGoogleAuth() {
    try {
      await authenticationPopup();
      const googleToken = await getGoogleToken();
      const response = await axios.post('import.meta.env.VITE_BASE_URL_BACKEND/google-auth', {}, {
        headers:{
            authorization:`Bearer ${googleToken}`
        }
      })
      if(!response){
        console.log("Error in Authenticating through google");
        toast.warning('Failed to Authenticate You');
    }
    console.log("response of google auth ", response.data);
    login(response.data.user, response.data.token)
    navigate('/');
    toast.success('Authenticated!!!');
    } catch (error) {
      console.error("Google Authentication failed:", error);
    }
  }

  return (
    <button
      onClick={handleGoogleAuth}
      style={buttonStyle}
      onMouseEnter={(e) => Object.assign(e.target.style, buttonHoverStyle)}
      onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
      onFocus={(e) => Object.assign(e.target.style, buttonFocusStyle)}
      onBlur={(e) => Object.assign(e.target.style, buttonStyle)}
    >
      <Chrome style={chromeIconStyle} />
      Continue with Google
    </button>
  );
};

export default GoogleAuthButton;
