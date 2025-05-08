import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import chartColors from "./chartColors";

const ReviewsByRegion = ({ records }) => {
  const regionCounts = {};

  records.forEach((rec) => {
    const region = rec.fields["Local EPUT Hub"];
    if (!region) return;

    if (!regionCounts[region]) {
      regionCounts[region] = { region, total: 0, completed: 0 };
    }

    regionCounts[region].total += 1;

    if (rec.fields["Wellbeing Review Completed?"]) {
      regionCounts[region].completed += 1;
    }
  });

  const chartData = Object.values(regionCounts).sort((a, b) => b.total - a.total);

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-brandBlue mb-4">
        Total vs Completed Reviews by Region
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No region data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 120, top: 20, right: 30, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="region" width={220} />
            <Tooltip formatter={(value) => `${value} reviews`} />
            <Legend />
            <Bar dataKey="total" fill={chartColors[0]} name="Total Reviews" />
            <Bar dataKey="completed" fill={chartColors[2]} name="Completed Reviews" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ReviewsByRegion;
