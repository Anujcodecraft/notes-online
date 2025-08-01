import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();


  return (
    <div
      className={`fixed z-index-100 top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-20 pt-16`}
    >
      <div className="p-4">
        <div className="space-y-2">
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            onClick={toggleSidebar}
          >
            User Profile
          </Link>
          <Link
            to="/notes-uploaded"
            className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            onClick={toggleSidebar}
          >
            Notes Uploaded
          </Link>
          <Link
            to="/pyqs-uploaded"
            className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            onClick={toggleSidebar}
          >
            PYQs Uploaded
          </Link>
          <Link
            to="/solutions-uploaded"
            className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            onClick={toggleSidebar}
          >
            Solutions Uploaded
          </Link>
          <button
            onClick={() => {
              logout();
              navigate("/");
              toggleSidebar();
            }}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;