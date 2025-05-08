import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import chartColors from "./chartColors";

const MonthlyCompletionTrend = ({ records }) => {
  const monthlyStats = {};

  records.forEach((rec) => {
    const date = new Date(rec.createdTime);
    const label = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!monthlyStats[label]) {
      monthlyStats[label] = { total: 0, completed: 0 };
    }

    monthlyStats[label].total++;
    if (rec.fields["Wellbeing Review Completed?"]) {
      monthlyStats[label].completed++;
    }
  });

  const chartData = Object.entries(monthlyStats)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([month, { total, completed }]) => ({
      month,
      percentage: total ? Math.round((completed / total) * 100) : 0,
    }));

  return (
    <>
      <h2 className="text-xl font-semibold text-brandPink mb-4">Monthly Completion % Trend</h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis unit="%" domain={[0, 100]} allowDecimals={false} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="percentage">
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
    </>
  );
};

export default MonthlyCompletionTrend;
