import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import DashboardSectionWrapper from "./DashboardSectionWrapper";
import chartColors from "./chartColors";

const WellbeingReviewStats = ({ records }) => {
  let totalSessions = 0;
  const methodCounts = {};
  const methodDurations = {};

  records.forEach((rec) => {
    const sessionCount = parseInt(rec.fields["WBR Session Count"], 10) || 0;
    const method = rec.fields["WBR Method"] || "Unspecified";
    const rawDurations = rec.fields["WBR Duration"] || "";

    totalSessions += sessionCount;

    // Method frequency (weighted by session count)
    if (!methodCounts[method]) methodCounts[method] = 0;
    methodCounts[method] += sessionCount;

    // Parse durations (can be multiple)
    const durations = rawDurations
      .split("||")
      .map((d) => d.trim())
      .filter(Boolean);

    let totalMinutes = 0;
    durations.forEach((d) => {
      const parts = d.split(":").map((n) => parseInt(n, 10));
      if (parts.length === 2) {
        totalMinutes += parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        totalMinutes += parts[0] * 60 + parts[1] + parts[2] / 60;
      }
    });

    if (!methodDurations[method]) methodDurations[method] = 0;
    methodDurations[method] += totalMinutes;
  });

  const sessionData = [{ name: "Total Sessions", value: totalSessions }];

  const methodData = Object.entries(methodCounts)
    .filter(([name]) => name !== "Unspecified")
    .map(([name, value]) => ({ name, value }));

  const durationData = Object.entries(methodDurations)
    .filter(([name]) => name !== "Unspecified")
    .map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));

  const formatMinutesToHMS = (totalMinutes) => {
    const totalSeconds = Math.round(totalMinutes * 60);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <DashboardSectionWrapper>
      {/* Chart 1: Total Sessions */}
      <>
        <h2 className="text-xl font-semibold text-brandBlue mb-4">
          Total Wellbeing Review Sessions
        </h2>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart
            data={sessionData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 160, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={200} />
            <Tooltip formatter={(value) => `${value} sessions`} />
            <Bar dataKey="value">
              {sessionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </>

      {/* Chart 2: Review Method Distribution */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-brandGreen mb-4">
          Review Method Distribution
        </h2>
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={methodData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              labelLine
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(1)}%)`
              }
            >
              {methodData.map((_, index) => (
                <Cell
                  key={`method-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} sessions`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 3: Total Duration by Method */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-brandPink mb-4">
          Total Time Spent by Method
        </h2>
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={durationData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              labelLine
              label={({ name, value }) => `${name}: ${formatMinutesToHMS(value)}`}
            >
              {durationData.map((_, index) => (
                <Cell
                  key={`duration-${index}`}
                  fill={chartColors[(index + 2) % chartColors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [formatMinutesToHMS(value), "Duration"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardSectionWrapper>
  );
};

export default WellbeingReviewStats;
