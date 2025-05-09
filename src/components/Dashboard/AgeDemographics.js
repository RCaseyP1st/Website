import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import chartColors from "./chartColors";
import DashboardSectionWrapper from "./DashboardSectionWrapper";

const AgeDemographics = ({ records }) => {
  const hubAgeMap = {};
  const ageRangeCounts = {};

  records.forEach((rec) => {
    const hub = rec.fields["Local EPUT Hub"] || "Unknown";
    const ageStr = rec.fields["Age"];
    const range = rec.fields["Age Range"];

    const age = parseInt(ageStr, 10);
    if (!isNaN(age)) {
      if (!hubAgeMap[hub]) hubAgeMap[hub] = [];
      hubAgeMap[hub].push(age);
    }

    if (range) {
      ageRangeCounts[range] = (ageRangeCounts[range] || 0) + 1;
    }
  });

  const avgAgeData = Object.entries(hubAgeMap).map(([hub, ages]) => {
    const total = ages.reduce((sum, a) => sum + a, 0);
    const avg = total / ages.length;
    return { hub, averageAge: parseFloat(avg.toFixed(1)) };
  });

  const ageRangeData = Object.entries(ageRangeCounts)
    .sort((a, b) => a[0].localeCompare(b[0])) // Sort by label
    .map(([range, count]) => ({
      name: range,
      value: count,
    }));

  return (
    <DashboardSectionWrapper>
      <h2 className="text-xl font-semibold text-brandGreen mb-4">
        Average Age by Hub
      </h2>
      {avgAgeData.length === 0 ? (
        <p className="text-gray-500">No age data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={avgAgeData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="hub" width={220} />
            <Tooltip formatter={(v) => `${v} years`} />
            <Bar dataKey="averageAge">
              {avgAgeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      <h2 className="text-xl font-semibold text-brandBlue mt-10 mb-4">
        Age Range Distribution (All Hubs)
      </h2>
      {ageRangeData.length === 0 ? (
        <p className="text-gray-500">No age range data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={ageRangeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {ageRangeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
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

export default AgeDemographics;
