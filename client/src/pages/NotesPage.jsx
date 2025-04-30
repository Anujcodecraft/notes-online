import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    year: "",
    branch: "",
    subject: ""
  });
  const { isAuthenticated, currentUser } = useAuth();
  // console.log("page value is ", page, hasMore)

  const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];
  const branches = ["CSE", "IT", "ECE", "EEE", "ME", "CE", "CHE"];
  const subjects = [
    "Data Structures",
    "Algorithms",
    "Database",
    "Networks",
    "OS",
    "TOC",
    "AI",
    "ML",
    "Math",
  ];

  useEffect(() => {
    // Reset page to 0 when filters change
    setPage(0);
    // Only fetch notes if the user is authenticated
    if (isAuthenticated) {
      fetchNotes(0); // Always fetch first page when filters change
    } else {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && page >= 0) {
      fetchNotes(page);
    }
  }, [page]);

  const handleViewPDF = (fileUrl) => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const fetchNotes = async (pageNum) => {
    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams();
      if (filters.year) queryParams.append("year", filters.year);
      if (filters.branch) queryParams.append("branch", filters.branch);
      if (filters.subject) queryParams.append("subject", filters.subject);
      queryParams.append("page", pageNum);

      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL_BACKEND}/notes?${queryParams.toString()}`, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch notes");
      }

      const data = await res.json();
      // console.log("notea are", data)
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format");
      }

      const processedNotes = data.map((note) => ({
        ...note,
        uploadedBy: note.user || { name: "Unknown" },
        upvotes: note.upvotes || [],
        upvotesCount: note.upvotesCount || note.upvotes?.length || 0,
      }));

      setNotes(processedNotes);
      if(data.length===0){
        setHasMore(false)
      }
    } catch (e) {
      console.error("Error fetching notes:", e);
      setError(e.message || "Failed to fetch notes");
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

  const handleUpvote = async (noteId) => {
    try {
      if (!isAuthenticated || !currentUser?.emailtoSend) {
        alert("Please login to upvote notes.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to upvote notes.");
        return;
      }

      const note = notes.find((n) => n._id === noteId);
      if (!note) {
        console.error("Note not found");
        return;
      }

      const isAlreadyUpvoted = note.upvotes.includes(currentUser.emailtoSend);
      if (isAlreadyUpvoted) {
        alert("You have already upvoted this note.");
        return;
      }

      // Optimistic UI update
      setNotes(prevNotes =>
        prevNotes.map(note => {
          if (note._id === noteId) {
            return {
              ...note,
              upvotes: [...note.upvotes, currentUser.emailtoSend],
              upvotesCount: note.upvotesCount + 1,
            };
          }
          return note;
        })
      );

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/notes/${noteId}/upvote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ email: currentUser.emailtoSend }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update upvote");
      }
    } catch (error) {
      console.error("Upvote error:", error);
      alert(error.message || "Something went wrong.");
      // Revert optimistic update on error
      fetchNotes(page);
    }
  };

  const handleNextPage = () => {
    console.log("handle next page")
    setPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage(prevPage => Math.max(0, prevPage - 1));
    setHasMore(true);
  };

  const renderNotesContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      );
    }

    if (notes.length > 0) {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => {
              const hasUpvoted = currentUser?.emailtoSend
                ? note.upvotes.includes(currentUser.emailtoSend)
                : false;

              return (
                <div key={note._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{note.subject}</h3>
                        <div className="mt-2 text-sm text-gray-600">
                          <div>Year: {note.year}</div>
                          <div>Branch: {note.branch}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUpvote(note._id)}
                        disabled={hasUpvoted}
                        className={`flex items-center space-x-1 ${
                          hasUpvoted
                            ? "text-green-600 cursor-not-allowed"
                            : "text-gray-500 hover:text-green-600"
                        }`}
                        title={hasUpvoted ? "Already upvoted" : "Upvote this note"}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill={hasUpvoted ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                        <span>{note.upvotesCount}</span>
                      </button>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      Uploaded by: {note.uploadedBy.name}
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => handleViewPDF(note.fileurl)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View PDF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">No notes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {Object.values(filters).some(Boolean)
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Please select filters to view notes."}
          </p>
          {Object.values(filters).some(Boolean) && (
            <div className="mt-6">
              <button
                onClick={() => setFilters({ year: "", branch: "", subject: "" })}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear all filters
              </button>
            </div>
          )}
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

      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Please login to view notes</h3>
            <p className="mt-1 text-sm text-gray-500">
              You need to be logged in to access academic notes and study materials.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Academic Notes
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Access study materials and notes shared by students
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            Filter Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Academic Year", name: "year", options: years },
              { label: "Branch", name: "branch", options: branches },
              { label: "Subject", name: "subject", options: subjects }
            ].map((filter) => (
              <div key={filter.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={filter.name}>
                  {filter.label}
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
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

        {/* Notes Content */}
        {renderNotesContent()}
      </div>
    </div>
  );
};

export default NotesPage;