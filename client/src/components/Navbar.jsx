import { useState, useEffect } from 'react';
import { User, Book, FileQuestion, FileCheck, LogOut, X, Home, Info, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import manitLogo from '../assets/manit-logo.png';
import React from 'react';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar') && 
          !event.target.closest('.sidebar-toggle')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    try {
      await logout();
      setSidebarOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const menuItems = [
    { id: 'Profile', icon: User, label: 'Profile' },
    { id: 'my-notes', icon: Book, label: 'My Notes' },
    { id: 'my-pyqs', icon: FileQuestion, label: 'PYQs Uploaded' },
    { id: 'solutions', icon: FileCheck, label: 'Solutions Uploaded' },
    { id: 'About', icon: Info, label: 'About Us' },
    { id: 'ContactUs', icon: Mail, label: 'Contact Us' },
  ];

  return (
    <>
      {/* Navbar - Always on top */}
      <header className="bg-slate-700 shadow-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <img 
                src={manitLogo} 
                alt="MANIT Logo" 
                className="h-12 w-12 object-contain"
              />
              <Link to="/" className="text-xl md:text-2xl font-bold text-gray-300">
                ManitStudyPortal
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && (
                <Link
                  to="/"
                  className="p-2 mr-2 rounded-full hover:bg-blue-200 transition-colors group relative"
                  aria-label="Home"
                >
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-blue-50 transition-colors">
                    <Home className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  </div>
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  onClick={toggleSidebar}
                  className="sidebar-toggle p-2 rounded-full hover:bg-blue-200 transition-colors mr-2"
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

            <div className="md:hidden flex items-center">
              {isAuthenticated ? (
                <button
                  onClick={toggleSidebar}
                  className="sidebar-toggle p-2 rounded-full hover:bg-blue-200 transition-colors"
                  aria-label="Open user menu"
                >
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                    <User className="h-6 w-6" />
                  </div>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="px-3 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar with translucent background */}
      <div
        className={`sidebar fixed inset-y-0 right-0 w-64 bg-blue-100/95 shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-blue-700">
            <h2 className="text-lg font-semibold text-black">User Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-full hover:bg-blue-700 text-black hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map(({ id, icon: Icon, label }) => (
                <li key={id}>
                  <Link
                    to={`/${id}`}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center px-4 py-3 text-black rounded-lg hover:bg-blue-300 transition"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {isAuthenticated && (
            <div className="mt-auto pt-4 border-t border-blue-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}