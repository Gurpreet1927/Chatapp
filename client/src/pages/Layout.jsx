import React from "react";
import Navbar from "../components/navbar.jsx";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();
  const hideNavbarPaths = ["/profile"];

  return (
    <div className="flex flex-col h-screen">
      {/* Conditionally render Navbar */}
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

      {/* Main Content: Children */}
      <div className="flex flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
