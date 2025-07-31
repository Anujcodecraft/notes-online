import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiMail, FiBook, FiFileText, FiLoader, FiAlertCircle } from 'react-icons/fi';

const UserProfile = () => {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/Profile/${userId}`);
        console.log("API Response:", res.data);
        setData(res.data);
      } catch (err) {
        setError('Could not fetch user profile');
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center text-blue-600">
        <FiLoader className="animate-spin text-4xl mb-2" />
        <p className="text-lg">Loading profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center text-red-500">
        <FiAlertCircle className="text-4xl mb-2" />
        <p className="text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!data || !data.user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center text-gray-500">
        <p className="text-lg">No profile data found</p>
      </div>
    </div>
  );

  // Helper function to get the subject name
  const getSubjectName = (item) => {
    if (typeof item.subject === 'string') return item.subject;
    if (item.subject?.name) return item.subject.name;
    if (item.subjectName) return item.subjectName;
    return 'Untitled';
  };

  // Helper function to get the branch name
  const getBranchName = (item) => {
    if (typeof item.branch === 'string') return item.branch;
    if (item.branch?.name) return item.branch.name;
    return '';
  };

return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-22">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-2">
              <div className="bg-blue-100 p-3 rounded-full">
                <FiUser className="text-blue-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{data.user.name || 'Uploader'}</h2>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <FiBook className="text-green-600 text-xl" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <h3 className="text-xl font-semibold text-gray-800">Notes Uploaded</h3>
                <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {data.notes?.length || 0} Files
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {data.notes?.reduce((sum, note) => sum + (note.upvotesCount || 0), 0)} Upvotes
                  </span>
                </div>
              </div>
            </div>

            {data.notes && data.notes.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {data.notes.map((note) => (
                  <div key={note._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                    <p className="font-medium text-gray-800 mb-2">
                      {getSubjectName(note)}
                    </p>
                    {note.year && (
                      <p className="text-sm text-gray-600 mb-1">
                        Year: <span className="font-medium">{note.year}</span>
                      </p>
                    )}
                    {getBranchName(note) && (
                      <p className="text-sm text-gray-600 mb-1">
                        Branch: <span className="font-medium">{getBranchName(note)}</span>
                      </p>
                    )}
                    {note.upvotesCount > 0 && (
                      <p className="text-sm text-gray-600 mb-1">
                        Upvotes: <span className="font-medium">{note.upvotesCount}</span>
                      </p>
                    )}
                    {note.fileurl && (
                      <button
                        onClick={() => window.open(note.fileurl, '_blank')}
                        className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                      >
                        View PDF
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiBook className="mx-auto text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500">No notes uploaded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* PYQs Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-full">
                <FiFileText className="text-purple-600 text-xl" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <h3 className="text-xl font-semibold text-gray-800">PYQs Uploaded</h3>
                <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {data.pyqs?.length || 0} Files
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {data.pyqs?.reduce((sum, pyq) => sum + (pyq.upvotesCount || 0), 0)} Upvotes
                  </span>
                </div>
              </div>
            </div>

            {data.pyqs && data.pyqs.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {data.pyqs.map((pyq) => (
                  <div key={pyq._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                    <p className="font-medium text-gray-800 mb-2">
                      {getSubjectName(pyq)}
                    </p>
                    {pyq.year && (
                      <p className="text-sm text-gray-600 mb-1">
                        Year: <span className="font-medium">{pyq.year}</span>
                      </p>
                    )}
                    {getBranchName(pyq) && (
                      <p className="text-sm text-gray-600 mb-1">
                        Branch: <span className="font-medium">{getBranchName(pyq)}</span>
                      </p>
                    )}
                    {pyq.title && (
                      <p className="text-sm text-gray-600 mb-1">
                        Type: <span className="font-medium">{pyq.title}</span>
                      </p>
                    )}
                    {pyq.upvotesCount > 0 && (
                      <p className="text-sm text-gray-600 mb-1">
                        Upvotes: <span className="font-medium">{pyq.upvotesCount}</span>
                      </p>
                    )}
                    {pyq.fileurl && (
                      <button
                        onClick={() => window.open(pyq.fileurl, '_blank')}
                        className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                      >
                        View PDF
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiFileText className="mx-auto text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500">No PYQs uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;