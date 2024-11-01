import React, { useState } from "react";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

const LandingLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Toggle the sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col sm:flex-row bg-teal-100 overflow-x-hidden">
      {isSidebarOpen && (
        <div className={`w-64 ${isSidebarOpen ? 'block' : 'hidden'} sm:block`}>
        <Sidebar />
      </div>
      )}
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="p-4 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LandingLayout;
