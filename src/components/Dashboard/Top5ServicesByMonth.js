import React, { useState, useMemo } from "react";
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

const Top5ServicesByMonth = ({ records }) => {
  const monthlyData = {};

  records.forEach((rec) => {
    const date = new Date(rec.createdTime);
    const monthKey = new Date(date.getFullYear(), date.getMonth()).toISOString();
    const monthLabel = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    const services = rec.fields["Resources/Services Signposted"] || [];

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        label: monthLabel,
        serviceCounts: {},
      };
    }

    services.forEach((service) => {
      if (!monthlyData[monthKey].serviceCounts[service]) {
        monthlyData[monthKey].serviceCounts[service] = 0;
      }
      monthlyData[monthKey].serviceCounts[service]++;
    });
  });

  const sortedKeys = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));
  const mostRecentMonthWithData = [...sortedKeys]
  .reverse()
  .find((key) => {
    const counts = monthlyData[key]?.serviceCounts || {};
    return Object.values(counts).some((count) => count > 0);
});

const [selectedMonth, setSelectedMonth] = useState(mostRecentMonthWithData || sortedKeys[sortedKeys.length - 1]);


  const chartData = useMemo(() => {
    const counts = monthlyData[selectedMonth]?.serviceCounts || {};
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [selectedMonth, monthlyData]);

  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-brandPink mb-2">
        Most Referred Services by Month
      </h2>
      <label className="text-sm mr-2 text-gray-700 font-medium">
        Select Month:
      </label>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="p-2 border rounded mb-4"
      >
        {sortedKeys.map((key) => (
          <option key={key} value={key}>
            {monthlyData[key].label}
          </option>
        ))}
      </select>

      {chartData.length === 0 ? (
        <p className="text-gray-500">No data available for this month.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
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

export default Top5ServicesByMonth;