import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import React from 'react';

const PyqsPage = () => {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    year: '',
    branch: '',
    subject: '',
    title: ''
  });
  const { isAuthenticated, currentUser } = useAuth();

  // Define branches based on year
  const getBranchesForYear = (year) => {
    if (year === "First Year") {
      return ["Common"];
    }
    return ["CSE", "IT", "ECE", "EEE", "ME", "CE", "CHE"];
  };

  // Define subjects based on year and branch
  const getSubjectsForYearAndBranch = (year, branch) => {
    if (year === "First Year") {
      return ["1st Semester", "2nd Semester"];
    }

    if (year === "Second Year") {
      switch (branch) {
        case "ME":
          return [
            "Math3", "FOE", "Engg Thermodynamics", "MOM", "Material Science and Engg",
            "Mechanical Drawing and CAD", "Heat Engine Lab", "MOM Lab",
            "Material Characterisation Lab", "Professional Practice Lab", "Minor 1 MOM",
            "Math4", "FOD", "Machine Design 1", "Mechanics of Machine",
            "Manufacturing Process 1", "Industrial Engg and Operation Research",
            "Mechanism of Machine Lab", "Manufacturing Techniques Lab 1",
            "Project Based Lab 1", "Minor 2 Manufacturing Process 1"
          ];
        case "CSE":
          return [
            "FOE", "Software Engg", "CSO", "TOC", "Data Communication",
            "ADA", "DSA", "DBMS", "PPL", "DCD"
          ];
        case "ECE":
          return [
            "FOE", "Digital Signal Processing", "Linear Integrated Circuit",
            "Microprocessor and Microcontroller", "EM Field and Transmission Lines",
            "Electronic Instrument and Measurement"
          ];
        case "EEE":
          return [
            "Utilisation of Electrical Energy", "Power System 1",
            "Generation of Electric Power", "Electrical Machine 2",
            "Instrumentation", "Electronics 2"
          ];
        default:
          return ["Common Subjects"];
      }
    }

    if (year === "Third Year") {
      switch (branch) {
        case "ME":
          return [
            "Engg Management", "Machine Design 2", "IC Engine and Gas Turbine",
            "Fluid Mechanics and Hydraulic Machine", "Electrical Machines",
            "Program Electric 1A", "Fluid Mechanics Lab", "Electrical Machinery Lab",
            "IC Engine Lab", "Internship and Industrial Training", "Minor 3 IC Engine and Gas Turbine",
            "DSA", "Heat and Mass Transfer", "Turbo Machine", "Manufacturing Process 2",
            "Program Elective 2A", "Heat and Mass Transfer Lab", "Turbo Machine Lab",
            "Manufacturing Techniques Lab 2", "Project 1", "Minor 4 Heat and Mass Transfer"
          ];
        case "CSE":
          return [
            "Machine Learning", "Advance Data Structure", "NSS", "EM", "DIP"
          ];
        case "ECE":
          return [
            "EM", "DIP", "Optical Communication", "Microwave Engg"
          ];
        case "EEE":
          return [
            "Linear Control System", "Electrical Drives", "Microprocessor",
            "Departmental Elective 3rd", "Departmental Elective 4th", "Open Elective 2"
          ];
        default:
          return ["Common Subjects"];
      }
    }

    return ["All Subjects"];
  };

  const years = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
  const titles = ['Mini', 'Mid', 'End'];
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  // Update available branches when year changes
  useEffect(() => {
    if (filters.year) {
      const branches = getBranchesForYear(filters.year);
      setAvailableBranches(branches);
      
      // Reset branch filter if the current selection isn't valid for the new year
      if (filters.branch && !branches.includes(filters.branch)) {
        setFilters(prev => ({ ...prev, branch: "", subject: "" }));
      }
    } else {
      setAvailableBranches([]);
      setAvailableSubjects([]);
    }
  }, [filters.year]);

  // Update available subjects when year or branch changes
  useEffect(() => {
    if (filters.year && filters.branch) {
      const subjects = getSubjectsForYearAndBranch(filters.year, filters.branch);
      setAvailableSubjects(subjects);
      
      // Reset subject filter if the current selection isn't valid for the new branch/year
      if (filters.subject && !subjects.includes(filters.subject)) {
        setFilters(prev => ({ ...prev, subject: "" }));
      }
    } else {
      setAvailableSubjects([]);
    }
  }, [filters.year, filters.branch]);

 useEffect(() => {
    // Reset page to 0 when filters change
    setPage(0);
    // Only fetch notes if the user is authenticated
    if (isAuthenticated) {
      fetchPyqs(0); // Always fetch first page when filters change
    } else {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

    useEffect(() => {
      if (isAuthenticated && page >= 0) {
        fetchPyqs(page);
      }
    }, [page]);
  const handleViewPDF = (fileUrl) => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const fetchPyqs = async (page) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.year) queryParams.append('year', filters.year);
      if (filters.branch) queryParams.append('branch', filters.branch);
      if (filters.subject) queryParams.append('subject', filters.subject);
      if (filters.title) queryParams.append('title', filters.title);
      if(page) queryParams.append('page', page);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL_BACKEND}/pyqs?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch PYQs');
      
      const data = await response.json();

      const processedData = data.map(pyq => ({
        ...pyq,
        uploadedBy: pyq.user || { name: 'Unknown' },
        upvotes: pyq.upvotes || [],
      }));

      setPyqs(processedData);
      if(data.length===0){
        setHasMore(false)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent filters when parent filter changes
      ...(name === 'year' ? { branch: "", subject: "" } : {}),
      ...(name === 'branch' ? { subject: "" } : {})
    }));
  };

  const handleNextPage = () => {
    console.log("handle next page")
    setPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage(prevPage => Math.max(0, prevPage - 1));
    setHasMore(true);
  };


  const handleUpvote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to upvote.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL_BACKEND}/pyqs/${id}/upvote`, {
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
            pyq._id === id ? { ...pyq, upvotes: [...pyq.upvotes, currentUser.emailtoSend] } : pyq
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
                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="year">
                    Academic Year
                  </label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
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
  
                {/* Branch Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="branch">
                    Branch
                  </label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
                    id="branch"
                    name="branch"
                    value={filters.branch}
                    onChange={handleFilterChange}
                    disabled={!filters.year}
                  >
                    <option value="">All Branches</option>
                    {availableBranches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
  
                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subject">
                    Subject
                  </label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
                    id="subject"
                    name="subject"
                    value={filters.subject}
                    onChange={handleFilterChange}
                    disabled={!filters.branch}
                  >
                    <option value="">All Subjects</option>
                    {availableSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
  
                {/* Exam Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                    Exam Type
                  </label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
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
              <>
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
  
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 0}
                    className={`px-4 py-2 rounded-md ${page === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">Page {page + 1}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={!hasMore}
                    className={`px-4 py-2 rounded-md ${!hasMore ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <>
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
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 0}
                    className={`px-4 py-2 rounded-md ${page === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">Page {page + 1}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={!hasMore}
                    className={`px-4 py-2 rounded-md ${!hasMore ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    Next
                  </button>
                </div>
              </>

            )}
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Please login to view PYQs</h3>
              <p className="mt-1 text-sm text-gray-500">
                You need to be logged in to access previous year question papers.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PyqsPage;