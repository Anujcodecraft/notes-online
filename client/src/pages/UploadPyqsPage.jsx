import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

const UploadPyqsPage = () => {
  const [formData, setFormData] = useState({
    year: '',
    branch: '',
    subject: '',
    title: '',
    file: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Options for dropdowns
  const years = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'CHE'];
  const subjects = ['Data Structures', 'Algorithms', 'Database', 'Networks', 'OS', 'TOC', 'AI', 'ML'];
  const titles = ['Mini', 'Mid', 'End'];

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0]
    });
  };

  const {currentUser} = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.file || formData.file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('year', formData.year);
    data.append('branch', formData.branch);
    data.append('subject', formData.subject);
    data.append('title', formData.title);
    data.append('file', formData.file);
    data.append('email',currentUser.emailtoSend)

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL_BACKEND}/upload-pyqs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data
      });

      console.log("The response is ",response)

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload PYQ');
      }

      navigate('/pyqs');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-green-600 mb-6">Upload Previous Year Questions</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                Year *
              </label>
              <select
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="branch">
                Branch *
              </label>
              <select
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                Subject *
              </label>
              <select
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Exam Type *
              </label>
              <select
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              >
                <option value="">Select Exam Type</option>
                {titles.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                PDF File *
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="file"
                name="file"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Only PDF files are accepted</p>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload PYQ'}
            </button>
          </div>
        </form>
      </div>
      <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <p className="font-medium">Note:</p>
        <p>Only selected students are permitted to upload notes.</p>
      </div>
    </div>
  );
};

export default UploadPyqsPage;