import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";
import { useContentHeight } from "../hooks/useContentHeight";

const LandingPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { contentRef, shouldScroll } = useContentHeight();

  const handleWhatsAppClick = () => {
    const phoneNumber = "918462892088"; // Replace with your WhatsApp number
    let message = `Hi, I want to request uploader access.%0A%0A`;

    if (isAuthenticated && currentUser) {
      message += `Email: ${currentUser.emailtoSend}%0A`;
      message += `Scholar No: [Please specify your Scholar Number]%0A`;
    }

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div
      ref={contentRef}
      style={{
        marginTop: "64px", // Account for fixed header
      }}
      className="flex-1 flex flex-col justify-center bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Welcome to MANIT Study Portal
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your premier platform for academic resources and previous year
          questions
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
              {currentUser.role === "uploader" && (
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Get Started
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:from-blue-600 hover:to-indigo-600"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Notice Section */}
        <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg max-w-2xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex-shrink-0 flex items-start">
              <svg
                className="h-5 w-5 text-yellow-400 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-yellow-700 mb-3 md:mb-0">
                <span className="font-medium">
                  Want to upload notes or PYQs?
                </span>{" "}
                Request uploader privileges by contacting us.
              </p>
            </div>
            <button
              onClick={handleWhatsAppClick}
              className="mt-2 md:mt-0 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center transition-all"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29-3.51c.549 1.422 1.444 2.695 2.655 3.602.094.072.188.136.282.195.405.25.873.396 1.37.424.116.007.23.01.344.01.964 0 1.91-.273 2.73-.784.137-.083.265-.173.382-.27.31-.26.707-.207.893.093.19.303.676 1.04.89 1.392.213.353.426.525.213.935-.213.407-1.25 1.38-1.63 1.525-.383.146-.62.125-.885-.083-.262-.207-1.03-.758-1.39-1.023-.363-.266-.731-.39-1.102-.39-.37 0-.757.198-1.24.61-.484.41-1.156 1.19-1.695 1.63-.547.45-1.094.63-1.513.63-.42 0-1.07-.154-1.933-.59-.864-.434-1.61-1.05-2.244-1.79-.652-.762-1.168-1.64-1.522-2.59C3.93 12.32 3.73 11.34 3.73 10.34c0-1.87.81-3.51 2.22-4.78.543-.5 1.19-.89 1.87-1.17.28-.11.57-.19.87-.25.31-.06.6-.1.88-.1.38 0 .76.07 1.12.22.36.15.67.38.92.68.25.3.34.63.34.96 0 .31-.07.63-.2.94-.13.32-.47 1.06-.62 1.42-.16.37-.32.5-.53.66-.21.16-.43.22-.66.22-.18 0-.37-.05-.54-.15-.17-.1-.78-.38-1.48-.38-.7 0-1.3.2-1.78.6-.48.4-.82 1.05-.82 1.75 0 .7.38 1.35.83 1.89.45.54 1.06 1.01 1.75 1.4.68.38 1.44.67 2.23.86.78.19 1.57.29 2.35.29.03 0 .07 0 .1-.01.04-.01.07-.01.11-.02.04 0 .07-.01.11-.01.04-.01.07-.03.1-.05.03-.02.05-.04.07-.07.02-.03.03-.06.03-.1 0-.05-.02-.1-.05-.14-.03-.04-.08-.07-.13-.08-.05-.02-.1-.02-.15-.01-.05 0-.1.02-.15.04-.05.02-.1.05-.15.08-.04.03-.1.06-.15.09-.05.03-.11.05-.17.06-.06.01-.12.01-.18 0-.06-.01-.12-.03-.17-.06-.05-.03-.11-.07-.16-.11-.05-.04-.1-.09-.14-.14-.04-.05-.08-.11-.11-.17-.03-.06-.05-.12-.06-.18-.01-.06-.01-.12 0-.18.01-.06.03-.12.06-.18.03-.06.07-.12.11-.17.04-.05.09-.1.14-.14.05-.04.11-.08.16-.11.06-.03.12-.05.18-.06.06-.01.12-.01.18 0 .06.01.12.03.17.06.05.03.1.06.15.09.05.03.1.06.15.08.05-.02.1-.04.15-.04.05 0 .1.01.15.03.05.02.1.05.13.09.03-.04.05-.09.05-.14 0-.05-.02-.1-.05-.14-.03-.04-.08-.07-.13-.08-.05-.02-.1-.02-.15-.01-.05 0-.1.02-.15.04-.05.02-.1.05-.15.08-.04.03-.1.06-.15.09-.05.03-.11.05-.17.06-.06.01-.12.01-.18 0-.06-.01-.12-.03-.17-.06-.05-.03-.11-.07-.16-.11-.05-.04-.1-.09-.14-.14-.04-.05-.08-.11-.11-.17-.03-.06-.05-.12-.06-.18-.01-.06-.01-.12 0-.18.01-.06.03-.12.06-.18.03-.06.07-.12.11-.17.04-.05.09-.1.14-.14.05-.04.11-.08.16-.11.06-.03.12-.05.18-.06.06-.01.12-.01.18 0 .06.01.12.03.17.06.05.03.1.06.15.09.05.03.1.06.15.08.05-.02.1-.04.15-.04.05 0 .1.01.15.03.05.02.1.05.13.09.03-.04.05-.09.05-.14 0-.05-.02-.1-.05-.14-.03-.04-.08-.07-.13-.08-.05-.02-.1-.02-.15-.01-.05 0-.1.02-.15.04-.05.02-.1.05-.15.08z" />
              </svg>
              Contact via WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Card 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100">
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-blue-600">
                Access Notes
              </h3>
            </div>
            <p className="text-gray-700">
              Browse and download quality notes for various subjects and
              branches with our organized collection.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-green-100">
            <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-green-600">
                Previous Year Questions
              </h3>
            </div>
            <p className="text-gray-700">
              Practice with PYQs for mid-term, end-term and mini exams to ace
              your examinations.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-purple-100">
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-purple-600">
                Community Driven
              </h3>
            </div>
            <p className="text-gray-700">
              Upvote the best content and help others find quality resources
              through our rating system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
