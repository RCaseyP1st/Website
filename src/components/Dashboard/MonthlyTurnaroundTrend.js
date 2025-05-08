import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import chartColors from "./chartColors";

const MonthlyTurnaroundTrend = ({ records }) => {
  const monthlyStats = {};

  records.forEach((rec) => {
    const completedDateStr = rec.fields["Date Completed"];
    const createdDateStr = rec.createdTime;

    if (!completedDateStr || !createdDateStr) return;

    const createdDate = new Date(createdDateStr);
    const completedDate = new Date(completedDateStr);
    const turnaroundDays = Math.ceil(
      (completedDate - createdDate) / (1000 * 60 * 60 * 24)
    );

    const monthKey = new Date(createdDate.getFullYear(), createdDate.getMonth());
    const keyStr = monthKey.toISOString();

    if (!monthlyStats[keyStr]) {
      monthlyStats[keyStr] = {
        totalDays: 0,
        count: 0,
        month: monthKey,
      };
    }

    monthlyStats[keyStr].totalDays += turnaroundDays;
    monthlyStats[keyStr].count += 1;
  });

  const chartData = Object.entries(monthlyStats)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([_, { month, totalDays, count }]) => ({
      month: month.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }),
      average: count > 0 ? (totalDays / count).toFixed(2) : 0,
    }));

  return (
    <>
      <h2 className="text-xl font-semibold text-brandBlue mb-4">
        Monthly Avg. Turnaround Time (Days)
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, "dataMax + 1"]} />
            <Tooltip
              formatter={(value) => `${value} days`}
              labelClassName="font-semibold"
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke={chartColors[0]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default MonthlyTurnaroundTrend;
