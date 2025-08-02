import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Trash2, Download, FileText, Clock, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Spinner from "../components/Spinner";

function MyNotes() {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch user notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/my-notes?email=${
            currentUser.emailtoSend
          }`
        );
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.emailtoSend) fetchNotes();
  }, [currentUser]);

  // Handle delete note
  const handleDelete = async (noteId) => {
    setDeletingId(noteId);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/delete-note/${noteId}`
      );
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (err) {
      console.error("Failed to delete note:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Spinner/>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
          <BookOpen
            className="mr-3 text-blue-600 dark:text-blue-400"
            size={32}
          />
          My Uploaded Notes
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          All the notes you've shared with the community
        </p>
      </motion.div>

      {notes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-20"
        >
          <FileText className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">
            No notes uploaded yet
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Start sharing your knowledge with the community!
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 card-hover"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {note.subject}
                  </h3>
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {note.type || "Note"}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="w-24 font-medium">Branch:</span>
                    <span>{note.branch}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="w-24 font-medium">Year:</span>
                    <span>{note.year}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="w-24 font-medium">Uploaded:</span>
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <a
                    href={note.fileurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(note._id)}
                    disabled={deletingId === note._id}
                    className="inline-flex items-center px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    {deletingId === note._id ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyNotes;
