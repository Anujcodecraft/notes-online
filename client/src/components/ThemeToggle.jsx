import React, { createContext, useState, useEffect, useContext } from 'react';

import { ThemeContext } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 mt-4 bg-gray-800 text-white dark:bg-gray-200 dark:text-black rounded"
    >
      Switch to {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
};

export default ThemeToggle;
