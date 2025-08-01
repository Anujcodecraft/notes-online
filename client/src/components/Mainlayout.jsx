import React, { useState, useContext } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import LandingPage from '../pages/LandingPage';
import { ThemeContext } from '../context/ThemeContext'; // 

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative transition-colors duration-500">
      <Navbar 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        toggleDarkMode={toggleTheme} //  use context method
        darkMode={theme === 'dark'} //  send theme info
      />
      <Sidebar 
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <LandingPage isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default MainLayout;
