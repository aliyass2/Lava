"use client"
import React, { useState, useEffect } from "react";

const AdminNavbar = () => {
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    // Get admin info from localStorage
    try {
      const adminData = localStorage.getItem("adminData");
      if (adminData) {
        const parsedData = JSON.parse(adminData);
        if (parsedData.admin && parsedData.admin.username) {
          setAdminName(parsedData.admin.username);
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, []);

  // Get first letter of username for avatar
  const firstLetter = adminName ? adminName.charAt(0).toUpperCase() : "أ";

  return (
    <nav className="bg-gradient-to-l from-gray-800 to-black text-white px-6 py-4 shadow-lg border-b border-red-900">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Dashboard Logo/Icon */}
      
          <h1 className="text-2xl font-bold">لوحة تحكم الادمن</h1>
        </div>
        
        <div className="flex items-center space-x-6 space-x-reverse">
    
          
          {/* User Profile - Simplified with no dropdown */}
          <div className="flex items-center  space-x-2 ">
            <div className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center font-bold">
              {firstLetter}
            </div>
            <span className="hidden md:block">{adminName || "أدمن"}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;