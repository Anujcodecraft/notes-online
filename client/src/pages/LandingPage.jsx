// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import React from 'react';

// const LandingPage = () => {
//   const { isAuthenticated } = useAuth();

//   return (
//     <div className="bg-white mt-22">
//       <div className="container mx-auto px-4 py-16">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to AcademicHub</h1>
//           <p className="text-xl text-gray-600 mb-8">Your one-stop platform for academic notes and previous year questions</p>
          


//          { isAuthenticated?(

//           <div className="flex justify-center space-x-4">
//             <Link to="/AllNotes" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
//               Browse Notes
//             </Link>
//             <Link to="/pyqs" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
//               Browse PYQs
//             </Link>
//           </div>
//           ):(<></>)
// }
//           {
//   isAuthenticated ? (
//     <div className="mt-8 flex justify-center space-x-4">
//       <Link to="/upload-notes" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
//         Upload Notes
//       </Link>
//       <Link to="/upload-pyqs" className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700">
//         Upload PYQ
//       </Link>
//     </div>
//   ) : (
//     <div className="mt-12">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started</h2>
//       <div className="flex justify-center space-x-4">
//         <Link to="/signup" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
//           Sign Up
//         </Link>
//         <Link to="/login" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
//           Login
//         </Link>
//       </div>
//     </div>
//   )
// }

         

//           {/* Upload buttons shown only when user is logged in
//           {isAuthenticated && }

//           {!isAuthenticated && } */}

//           <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="bg-blue-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold text-blue-600 mb-2">Access Notes</h3>
//               <p className="text-gray-700">Browse and download quality notes for various subjects and branches</p>
//             </div>
//             <div className="bg-green-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold text-green-600 mb-2">Previous Year Questions</h3>
//               <p className="text-gray-700">Practice with PYQs for mid-term, end-term and mini exams</p>
//             </div>
//             <div className="bg-purple-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold text-purple-600 mb-2">Community Driven</h3>
//               <p className="text-gray-700">Upvote the best content and help others find quality resources</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;



import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-28 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Welcome to MANIT Study Portal
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
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
            </>
          ) : (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get Started</h2>
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
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Card 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100">
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-blue-600">Access Notes</h3>
            </div>
            <p className="text-gray-700">
              Browse and download quality notes for various subjects and branches with our organized collection.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-green-100">
            <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-green-600">Previous Year Questions</h3>
            </div>
            <p className="text-gray-700">
              Practice with PYQs for mid-term, end-term and mini exams to ace your examinations.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-purple-100">
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-purple-600">Community Driven</h3>
            </div>
            <p className="text-gray-700">
              Upvote the best content and help others find quality resources through our rating system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
