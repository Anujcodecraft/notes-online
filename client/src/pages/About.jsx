import { Link } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const teamMembers = [
  {
    name: "Jatin Chandel",
    role: "FullStack Developer",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    github: "https://github.com/jatin917",
    linkedin: "https://www.linkedin.com/in/jatin-chandel-703a7b1ab?originalSubdomain=in"
  },
  {
    name: "Anuj Gautam",
    role: "FullStack Developer",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    github: "https://github.com/Anujcodecraft",
    linkedin: "https://www.linkedin.com/in/anuj-gautam-277a64257"
  },
  {
    name: "Ramkrishna Birla",
    role: "FullStack Developer",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    github: "https://github.com/RamkrishnaBirla",
    linkedin: "https://www.linkedin.com/in/ramkrishna-birla-98b826259"
  }
];

const AboutPage = () => {
  const { isAuthenticated } = useAuth();

  return (
  <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 pt-16 md:pt-20">
  {/* Header Section */}
  <div className="bg-white dark:bg-gray-800 py-3 px-4 md:py-4 md:px-6 border-b-4 border-blue-900 dark:border-blue-500">
    <h1 className="text-lg md:text-2xl font-bold text-blue-900 dark:text-blue-400 text-center md:text-left">
      MAULANA AZAD NATIONAL INSTITUTE OF TECHNOLOGY BHOPAL (M.P.) INDIA
    </h1>
  </div>

  {/* Main Content */}
  <div className="container mx-auto px-4 py-6 md:py-10 flex flex-col md:flex-row">
    {/* Sidebar */}
    <div className="w-full md:w-1/4 md:pr-8 mb-6 md:mb-0">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 border-b-2 border-blue-900 dark:border-blue-500 pb-2">
          Navigation
        </h3>
        <ul className="mt-4 space-y-2">
          <li>
            <Link to="/" className="text-blue-900 dark:text-blue-400 hover:underline block py-1">Home</Link>
          </li>
          <li>
            <Link to="/about" className="text-blue-900 dark:text-blue-400 font-medium hover:underline block py-1">About Us</Link>
          </li>
          <li>
            <Link to="/ContactUs" className="text-blue-900 dark:text-blue-400 hover:underline block py-1">Contact</Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link to="/AllNotes" className="text-blue-900 dark:text-blue-400 hover:underline block py-1">Study Notes</Link>
              </li>
              <li>
                <Link to="/pyqs" className="text-blue-900 dark:text-blue-400 hover:underline block py-1">PYQs</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>

    {/* Main Content Area */}
    <div className="w-full md:w-3/4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 md:p-8 rounded shadow">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-400 mb-4 md:mb-6 border-b-2 border-blue-900 dark:border-blue-500 pb-2">
          About MANIT Study Portal
        </h2>

        <div className="space-y-4 md:space-y-6">
          <section>
            <h3 className="text-lg md:text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2 md:mb-3">
              Our Mission
            </h3>
            <p className="text-sm md:text-base text-gray-800 dark:text-gray-300">
              MANIT Study Portal is a student-driven initiative created to solve the problem...
            </p>
          </section>

          <section>
            <h3 className="text-lg md:text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2 md:mb-3">
              The Problem We Solve
            </h3>
            <p className="text-sm md:text-base text-gray-800 dark:text-gray-300">Before this portal, students faced several challenges:</p>
            <ul className="list-disc pl-5 md:pl-6 mt-2 space-y-1 text-sm md:text-base text-gray-800 dark:text-gray-300">
              <li>Scattered study materials...</li>
              <li>Difficulty finding verified...</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg md:text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2 md:mb-3">
              Our Solution
            </h3>
            <p className="text-sm md:text-base text-gray-800 dark:text-gray-300">MANIT Study Portal provides:</p>
            <ul className="list-disc pl-5 md:pl-6 mt-2 space-y-1 text-sm md:text-base text-gray-800 dark:text-gray-300">
              <li>A centralized, searchable database...</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-400 mb-4 md:mb-6 border-b-2 border-blue-900 dark:border-blue-500 pb-2 mt-6 md:mt-10">
              Meet Our Team
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 p-4 md:p-6 rounded-lg shadow-md border border-blue-200 dark:border-blue-600 text-center">
                  <div className="mb-3 md:mb-4 flex justify-center">
                    <div className="h-12 w-12 md:h-16 md:w-16 bg-blue-900 dark:bg-blue-400 rounded-full flex items-center justify-center text-white dark:text-gray-900 text-lg md:text-xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-blue-900 dark:text-blue-300">{member.name}</h4>
                  <p className="text-blue-700 dark:text-blue-400 font-medium text-sm md:text-base">{member.role}</p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{member.department}</p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4">{member.year}</p>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-3 md:space-x-4">
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-200 hover:text-blue-900 dark:hover:text-blue-400 transition-colors">
                      <FaGithub className="h-4 w-4 md:h-5 md:w-5" />
                    </a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-400 transition-colors">
                      <FaLinkedin className="h-4 w-4 md:h-5 md:w-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default AboutPage;