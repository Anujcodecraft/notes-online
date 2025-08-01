import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const NotesCard = ({
  note,
  handleViewPDF,
  notes,
  setNotes,
  fetchNotes,
  page,
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(note.upvotes.includes(currentUser.ID));
  useEffect(() => {
    setIsLiked(note.upvotes.includes(currentUser.ID));
  }, [currentUser, note]);

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

      const isLiked = note.upvotes.includes(currentUser.ID);
      const updatedUpvotes = isLiked
        ? note.upvotes.filter((id) => id !== currentUser.ID)
        : [...note.upvotes, currentUser.ID];
      const updatedUpvotesCount = isLiked
        ? note.upvotesCount - 1
        : note.upvotesCount + 1;

      const updatedNote = {
        ...note,
        upvotes: updatedUpvotes,
        upvotesCount: updatedUpvotesCount,
      };

      const method = isLiked ? "DELETE" : "POST";
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/notes/${noteId}/upvote`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: currentUser.emailtoSend }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Failed to upvote!");
        throw new Error(errorData.error || "Failed to update upvote");
      } else {
        toast.success(`${isLiked ? "Downvoted" : "Upvoted"} successfully!`);
      }

      // Optimistic UI update
      const updatedNotes = notes.map((n) =>
        n._id === noteId ? updatedNote : n
      );
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Upvote error:", error);
      toast.error("Something went wrong!");
      // Revert optimistic update
      fetchNotes(page);
    }
    // console.log("updated notes is ", notes)
  };

  return (
    <>
      <div
        key={note._id}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {note.subject}
              </h3>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <div>Year: {note.year}</div>
                <div>Branch: {note.branch}</div>
              </div>
            </div>

            <button
              onClick={() => handleUpvote(note._id)}
              className="flex items-center space-x-1"
              title={isLiked ? "Upvoted" : "Upvote this note"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${
                  isLiked ? "text-blue-600" : "text-gray-400 dark:text-gray-500"
                }`}
                fill={isLiked ? "currentColor" : "none"}
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
              <span className="text-gray-700 dark:text-gray-300">
                {note.upvotesCount}
              </span>
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              Uploaded by:{" "}
              <Link
                to={`/Profile/${note.uploadedBy._id}`}
                className="font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {note.uploadedBy.name}
              </Link>
            </span>
          </div>

          <div className="mt-6">
            <button
              onClick={() => handleViewPDF(note.fileurl)}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              View PDF
            </button>
          </div>
        </div>
      </div>

      <Toaster />
    </>
  );
};

export default NotesCard;
