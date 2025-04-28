import { useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import NotesPage from './pages/NotesPage';
import PyqsPage from './pages/PyqsPage';
import UploadNotesPage from './pages/UploadNotesPage';
import UploadPyqsPage from './pages/UploadPyqsPage';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import Anuj from './pages/Anuj';
import Profile from './pages/Profile';
import MyNotes from './pages/MyNotes';
import MyPyqs from './pages/MyPyqs';
function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/AllNotes" element={<NotesPage />} />
            <Route path="/pyqs" element={<PyqsPage />} />
            <Route path="/upload-notes" element={<UploadNotesPage/>} />
            <Route path="/upload-pyqs" element={<UploadPyqsPage />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/my-notes" element={<MyNotes />} />
            <Route path="/my-pyqs" element={<MyPyqs />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
