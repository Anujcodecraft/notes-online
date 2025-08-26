/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getBranchesForYear,
  getSubjectsForYearAndBranch,
} from "../services/subjects";
import NotesCard from "../components/NotesCard";
import Spinner from "../components/Spinner";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    year: "",
    branch: "",
    subject: "",
  });
  const { isAuthenticated, currentUser, upvotedNoteIds, setUpvotedNoteIds } =
    useAuth();

  const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      //  window.location.reload();
    }
  });

  // Update available branches when year changes
  useEffect(() => {
    if (filters.year) {
      const branches = getBranchesForYear(filters.year);
      setAvailableBranches(branches);

      // Reset branch filter if the current selection isn't valid for the new year
      if (filters.branch && !branches.includes(filters.branch)) {
        setFilters((prev) => ({ ...prev, branch: "", subject: "" }));
      }
    } else {
      setAvailableBranches([]);
      setAvailableSubjects([]);
    }
  }, [filters.year]);

  // Update available subjects when year or branch changes
  useEffect(() => {
    if (filters.year && filters.branch) {
      const subjects = getSubjectsForYearAndBranch(
        filters.year,
        filters.branch
      );
      setAvailableSubjects(subjects);

      // Reset subject filter if the current selection isn't valid for the new branch/year
      if (filters.subject && !subjects.includes(filters.subject)) {
        setFilters((prev) => ({ ...prev, subject: "" }));
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
      fetchNotes(0); // Always fetch first page when filters change
    } else {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && page >= 0) {
      fetchNotes(page);
    }
  }, [page, isAuthenticated]);

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
      const res = await fetch(
        `${
          import.meta.env.VITE_BASE_URL_BACKEND
        }/notes?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token} ` : "",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch notes");
      }

      let data = await res.json();

      // extract isLastPage and assign notes to data
      const isLastPage = data?.isLastPage;
      if (isLastPage) setHasMore(!isLastPage);
      data = data?.notes;

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
      if (data.length === 0) {
        setHasMore(false);
      }
    } catch (e) {
      console.error("Error fetching notes:", e);
      setError(e.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      // Reset dependent filters when parent filter changes
      ...(name === "year" ? { branch: "", subject: "" } : {}),
      ...(name === "branch" ? { subject: "" } : {}),
    }));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(0, prevPage - 1));
    setHasMore(true);
  };
  const renderNotesContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return (
        <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-400 dark:border-red-500 p-4 mb-6 rounded">
          <p className="text-sm text-red-700 dark:text-red-100">{error}</p>
        </div>
      );
    }

    if (notes.length > 0) {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NotesCard
                notes={notes}
                page={page}
                setNotes={setNotes}
                fetchNotes={fetchNotes}
                note={note}
                handleViewPDF={handleViewPDF}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevPage}
              disabled={page === 0}
              className={`px-4 py-2 rounded-md transition-colors ${
                page === 0
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Previous
            </button>

            <span className="text-gray-700 dark:text-gray-200">
              Page {page + 1}
            </span>

            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className={`px-4 py-2 rounded-md transition-colors ${
                !hasMore
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No notes found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {Object.values(filters).some(Boolean)
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Please select filters to view notes."}
          </p>
          {Object.values(filters).some(Boolean) && (
            <div className="mt-6">
              <button
                onClick={() =>
                  setFilters({ year: "", branch: "", subject: "" })
                }
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
            className={`px-4 py-2 rounded-md ${
              page === 0
                ? "bg-gray-300 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {page + 1}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!hasMore}
            className={`px-4 py-2 rounded-md ${
              !hasMore
                ? "bg-gray-300 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Please login to view notes
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You need to be logged in to access academic notes and study
              materials.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Academic Notes
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Access study materials and notes shared by students
          </p>
        </div>

        {/* Filters */}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            Filter Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Year Filter */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                htmlFor="year"
              >
                Academic Year
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                id="year"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Filter */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="branch"
              >
                Branch
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                id="branch"
                name="branch"
                value={filters.branch}
                onChange={handleFilterChange}
                disabled={!filters.year}
              >
                <option value="">All Branches</option>
                {availableBranches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="subject"
              >
                Subject
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                id="subject"
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                disabled={!filters.branch}
              >
                <option value="">All Subjects</option>
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        {renderNotesContent()}
      </div>
    </div>
  );
};

export default NotesPage;
