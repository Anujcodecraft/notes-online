import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import React from 'react';

const PyqsPage = () => {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    branch: '',
    subject: '',
    title: ''
  });
  const { isAuthenticated, currentUser } = useAuth();

  const years = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'CHE'];
  const subjects = ['Data Structures', 'Algorithms', 'Database', 'Networks', 'OS', 'TOC', 'AI', 'ML'];
  const titles = ['Mini', 'Mid', 'End'];

  useEffect(() => {
    fetchPyqs();
  }, [filters]);

  const handleViewPDF = (fileUrl) => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const fetchPyqs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.year) queryParams.append('year', filters.year);
      if (filters.branch) queryParams.append('branch', filters.branch);
      if (filters.subject) queryParams.append('subject', filters.subject);
      if (filters.title) queryParams.append('title', filters.title);

      const response = await fetch(`http://localhost:3000/pyqs?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch PYQs');
      
      const data = await response.json();

      const processedData = data.map(pyq => ({
        ...pyq,
        uploadedBy: pyq.user || { name: 'Unknown' },
        upvotes: pyq.upvotes || [],
      }));

      setPyqs(processedData);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleUpvote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to upvote.');
        return;
      }

      const response = await fetch(`http://localhost:3000/pyqs/${id}/upvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: currentUser.emailtoSend })
      });

      const data = await response.json();

      if (response.ok) {
        setPyqs(prevPyqs =>
          prevPyqs.map(pyq => 
            pyq._id === id ? { ...pyq, upvotes: [...pyq.upvotes, 'dummyUser'] } : pyq
          )
        );
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error during upvote:', error);
      alert('Something went wrong while upvoting.');
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Previous Year Questions
              </h1>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                Access exam papers from previous years to help you prepare better
              </p>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                Filter PYQs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Academic Year', name: 'year', options: years },
                  { label: 'Branch', name: 'branch', options: branches },
                  { label: 'Subject', name: 'subject', options: subjects },
                  { label: 'Exam Type', name: 'title', options: titles }
                ].map((filter) => (
                  <div key={filter.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={filter.name}>
                      {filter.label}
                    </label>
                    <select
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
                      id={filter.name}
                      name={filter.name}
                      value={filters[filter.name]}
                      onChange={handleFilterChange}
                    >
                      <option value="">All {filter.label}</option>
                      {filter.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Error or Loading */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
              </div>
            ) : pyqs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pyqs.map((pyq) => (
                  <div key={pyq._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{pyq.subject}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                            pyq.title === 'Mini' ? 'bg-blue-100 text-blue-800' :
                            pyq.title === 'Mid' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {pyq.title} Semester
                          </span>
                        </div>
                        <div>
                          <button
                            onClick={() => handleUpvote(pyq._id)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
                            title="Upvote this PYQ"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            <span>{pyq.upvotes.length}</span>
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-gray-600">
                        <div>Year: {pyq.year}</div>
                        <div>Branch: {pyq.branch}</div>
                        <div>Uploaded by: {pyq.uploadedBy.name}</div>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => handleViewPDF(pyq.fileurl)}
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          View PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <h3 className="text-lg font-medium text-gray-900">No PYQs found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setFilters({ year: '', branch: '', subject: '', title: '' })}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PyqsPage;
