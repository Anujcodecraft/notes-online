import { Link } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

// Team member data
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
    <div className="min-h-screen bg-white mt-20">
      {/* Header Section */}
      <div className="bg-white py-4 px-6 border-b-4 border-blue-900">
        <h1 className="text-2xl font-bold text-blue-900">MAULANA AZAD NATIONAL INSTITUTE OF TECHNOLOGY BHOPAL (M.P.) INDIA</h1>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10 flex">
        {/* Sidebar */}
        <div className="w-1/4 pr-8">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold text-blue-900 border-b-2 border-blue-900 pb-2">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="text-blue-900 hover:underline">Home</Link></li>
              <li><Link to="/about" className="text-blue-900 font-medium hover:underline">About Us</Link></li>
              <li><Link to="/ContactUs" className="text-blue-900 hover:underline">Contact</Link></li>
              {isAuthenticated && (
                <>
                  <li><Link to="/AllNotes" className="text-blue-900 hover:underline">Study Notes</Link></li>
                  <li><Link to="/pyqs" className="text-blue-900 hover:underline">PYQs</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-3/4">
          <div className="bg-gray-100 p-8 rounded shadow">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 border-b-2 border-blue-900 pb-2">About MANIT Study Portal</h2>
            
            <div className="space-y-6 text-gray-800">
              <section>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Our Mission</h3>
                <p>
                  MANIT Study Portal is a student-driven initiative created to solve the problem of fragmented academic resources at our institute. 
                  We noticed students struggling to find quality notes, previous year questions, and study materials in one centralized location.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">The Problem We Solve</h3>
                <p>
                  Before this portal, students faced several challenges:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Scattered study materials across multiple platforms and personal drives</li>
                  <li>Difficulty finding verified, quality resources for specific subjects</li>
                  <li>No centralized repository for previous year questions with solutions</li>
                  <li>Limited collaboration between students from different batches</li>
                  <li>Time wasted searching for materials instead of studying</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Our Solution</h3>
                <p>
                  MANIT Study Portal provides:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>A centralized, searchable database of academic resources</li>
                  <li>Branch-wise and subject-wise organization of materials</li>
                  <li>Verified previous year questions with solutions</li>
                  <li>User rating system to highlight quality content</li>
                  <li>Easy upload and download functionality</li>
                  <li>Mobile-friendly access to study materials anytime</li>
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-bold text-blue-900 mb-6 border-b-2 border-blue-900 pb-2 mt-10">Meet Our Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-blue-200 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="h-16 w-16 bg-blue-900 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {member.name.charAt(0)}
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-blue-900">{member.name}</h4>
                      <p className="text-blue-700 font-medium">{member.role}</p>
                      <p className="text-sm text-gray-600">{member.department}</p>
                      <p className="text-sm text-gray-600 mb-4">{member.year}</p>
                      
                      {/* Social Links */}
                      <div className="flex justify-center space-x-4">
                        <a 
                          href={member.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-blue-900 transition-colors"
                          aria-label={`${member.name}'s GitHub`}
                        >
                          <FaGithub className="h-5 w-5" />
                        </a>
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:text-blue-900 transition-colors"
                          aria-label={`${member.name}'s LinkedIn`}
                        >
                          <FaLinkedin className="h-5 w-5" />
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