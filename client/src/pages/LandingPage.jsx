import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

const LandingPage = () => {
  const { isAuthenticated, currentUser } = useAuth();

  const handleWhatsAppClick = () => {
    const phoneNumber = '918462892088';
    let message = `Hi, I want to request uploader access.%0A%0A`;

    if (isAuthenticated && currentUser) {
      message += `Email: ${currentUser.emailtoSend}%0A`;
      message += `Scholar No: [Please specify your Scholar Number]%0A`;
    }

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-28 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:text-white mb-4">
          Welcome to MANIT Study Portal
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Your premier platform for academic resources and previous year questions
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col items-center space-y-4">
          {isAuthenticated ? (
            <>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/AllNotes" 
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:from-blue-600 hover:to-blue-700"
                >
                  Browse Notes
                </Link>
                <Link 
                  to="/pyqs" 
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:from-green-600 hover:to-green-700"
                >
                  Browse PYQs
                </Link>
              </div>
              {currentUser.role === 'uploader' && (
                <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                    to="/upload-notes" 
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:from-purple-600 hover:to-purple-700"
                  >
                    Upload Notes
                  </Link>
                  <Link 
                    to="/upload-pyqs" 
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:from-pink-600 hover:to-pink-700"
                  >
                    Upload PYQ
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Get Started</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/signup" 
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:from-blue-600 hover:to-indigo-600"
                >
                  Sign Up
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-3 border-2 border-blue-500 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Notice Section */}
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-300 rounded-r-lg max-w-2xl mx-auto w-full transition-colors">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex-shrink-0 flex items-start">
              <svg className="h-5 w-5 text-yellow-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-yellow-700 dark:text-yellow-200 mb-3 md:mb-0">
                <span className="font-medium">Want to upload notes or PYQs?</span> Request uploader privileges by contacting us.
              </p>
            </div>
            <button
              onClick={handleWhatsAppClick}
              className="mt-2 md:mt-0 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center transition-all"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M...Z" /> {/* truncated for brevity */}
              </svg>
              Contact via WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Feature Card 1 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700">
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-300">Access Notes</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Browse and download quality notes for various subjects and branches with our organized collection.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-green-100 dark:border-gray-700">
            <div className="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-green-600 dark:text-green-300">Previous Year Questions</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Practice with PYQs for mid-term, end-term and mini exams to ace your examinations.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-purple-100 dark:border-gray-700">
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-300">Community Driven</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Upvote the best content and help others find quality resources through our rating system.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;
