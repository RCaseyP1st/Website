// DashboardLayout.js
import React from "react";

const DashboardLayout = ({ children, selectedHub, setSelectedHub }) => {
  return (
    <div className="w-full min-h-screen px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-300 shadow-sm py-3 mb-6 px-4">
          <div className="flex items-center gap-4">
            <label
              htmlFor="hubFilter"
              className="text-sm font-medium text-gray-700"
            >
              View:
            </label>
            <select
              id="hubFilter"
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1"
            >
              <option value="Essex-wide">Essex-wide</option>
              <option value="North Essex (North East)">
                North Essex (North East)
              </option>
              <option value="North Essex (North West)">
                North Essex (North West)
              </option>
              <option value="Mid Essex">Mid Essex</option>
              <option value="South Essex (South East)">
                South Essex (South East)
              </option>
              <option value="South Essex (South West)">
                South Essex (South West)
              </option>
              <option value="Not Recognised">Not Recognised</option>
            </select>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
