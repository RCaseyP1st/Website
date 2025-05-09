import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import chartColors from "./chartColors";
import DashboardSectionWrapper from "./DashboardSectionWrapper";

const AllContactMethods = ({ records }) => {
  const methodCounts = {};

  // Function to check if a method is valid
  const isValidMethod = (val) => {
    if (!val) return false;
    const lower = val.toString().toLowerCase().trim();
    return (
      lower && lower !== "n/a" && lower !== "na" && lower !== "not applicable"
    );
  };

  records.forEach((rec) => {
    // Fields that are single-select
    const singleFields = [
      "1st Contact Method",
      "2nd Contact Method",
      "3rd Contact Method",
    ];

    singleFields.forEach((field) => {
      const method = rec.fields[field];
      if (isValidMethod(method)) {
        methodCounts[method] = (methodCounts[method] || 0) + 1;
      }
    });

    // Only include actual contact attempts, not preferences
    const multiFields = ["Follow-Up Method"];

    multiFields.forEach((field) => {
      const values = rec.fields[field];
      if (Array.isArray(values)) {
        values.forEach((method) => {
          if (isValidMethod(method)) {
            methodCounts[method] = (methodCounts[method] || 0) + 1;
          }
        });
      } else if (typeof values === "string") {
        values
          .split(",")
          .map((s) => s.trim())
          .filter(isValidMethod)
          .forEach((method) => {
            methodCounts[method] = (methodCounts[method] || 0) + 1;
          });
      }
    });
  });

  const chartData = Object.entries(methodCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <DashboardSectionWrapper>
      <h2 className="text-xl font-semibold text-brandBlue mb-4">
        Combined Contact Method Usage
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No contact method data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </DashboardSectionWrapper>
  );
};

export default AllContactMethods;
