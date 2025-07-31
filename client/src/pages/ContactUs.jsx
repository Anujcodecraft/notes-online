import { Link } from "react-router-dom";
import React from "react";
import { useAuth } from "../context/AuthContext";

const ContactUs = () => {
  const { isAuthenticated } = useAuth();
  const googleFormUrl =
    "https://docs.google.com/forms/d/18GZXt8ZSmMGdT3aPWGm1Cao-Lh6YpqipWTAhF2oHYfA/edit";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 pt-16 md:pt-20">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 py-3 px-4 md:py-4 md:px-6 border-b-4 border-blue-900 dark:border-blue-700">
        <h1 className="text-lg md:text-2xl font-bold text-blue-900 dark:text-blue-300 text-center md:text-left">
          MAULANA AZAD NATIONAL INSTITUTE OF TECHNOLOGY BHOPAL (M.P.) INDIA
        </h1>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-10 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 md:pr-8 mb-6 md:mb-0">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 border-b-2 border-blue-900 dark:border-blue-600 pb-2">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-blue-900 dark:text-blue-300 hover:underline block py-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-blue-900 dark:text-blue-300 hover:underline block py-1"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-blue-900 dark:text-blue-200 font-medium hover:underline block py-1"
                >
                  Contact
                </Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link
                      to="/AllNotes"
                      className="text-blue-900 dark:text-blue-300 hover:underline block py-1"
                    >
                      Study Notes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pyqs"
                      className="text-blue-900 dark:text-blue-300 hover:underline block py-1"
                    >
                      PYQs
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-3/4">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 md:p-6 lg:p-8 rounded shadow">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-300 mb-4 md:mb-6 border-b-2 border-blue-900 dark:border-blue-600 pb-2">
              Contact Us
            </h2>

            <div className="space-y-4 md:space-y-6 text-gray-800 dark:text-gray-200">
              <section>
                <h3 className="text-lg md:text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2 md:mb-3">
                  Have Questions or Feedback?
                </h3>
                <p className="text-sm md:text-base">
                  We're here to help! Please use the form below to reach out to
                  our team with any questions, feedback, or issues you might be
                  facing with the MANIT Study Portal.
                </p>
              </section>

              <section>
                <h3 className="text-lg md:text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2 md:mb-3">
                  Contact Form
                </h3>
                <div className="bg-white dark:bg-gray-700 p-4 md:p-6 rounded-lg shadow-md border border-blue-200 dark:border-blue-500">
                  <div className="text-center">
                    <a
                      href={googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 md:px-6 md:py-3 bg-blue-900 text-white rounded-lg shadow hover:bg-blue-800 transition-colors text-sm md:text-base"
                    >
                      Open Contact Form
                    </a>
                    <p className="mt-3 md:mt-4 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                      You'll be redirected to a secure Google Form to submit
                      your query.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg md:text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2 md:mb-3">
                  Other Ways to Reach Us
                </h3>
                <ul className="list-disc pl-5 md:pl-6 space-y-1 text-sm md:text-base">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:studentreports@gmail.com"
                      className="text-blue-900 dark:text-blue-300 hover:underline"
                    >
                      studentreports@gmail.com
                    </a>
                  </li>
                  <li>
                    <strong>Contact:</strong> +91 6268571757
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
