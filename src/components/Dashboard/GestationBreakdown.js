import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import chartColors from "./chartColors";
import DashboardSectionWrapper from "./DashboardSectionWrapper";

const GestationBreakdown = ({ records }) => {
  const counts = {};

  records.forEach((rec) => {
    const value = rec.fields["Gestation Period"];
    if (value && value.toLowerCase() !== "n/a" && value.toLowerCase() !== "not applicable") {
      counts[value] = (counts[value] || 0) + 1;
    }
  });

  const chartData = Object.entries(counts).map(([label, count]) => ({
    label,
    count,
  }));

  return (
    <DashboardSectionWrapper>
      <h2 className="text-xl font-semibold text-brandGreen mb-4">
        Gestation Stage at Time of Referral
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No gestation data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(v) => `${v} responses`} />
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

export default GestationBreakdown;
