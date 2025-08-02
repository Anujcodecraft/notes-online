import React, { useState, useEffect, useContext } from "react";
import {
  User,
  Book,
  FileQuestion,
  FileCheck,
  LogOut,
  X,
  Home,
  Info,
  Mail,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import manitLogo from "../assets/manit-logo.png";
import { ThemeContext } from "../context/ThemeContext";
import { useScrollDirection } from '../hooks/useScrollDirection';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const isVisible = useScrollDirection();
  // 👇 Apply `dark` class to <html> when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // 👇 Handle click outside sidebar to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".sidebar-toggle")
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    try {
      await logout();
      setSidebarOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const menuItems = [
    { id: "Profile", icon: User, label: "Profile" },
    { id: "my-notes", icon: Book, label: "My Notes" },
    { id: "my-pyqs", icon: FileQuestion, label: "PYQs Uploaded" },
    { id: "solutions", icon: FileCheck, label: "Solutions Uploaded" },
    { id: "About", icon: Info, label: "About Us" },
    { id: "ContactUs", icon: Mail, label: "Contact Us" },
  ];

  return (
    <>
      <header
        className={`bg-blue-100 dark:bg-gray-900 dark:text-white shadow-md fixed w-full z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <img
                src={manitLogo}
                alt="MANIT Logo"
                className="h-10 w-10 object-contain"
              />
              <Link
                to="/"
                className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 dark:text-white whitespace-nowrap"
              >
                ManitStudyPortal
              </Link>
            </div>

            {/* Desktop Section */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated && (
                <Link
                  to="/"
                  className="p-2 rounded-full hover:bg-blue-200 dark:hover:bg-gray-800 transition"
                  aria-label="Home"
                >
                  <div className="h-10 w-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                    <Home className="h-5 w-5 text-blue-600 dark:text-white" />
                  </div>
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-full hover:bg-blue-200 dark:hover:bg-gray-800 transition cursor-pointer"
                  aria-label="Open user menu"
                >
                  <div className="h-10 w-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md">
                    <User className="h-6 w-6" />
                  </div>
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 rounded-md transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* Theme Toggle (Visible to all users) */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-blue-200 dark:hover:bg-gray-700 transition"
                aria-label="Toggle Theme"
              >
                <div className="h-10 w-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md">
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-blue-700" />
                  )}
                </div>
              </button>
            </div>

            {/* Mobile Buttons */}
            <div className="md:hidden flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-full hover:bg-blue-200 dark:hover:bg-gray-800 transition cursor-pointer"
                    aria-label="Open user menu"
                  >
                    <div className="h-10 w-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md">
                      <User className="h-6 w-6" />
                    </div>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="p-2 rounded-full hover:bg-blue-200 dark:hover:bg-gray-800 transition"
                  aria-label="Login"
                >
                  <div
                    title="Login"
                    className="h-10 w-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md"
                  >
                    <User className="h-6 w-6" />
                  </div>
                </Link>
              )}

              {/* Theme Toggle (mobile) */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-blue-200 dark:hover:bg-gray-700 transition"
                aria-label="Toggle Theme"
              >
                <div className="h-10 w-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md">
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-blue-700" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`sidebar fixed z-100 inset-y-0 right-0 w-64 bg-blue-100 dark:bg-gray-800 shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out ${
          isVisible ? "top-0" : "-top-16"
        }`}
      >
        <div className="flex flex-col h-full p-4 text-black dark:text-white">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-blue-700 dark:border-gray-600">
            <h2 className="text-lg font-semibold">User Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-blue-300 dark:hover:bg-gray-700 transition cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map(({ id, icon: Icon, label }) => (
                <li key={id}>
                  <Link
                    to={`/${id}`}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center px-4 py-2 rounded-md hover:bg-blue-300 dark:hover:bg-gray-700 transition"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <span className="text-sm font-medium">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout (Sticky to bottom) */}
          {isAuthenticated && (
            <div className="mt-auto pt-4 border-t border-blue-700 dark:border-gray-600">
              <button
                onClick={handleLogout}
                className="flex items-center justify-start w-full px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition cursor-pointer"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
