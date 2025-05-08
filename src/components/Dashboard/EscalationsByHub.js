import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import chartColors from "./chartColors";
import DashboardSectionWrapper from "./DashboardSectionWrapper";

const EscalationsByHub = ({ records }) => {
  const escalationCounts = {};

  records.forEach((rec) => {
    const escalated = rec.fields["Escalated to PMHS?"];
    const hub = rec.fields["Local EPUT Hub"] || "Not Recognised";

    if (!escalated) return;

    if (!escalationCounts[hub]) {
      escalationCounts[hub] = 0;
    }

    escalationCounts[hub]++;
  });

  const chartData = Object.entries(escalationCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([hub, count]) => ({ hub, count }));

  return (
    <DashboardSectionWrapper>
      <h2 className="text-xl font-semibold text-brandPink mb-4">
        Escalations Activated (by Hub)
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No escalation data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="hub" width={220} />
            <Tooltip formatter={(value) => `${value} escalations`} />
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
    </DashboardSectionWrapper>
  );
};

export default EscalationsByHub;
