import { Link } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ContactUs = () => {
  const { isAuthenticated } = useAuth();
  const googleFormUrl = "https://docs.google.com/forms/d/18GZXt8ZSmMGdT3aPWGm1Cao-Lh6YpqipWTAhF2oHYfA/edit"; // Replace with your actual form URL

  return (
    <div className="min-h-screen bg-white mt-20">
      {/* Header Section */}
      <div className="bg-white py-4 px-6 border-b-4 border-blue-900">
        <h1 className="text-2xl font-bold text-blue-900">MAULANA AZAD NATIONAL INSTITUTE OF TECHNOLOGY BHOPAL (M.P.) INDIA</h1>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10 flex">
        {/* Sidebar */}
        <div className="w-1/4 pr-8">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold text-blue-900 border-b-2 border-blue-900 pb-2">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="text-blue-900 hover:underline">Home</Link></li>
              <li><Link to="/about" className="text-blue-900 hover:underline">About Us</Link></li>
              <li><Link to="/contact" className="text-blue-900 font-medium hover:underline">Contact</Link></li>
              {isAuthenticated && (
                <>
                  <li><Link to="/AllNotes" className="text-blue-900 hover:underline">Study Notes</Link></li>
                  <li><Link to="/pyqs" className="text-blue-900 hover:underline">PYQs</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-3/4">
          <div className="bg-gray-100 p-8 rounded shadow">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 border-b-2 border-blue-900 pb-2">Contact Us</h2>
            
            <div className="space-y-6 text-gray-800">
              <section>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Have Questions or Feedback?</h3>
                <p>
                  We're here to help! Please use the form below to reach out to our team with any questions, 
                  feedback, or issues you might be facing with the MANIT Study Portal.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Contact Form</h3>
                <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
                  <div className="text-center">
                    <a
                      href={googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg shadow hover:bg-blue-800 transition-colors"
                    >
                      Open Contact Form
                    </a>
                    <p className="mt-4 text-sm text-gray-600">
                      You'll be redirected to a secure Google Form to submit your query.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Other Ways to Reach Us</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Email:</strong> <a href="mailto:studentreports@gmail.com" className="text-blue-900 hover:underline">studentreports@gmail.com</a>
                  </li>
                  <li>
                    <strong>ContactUs:</strong> +91 6268571757
                  </li>

                </ul>
              </section>

              {/* <section className="pt-6">
                <div className="grid grid-cols-4 gap-4 border-t border-gray-300 pt-6">
                  <Link to="/network-circular" className="text-blue-900 hover:underline text-center">NetworkCircular</Link>
                  <Link to="/alumni" className="text-blue-900 hover:underline text-center">MANIT Alumni</Link>
                  <Link to="/acts-rules" className="text-blue-900 hover:underline text-center">Acts & Rules</Link>
                  <Link to="/rti" className="text-blue-900 hover:underline text-center">RTI</Link>
                </div>
              </section> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;