// src/components/Spinner.jsx

import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin dark:border-blue-400 dark:border-t-transparent"></div>
    </div>
  );
};

export default Spinner;
