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

const MonthlyReferralsVolume = ({ records }) => {
  const monthlyCounts = {};

  records.forEach((rec) => {
    const date = new Date(rec.createdTime);
    const key = new Date(date.getFullYear(), date.getMonth()).toISOString();
    const services = rec.fields["Resources/Services Signposted"] || [];

    if (!monthlyCounts[key]) {
      monthlyCounts[key] = {
        date,
        referrals: 0,
      };
    }

    monthlyCounts[key].referrals += services.length;
  });

  const chartData = Object.entries(monthlyCounts)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([key, { date, referrals }]) => ({
      month: date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }),
      referrals,
    }));

  return (
    <>
      <h2 className="text-xl font-semibold text-brandPink mb-4">
        Monthly Referrals Volume
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => `${value} referrals`} />
            <Line
              type="monotone"
              dataKey="referrals"
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

export default MonthlyReferralsVolume;
