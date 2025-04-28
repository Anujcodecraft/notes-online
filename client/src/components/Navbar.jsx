import { useState } from 'react';
import { User, Book, FileQuestion, FileCheck, LogOut, X, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Profile from '../pages/Profile';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    Navigate('/')
  };

  const menuItems = [
    { id: 'Profile', icon: User, label: 'Profile' },
    { id: 'my-notes', icon: Book, label: 'My Notes' },
    { id: 'my-pyqs', icon: FileQuestion, label: 'PYQs Uploaded' },
    { id: 'solutions', icon: FileCheck, label: 'Solutions Uploaded' },
  ];

  return (
    <>
      {/* Navbar */}
      <header className="bg-blue-100 shadow-md fixed top-0 w-full z-50 mb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-3xl font-bold text-blue-700">
              AcademicHUB
            </Link>

            <div className="flex items-center">
              {/* Added Home Button */}
             {
              isAuthenticated?(              <Link
                to="/"
                className="p-2 mr-2 rounded-full hover:bg-blue-200 transition-colors group relative"
                aria-label="Home"
              >
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-blue-50 transition-colors">
                  <Home className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                </div>
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                
                </span>
              </Link>):(<></>)
             }
              

              {isAuthenticated ? (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-full hover:bg-blue-200 transition-colors mr-2"
                  aria-label="Open user menu"
                >
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                    <User className="h-6 w-6" />
                  </div>
                </button>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-md text-blue-600 hover:bg-blue-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-64 bg-gray-900 shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">User Menu</h2>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map(({ id, icon: Icon, label }) => (
                <li key={id}>
                  <Link
                    to={`/${id}`}
                    onClick={toggleSidebar}
                    className="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="mt-auto pt-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-400 rounded-lg hover:bg-gray-700 hover:text-red-300 transition"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}