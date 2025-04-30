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

  const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];
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

  // ... [keep all your existing useEffect hooks for fetching notes]

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

  // ... [keep all your existing functions like fetchNotes, handleViewPDF, handleUpvote, etc.]

  // Update the filter section in your return statement:
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* ... [keep your header section] */}

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            Filter Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="year">
                Academic Year
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
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
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
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
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
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
          </div>
        </div>

        {/* ... [keep the rest of your component] */}
      </div>
    </div>
  );
};

export default NotesPage;