import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay (clicking it will close the sidebar) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-20 pt-16`}
        onClick={(e) => e.stopPropagation()} // prevent closing on inside clicks
      >
        <div className="p-4">
          <div className="space-y-2">
            <Link
              to="/profile"
              className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              onClick={toggleSidebar}
            >
              User Profile
            </Link>
            <Link
              to="/notes-uploaded"
              className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              onClick={toggleSidebar}
            >
              Notes Uploaded
            </Link>
            <Link
              to="/pyqs-uploaded"
              className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              onClick={toggleSidebar}
            >
              PYQs Uploaded
            </Link>
            <Link
              to="/solutions-uploaded"
              className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
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
              className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
