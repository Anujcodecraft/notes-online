import React, { useState, useEffect } from 'react';

const NotesPage = () => {
  const [filters, setFilters] = useState({ year: '', branch: '', subject: '' });
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const years    = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'CHE'];
  const subjects = ['Data Structures', 'Algorithms', 'Database', 'Networks', 'OS', 'TOC', 'AI', 'ML', 'Math'];

  // only fetch when all three are selected
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
        setNotes(data);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Academic Notes</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FilterSelect name="year"    label="Year"    value={filters.year}    options={years}    onChange={handleFilterChange} />
          <FilterSelect name="branch"  label="Branch"  value={filters.branch}  options={branches} onChange={handleFilterChange} />
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
            ? <NotesGrid notes={notes} />
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

const NotesGrid = ({ notes }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {notes.map(note => (
      <div key={note._id} className="bg-white p-4 rounded shadow hover:shadow-md transition">
        <h3 className="text-lg font-semibold">{note.subject}</h3>
        <p className="text-sm text-gray-600">Year: {note.year}</p>
        <p className="text-sm text-gray-600">Branch: {note.branch}</p>
        <p className="text-sm text-gray-600">
          Uploaded by: {note.uploadedBy?.name || 'Unknown'}
        </p>
        <div className="mt-4 flex space-x-2">
          {/* View PDF */}
          <a
            href={note.fileurl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            View PDF
          </a>
          {/* Download PDF */}
          <a
            href={note.fileurl}
            download
            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Download
          </a>
        </div>
      </div>
    ))}
  </div>
);

export default NotesPage;
