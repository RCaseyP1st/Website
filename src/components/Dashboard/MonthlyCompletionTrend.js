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

const MonthlyCompletionTrend = ({ records }) => {
  const monthlyStats = {};

  records.forEach((rec) => {
    const date = new Date(rec.createdTime);
    const monthKey = new Date(date.getFullYear(), date.getMonth()); // Just year + month
    const keyStr = monthKey.toISOString();

    if (!monthlyStats[keyStr]) {
      monthlyStats[keyStr] = {
        total: 0,
        completed: 0,
        month: monthKey,
      };
    }

    monthlyStats[keyStr].total++;
    if (rec.fields["Wellbeing Review Completed?"]) {
      monthlyStats[keyStr].completed++;
    }
  });

  const chartData = Object.entries(monthlyStats)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([monthKey, { total, completed }]) => ({
      month: new Date(monthKey).toLocaleString("default", {
        month: "short",
        year: "numeric",
      }),
      percentage: total ? Math.round((completed / total) * 100) : 0,
      completed,
      total,
    }));

  return (
    <>
      <h2 className="text-xl font-semibold text-brandPink mb-4">
        Monthly Completion % Trend
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis unit="%" domain={[0, 100]} allowDecimals={false} />
            <Tooltip
              formatter={(value, name, props) => {
                const { payload } = props;
                return [
                  `${value}% (${payload.completed}/${payload.total})`,
                  "Completion Rate",
                ];
              }}
            />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke={chartColors[0]}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default MonthlyCompletionTrend;
