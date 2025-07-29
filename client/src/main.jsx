import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import MainLayout from "./components/Mainlayout.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <MainLayout />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
