import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardSectionWrapper from "./DashboardSectionWrapper";

const COLORS = ["#0093a4", "#d60b52", "#7fbf71", "#007cab", "#8854c0"];

const prepareChartData = (counts) =>
  Object.entries(counts).map(([name, value]) => ({ name, value }));

const UserDemo = ({ records }) => {
  const genderCounts = records.reduce((acc, rec) => {
    const gender = rec.fields["Gender"] || "Unspecified";
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});

  const ethnicityCounts = records.reduce((acc, rec) => {
    const ethnicity = rec.fields["Ethnicity"] || "Unspecified";
    acc[ethnicity] = (acc[ethnicity] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardSectionWrapper>
      <div className="w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Demographics</h1>
      </div>

      <div className="flex flex-wrap justify-center gap-16">
        {/* Gender Pie */}
        <div className="w-[400px] max-w-full flex flex-col items-center">
          <h2 className="text-xl font-semibold text-brandBlue mb-2">
            Gender Distribution
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={prepareChartData(genderCounts)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {prepareChartData(genderCounts).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ethnicity Pie */}
        <div className="w-[400px] max-w-full flex flex-col items-center">
          <h2 className="text-xl font-semibold text-brandGreen mb-2">
            Ethnicity Distribution
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={prepareChartData(ethnicityCounts)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {prepareChartData(ethnicityCounts).map((entry, index) => (
                  <Cell
                    key={`eth-cell-${index}`}
                    fill={COLORS[(index + 4) % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardSectionWrapper>
  );
};

export default UserDemo;
