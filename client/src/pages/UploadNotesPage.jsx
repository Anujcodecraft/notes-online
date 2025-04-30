import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';
import { getBranchesForYear, getSubjectsForYearAndBranch } from '../services/subjects';

const UploadNotesPage = () => {
  const [formData, setFormData] = useState({
    year: '',
    branch: '',
    subject: '',
    file: null
  });
  const {currentUser} = useAuth()
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Options for dropdowns
  const years = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  
    // Update available branches when year changes
    useEffect(() => {
      if (formData.year) {
        const branches = getBranchesForYear(formData.year);
        setAvailableBranches(branches);
        
        // Reset branch filter if the current selection isn't valid for the new year
        if (formData.branch && !branches.includes(formData.branch)) {
          setFormData(prev => ({ ...prev, branch: "", subject: "" }));
        }
      } else {
        setAvailableBranches([]);
        setAvailableSubjects([]);
      }
    }, [formData.year]);
  
    // Update available subjects when year or branch changes
    useEffect(() => {
      if (formData.year && formData.branch) {
        const subjects = getSubjectsForYearAndBranch(formData.year, formData.branch);
        setAvailableSubjects(subjects);
        
        // Reset subject filter if the current selection isn't valid for the new branch/year
        if (formData.subject && !subjects.includes(formData.subject)) {
          setFormData(prev => ({ ...prev, subject: "" }));
        }
      } else {
        setAvailableSubjects([]);
      }
    }, [formData.year, formData.branch]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null; // wait until redirect happens
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
    if (formData.file.size > 10 * 1024 * 1024) {
      alert("File Size Should not be more than 10MB");
      setLoading(false)
      // setFormData({...formData, file:null})
      setError("File Size Should Not be more than 10MB")
      return; // Stop further execution if the file is too large
    }
    
    data.append('year', formData.year);
    data.append('branch', formData.branch);
    data.append('subject', formData.subject);
    data.append('email', currentUser.emailtoSend);
    data.append('file', formData.file); // Only append the file if it's valid
    
    console.log(localStorage.getItem('token'));
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL_BACKEND}/upload-notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload notes');
      }

      navigate('/notes');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  
  console.log(currentUser)

  return (
   
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Upload Notes</h1>
      
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
                {availableBranches.map(branch => (
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
                {availableSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            <div>
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Notes'}
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

export default UploadNotesPage;