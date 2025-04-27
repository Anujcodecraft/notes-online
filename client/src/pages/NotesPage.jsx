import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const NotesPage = () => {
  const [filters, setFilters] = useState({ year: '', branch: '', subject: '' });
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const years = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'CHE'];
  const subjects = ['Data Structures', 'Algorithms', 'Database', 'Networks', 'OS', 'TOC', 'AI', 'ML', 'Math'];

  const allFiltersSelected = Boolean(filters.year && filters.branch && filters.subject);

  useEffect(() => {
    if (!allFiltersSelected) {
      setNotes([]);
      return;
    }

    const fetchNotes = async () => {
      setLoading(true);
      setError('');

      try {
        const queryString = new URLSearchParams(filters).toString();
        const res = await fetch(`http://localhost:3000/notes?${queryString}`, {
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to fetch notes');
        }
        const data = await res.json();
        const processedNotes = data.map(note => ({
          ...note,
          upvotes: note.upvotes || [],
          upvotesCount: note.upvotesCount || note.upvotes?.length || 0
        }));
        setNotes(processedNotes);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [filters, allFiltersSelected]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleUpvote = async (noteId) => {
    try {
      if (!currentUser?._id) {
        alert('Please login to upvote notes.');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to upvote notes.');
        return;
      }

      // Optimistic update
      setNotes(prevNotes =>
        prevNotes.map(note => {
          if (note._id === noteId) {
            const isUpvoted = note.upvotes.includes(currentUser._id);
            return {
              ...note,
              upvotes: isUpvoted
                ? note.upvotes.filter(id => id !== currentUser._id)
                : [...note.upvotes, currentUser._id],
              upvotesCount: isUpvoted ? note.upvotesCount - 1 : note.upvotesCount + 1
            };
          }
          return note;
        })
      );

      const response = await fetch(`http://localhost:3000/notes/${noteId}/upvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: currentUser._id })
      });

      if (!response.ok) {
        throw new Error('Failed to update upvote');
      }

      const updatedNote = await response.json();
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note._id === noteId
            ? {
                ...note,
                upvotes: updatedNote.upvotes || note.upvotes,
                upvotesCount: updatedNote.upvotesCount || note.upvotesCount
              }
            : note
        )
      );
    } catch (error) {
      console.error('Upvote error:', error);
      setError(error.message);
      // Revert optimistic update on error
      setNotes(prevNotes => [...prevNotes]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Academic Notes</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FilterSelect name="year" label="Year" value={filters.year} options={years} onChange={handleFilterChange} />
          <FilterSelect name="branch" label="Branch" value={filters.branch} options={branches} onChange={handleFilterChange} />
          <FilterSelect name="subject" label="Subject" value={filters.subject} options={subjects} onChange={handleFilterChange} />
        </div>
      </div>

      {/* Prompt */}
      {!allFiltersSelected && (
        <p className="text-gray-600 mb-6 text-center">
          Please select Year, Branch, and Subject to view notes.
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        allFiltersSelected && (
          notes.length > 0
            ? <NotesGrid notes={notes} onUpvote={handleUpvote} currentUserId={currentUser?._id} />
            : <p className="text-center text-gray-600 py-12">
                No notes found for the selected filters.
              </p>
        )
      )}
    </div>
  );
};

const FilterSelect = ({ name, label, value, options, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-1">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded py-2 px-3 text-gray-700 focus:outline-none"
    >
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const NotesGrid = ({ notes, onUpvote, currentUserId }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {notes.map(note => {
      const upvotes = note.upvotes || [];
      const hasUpvoted = currentUserId ? upvotes.includes(currentUserId) : false;
      const upvotesCount = note.upvotesCount || 0;

      return (
        <div key={note._id} className="bg-white p-4 rounded shadow hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{note.subject}</h3>
              <p className="text-sm text-gray-600">Year: {note.year}</p>
              <p className="text-sm text-gray-600">Branch: {note.branch}</p>
            </div>
            <button
              onClick={() => onUpvote(note._id)}
              disabled={!currentUserId || hasUpvoted}
              className={`flex items-center space-x-1 ${hasUpvoted ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
              title={!currentUserId ? 'Login to upvote' : hasUpvoted ? 'Already upvoted' : 'Upvote this note'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
              <span>{upvotesCount}</span>
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-2">
            Uploaded by: {note.uploadedBy?.name || 'Unknown'}
          </p>

          <div className="mt-4">
            <a
              href={note.fileurl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              View PDF
            </a>
          </div>
        </div>
      );
    })}
  </div>
);

export default NotesPage;