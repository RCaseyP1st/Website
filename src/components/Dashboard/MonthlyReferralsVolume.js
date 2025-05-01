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

const MonthlyReferralsVolume = ({ records }) => {
  const referralVolume = {};

  records.forEach((rec) => {
    const sentRaw = rec.fields["Date WBR Sent"];
    const date = sentRaw ? new Date(sentRaw) : null;
    if (!date) return;

    const label = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    const referrals = rec.fields["Resources/Services Signposted"] || [];
    referralVolume[label] = (referralVolume[label] || 0) + referrals.length;
  });

  const chartData = Object.entries(referralVolume)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([month, count]) => ({ month, count }));

  return (
    <div className="mt-12 w-full">
      <h2 className="text-xl font-semibold text-brandBlue mb-4">Monthly Referrals Volume</h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No referral data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlyReferralsVolume;
