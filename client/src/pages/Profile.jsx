
import {
  User,
  Mail,
  Calendar,
  Book,
  FileText,
  CheckSquare,
  Clock,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";
import Spinner from "../components/Spinner";



export default function UserPagePreview() {
  const { currentUser } = useAuth();
  console.log("current user", currentUser)
  const [stats, setStats] = useState({
    notesUploaded: 0,
    pyqsUploaded: 0,
    solutionsUploaded: 0,
    dateJoined: currentUser?.date || "Loading..."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if(!currentUser){
        return;
      }
      try {
        // Fetch notes count
        const notesRes = await axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/my-notes?email=${currentUser.emailtoSend}`);
        // Fetch PYQs count (you'll need to implement this endpoint)
        const pyqsRes = await axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/my-pyqs?email=${currentUser.emailtoSend}`);
        // Fetch solutions count (you'll need to implement this endpoint)
        // const solutionsRes = await axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/my-solutions?email=${currentUser.emailtoSend}`);
        
        setStats({
          ...stats,
          notesUploaded: notesRes.data.length,
          pyqsUploaded: pyqsRes.data.length,
          // solutionsUploaded: solutionsRes.data.length
        });
      } catch (err) {
        console.error('Error fetching user stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.emailtoSend) {
      fetchUserStats();
    }
  }, [currentUser]);

  const statCards = [
    { icon: Book, value: stats.notesUploaded, label: "Notes", color: "blue" },
    { icon: FileText, value: stats.pyqsUploaded, label: "PYQs", color: "green" },
    { icon: CheckSquare, value: stats.solutionsUploaded, label: "Solutions", color: "purple" },
    { icon: Clock, value: new Date(stats.dateJoined).toLocaleDateString(), label: "Member Since", color: "indigo" }
  ];

  if (loading) {
    return (

  <Spinner/>

    );
  }
  if(!currentUser){
    return (
      <div>Please login or signup first</div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen pt-6 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            User Profile
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Manage your account and view contributions
          </p>
        </motion.div>

        {/* Profile Card with animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden"
        >
          {/* Profile Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-12 relative">
            <div className="flex flex-col items-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-32 w-32 bg-white dark:bg-gray-100 rounded-full flex items-center justify-center mb-6 border-4 border-white/20 shadow-lg"
              >
                <User className="h-16 w-16 text-blue-600 dark:text-blue-700" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white">
                {currentUser.nametoSend}
              </h2>
              <p className="text-blue-100 mt-2">
                {currentUser.emailtoSend}
              </p>
            </div>
          </div>

          {/* User Information */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Details Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-600 flex items-center">
                  <User className="h-5 w-5 text-blue-500 mr-2" />
                  Account Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                      <p className="text-gray-900 dark:text-white font-medium">{currentUser.nametoSend}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                      <p className="text-gray-900 dark:text-white font-medium">{currentUser.emailtoSend}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
                      <p className="text-gray-900 dark:text-white font-medium">{stats.dateJoined}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`bg-white dark:bg-gray-700 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 flex flex-col items-center text-center`}
                  >
                    <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/50 mb-3`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>


          </div>
        </motion.div>
      </div>
    </div>
  );
}