// DashboardLayout.js
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="ml-64 w-full min-h-screen px-6 py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
