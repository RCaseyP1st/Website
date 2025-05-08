import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import DashboardSectionWrapper from "./DashboardSectionWrapper";
import chartColors from "./chartColors";

const DropOffAnalysis = ({ records }) => {
  const dropOffCounts = {};

  records.forEach((rec) => {
    const reason = rec.fields["Drop-off Reason"];
    if (!reason) return;
    dropOffCounts[reason] = (dropOffCounts[reason] || 0) + 1;
  });

  const chartData = Object.entries(dropOffCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([reason, count]) => ({
      reason,
      count,
    }));

  return (
    <DashboardSectionWrapper>
      <h2 className="text-2xl font-bold text-brandBlue mb-4">
        Drop-Off Reasons (Completed Records)
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No drop-off data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="reason" width={300} />
            <Tooltip formatter={(value) => `${value} records`} />
            <Bar dataKey="count">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </DashboardSectionWrapper>
  );
};

export default DropOffAnalysis;
