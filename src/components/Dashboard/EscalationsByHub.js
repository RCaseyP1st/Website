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

const EscalationAvoidanceByHub = ({ records }) => {
  const hubTotals = {};
  const hubWithoutEscalations = {};

  records.forEach((rec) => {
    const hub = rec.fields["Local EPUT Hub"] || "Not Recognised";
    const escalated = rec.fields["Escalated to PMHS?"];

    hubTotals[hub] = (hubTotals[hub] || 0) + 1;
    if (!escalated) {
      hubWithoutEscalations[hub] = (hubWithoutEscalations[hub] || 0) + 1;
    }
  });

  const chartData = Object.keys(hubTotals).map((hub) => {
    const total = hubTotals[hub];
    const without = hubWithoutEscalations[hub] || 0;
    const successRate = Math.round((without / total) * 100);
    return {
      hub,
      successRate,
      tooltip: `${without} of ${total} cases had no escalation`,
    };
  });

  return (
    <DashboardSectionWrapper>
      <h2 className="text-xl font-semibold text-brandPink mb-4">
        Escalation Avoidance Rate (by Hub)
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} unit="%" />
            <YAxis type="category" dataKey="hub" width={220} />
            <Tooltip
              formatter={(value, name, props) =>
                [`${value}% (${props.payload.tooltip})`, "No Escalation Rate"]
              }
            />
            <Bar dataKey="successRate">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </DashboardSectionWrapper>
  );
};

export default EscalationAvoidanceByHub;
