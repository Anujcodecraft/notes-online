import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white mt-22">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to AcademicHub</h1>
          <p className="text-xl text-gray-600 mb-8">Your one-stop platform for academic notes and previous year questions</p>
          


         { isAuthenticated?(

          <div className="flex justify-center space-x-4">
            <Link to="/notes" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Browse Notes
            </Link>
            <Link to="/pyqs" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
              Browse PYQs
            </Link>
          </div>
          ):(<></>)
}
          {
  isAuthenticated ? (
    <div className="mt-8 flex justify-center space-x-4">
      <Link to="/upload-notes" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
        Upload Notes
      </Link>
      <Link to="/upload-pyqs" className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700">
        Upload PYQ
      </Link>
    </div>
  ) : (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started</h2>
      <div className="flex justify-center space-x-4">
        <Link to="/signup" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Sign Up
        </Link>
        <Link to="/login" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
          Login
        </Link>
      </div>
    </div>
  )
}

         

          {/* Upload buttons shown only when user is logged in
          {isAuthenticated && }

          {!isAuthenticated && } */}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Access Notes</h3>
              <p className="text-gray-700">Browse and download quality notes for various subjects and branches</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-600 mb-2">Previous Year Questions</h3>
              <p className="text-gray-700">Practice with PYQs for mid-term, end-term and mini exams</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-600 mb-2">Community Driven</h3>
              <p className="text-gray-700">Upvote the best content and help others find quality resources</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
