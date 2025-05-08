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

const MonthlyAvgReferrals = ({ records }) => {
  const monthlyStats = {};

  records.forEach((rec) => {
    if (!rec.fields["Wellbeing Review Completed?"]) return;

    const date = new Date(rec.createdTime);
    const monthKey = new Date(date.getFullYear(), date.getMonth());
    const keyStr = monthKey.toISOString();

    if (!monthlyStats[keyStr]) {
      monthlyStats[keyStr] = {
        totalReferrals: 0,
        completedReviews: 0,
        month: monthKey,
      };
    }

    const services = rec.fields["Resources/Services Signposted"] || [];
    monthlyStats[keyStr].totalReferrals += services.length;
    monthlyStats[keyStr].completedReviews += 1;
  });

  const chartData = Object.entries(monthlyStats)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([_, { month, totalReferrals, completedReviews }]) => ({
      month: month.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }),
      average:
      completedReviews > 0
        ? Math.round((totalReferrals / completedReviews) * 100) / 100
        : 0,
    
    }));

  return (
    <>
      <h2 className="text-xl font-semibold text-brandGreen mb-4">
        Monthly Avg. Referrals per Review
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
  domain={[0, (dataMax) => Math.ceil(dataMax + 1)]}
  allowDecimals
/>

            <Tooltip
              formatter={(value) => `${value} referrals`}
              labelClassName="font-semibold"
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke={chartColors[2]}
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

export default MonthlyAvgReferrals;
