import React from 'react';
import { Chrome } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authenticationPopup, getGoogleToken } from '../../firebase/firebasePopup';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const GoogleAuthButton = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleAuth = async () => {
    try {
      await authenticationPopup();
      const googleToken = await getGoogleToken();

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/google-auth`,
        {},
        {
          headers: {
            authorization: `Bearer ${googleToken}`,
          },
        }
      );

      if (!response) {
        toast.error('⚠️ Failed to Authenticate You');
        return;
      }

      login(response.data.user, response.data.token);
      navigate('/');
      toast.success('Authenticated!!!');
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      }
      console.error('Google Authentication failed:', error);
    }
  };

  return (
    <button
      onClick={handleGoogleAuth}
      className="w- max-w-xs flex items-center m-auto justify-center gap-3 px-6 py-3 rounded-md 
                 text-gray-600 dark:text-gray-200 
                 bg-white dark:bg-gray-800 
                 border border-gray-300 dark:border-gray-700 
                 shadow transition-colors duration-300 
                 hover:bg-gray-50 dark:hover:bg-gray-700 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-gray-900"
    >
      <Chrome className="w-5 h-5 text-blue-500" />
      Continue with Google
    </button>
  );
};

export default GoogleAuthButton;
