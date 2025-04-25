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
  const { isAuthenticated } = useAuth();

  // Options for filters
  const years = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'CHE'];
  const subjects = ['Data Structures', 'Algorithms', 'Database', 'Networks', 'OS', 'TOC', 'AI', 'ML'];
  const titles = ['Mini', 'Mid', 'End'];

  useEffect(() => {
    fetchPyqs();
  }, [filters]);

  const fetchPyqs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.year) queryParams.append('year', filters.year);
      if (filters.branch) queryParams.append('branch', filters.branch);
      if (filters.subject) queryParams.append('subject', filters.subject);
      if (filters.title) queryParams.append('title', filters.title);
      
      const response = await fetch(`http://localhost:3000/pyqs?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch PYQs');
      }
      
      const data = await response.json();
      // Ensure uploadedBy exists with at least a name property
      const processedData = data.map(pyq => ({
        ...pyq,
        uploadedBy: pyq.uploader || { name: 'Unknown' } // Changed from uploadedBy to uploader
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
    if (!isAuthenticated) {
      return window.alert('Please login to upvote');
    }
    
    try {
      const response = await fetch(`http://localhost:3000/notes/${id}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to upvote');
      }
      
      // Update the pyqs list to reflect the new upvote count
      setPyqs(pyqs.map(pyq => 
        pyq._id === id ? { ...pyq, upvotes: pyq.upvotes + 1 } : pyq
      ));
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-green-600 mb-6">Previous Year Questions (PYQs)</h1>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter PYQs</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
              Year
            </label>
            <select
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="year"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="branch">
              Branch
            </label>
            <select
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="branch"
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
              Subject
            </label>
            <select
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="subject"
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Exam Type
            </label>
            <select
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              {titles.map(title => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : pyqs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pyqs.map((pyq) => (
            <div key={pyq._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{pyq.subject}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {pyq.title}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Year: {pyq.year}</p>
                <p className="text-sm text-gray-600">Branch: {pyq.branch}</p>
                <p className="text-sm text-gray-600">Uploaded by: {pyq.uploadedBy.name}</p>
                
                <div className="mt-4 flex justify-between items-center">
                  <a
                    href={pyq.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded"
                  >
                    Download
                  </a>
                  
                  <button
                    onClick={() => handleUpvote(pyq._id)}
                    className="flex items-center text-gray-600 hover:text-green-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>{pyq.upvotes || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600">No PYQs found based on your filters</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filter criteria or upload some PYQs!</p>
        </div>
      )}
    </div>
  );
};

export default PyqsPage;