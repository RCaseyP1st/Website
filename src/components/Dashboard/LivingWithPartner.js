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

const LivingWithPartner = ({ records }) => {
  const counts = {
    Yes: 0,
    No: 0,
  };

  records.forEach((rec) => {
    const value = rec.fields["Living With Partner?"];
    if (value === "Yes" || value === "No") {
      counts[value]++;
    }
  });

  const chartData = Object.entries(counts).map(([label, count]) => ({
    label,
    count,
  }));

  return (
    <DashboardSectionWrapper>
      <h2 className="text-xl font-semibold text-brandPink mb-4">
        Living With Birthing Parent?
      </h2>
      {chartData.every((entry) => entry.count === 0) ? (
        <p className="text-gray-500">No data available.</p>
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

export default LivingWithPartner;
