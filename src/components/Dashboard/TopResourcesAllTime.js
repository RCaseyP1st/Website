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
import chartColors from "./chartColors";

const TopResourcesAllTime = ({ records }) => {
  const tallyMap = {};
  const labelMap = {};

  records.forEach((rec, i) => {
    const status = rec.fields["Record Status"] || "";
    const isCompleted = status.includes("Complete");
    const services = rec.fields["Resources/Services Signposted"];
    const userNumber = rec.fields["User Number"] || `#${i + 1}`;

    if (isCompleted) {
      console.log(`✅ Using Record: ${userNumber} (Status: ${status})`);
    } else {
      return;
    }

    if (!Array.isArray(services)) return;

    services.forEach((tag) => {
      const cleaned = tag?.trim().replace(/\s+/g, " ").toLowerCase();
      if (!cleaned) return;

      tallyMap[cleaned] = (tallyMap[cleaned] || 0) + 1;
      labelMap[cleaned] = tag;
    });
  });

  const chartData = Object.entries(tallyMap)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({
      name: labelMap[key],
      count,
    }))
    .slice(0, 10);

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-brandGreen mb-2">
        Top Signposted Resources (Completed Reviews Only)
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Showing top 10 services across all completed reviews.
      </p>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={200} />
            <Tooltip formatter={(value) => `${value} referrals`} />
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
    </div>
  );
};

export default TopResourcesAllTime;
