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

const prepareChartData = (counts) =>
  Object.entries(counts).map(([name, value]) => ({ name, value }));

const GenderBreakdown = ({ records }) => {
  const genderCounts = records.reduce((acc, rec) => {
    const gender = rec.fields["Gender"] || "Unspecified";
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardSectionWrapper>
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
              label
            >
              {prepareChartData(genderCounts).map((entry, index) => (
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
      </div>
    </DashboardSectionWrapper>
  );
};

export default GenderBreakdown;
