import { User, Mail, Calendar, Book, FileText, CheckSquare } from 'lucide-react';
import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserPagePreview() {
  // Mock user data for preview

  
  // Stats for demonstration
  const userStats = {
    dateJoined: "April 12, 2025",
    notesUploaded: 8,
    pyqsUploaded: 12,
    solutionsUploaded: 5
  };
  const {currentUser} = useAuth()
  console.log(currentUser)

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-12 mt-11">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header with Avatar */}
          <div className="bg-blue-600 px-6 py-8">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mb-4">
                <User className="h-14 w-14 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-white">{currentUser.nametoSend}</h2>
              <p className="text-blue-100">{currentUser.emailtoSend}</p>
            </div>
          </div>

          {/* User Information */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-gray-900">{currentUser.nametoSend}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="text-gray-900">{currentUser.emailtoSend}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Member Since</p>
                      <p className="text-gray-900">{currentUser.date}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Stats */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contribution Stats</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Book className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-lg font-semibold">{userStats.notesUploaded}</p>
                        <p className="text-sm text-gray-500">Notes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-lg font-semibold">{userStats.pyqsUploaded}</p>
                        <p className="text-sm text-gray-500">PYQs</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <CheckSquare className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-lg font-semibold">{userStats.solutionsUploaded}</p>
                        <p className="text-sm text-gray-500">Solutions</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-lg font-semibold">{userStats.notesUploaded + userStats.pyqsUploaded + userStats.solutionsUploaded}</p>
                        <p className="text-sm text-gray-500">Total</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}

          </div>
        </div>
      </div>
    </div>
  );
}