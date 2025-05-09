// components/Dashboard/EffectiveContactMethods.js
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
  Legend,
} from "recharts";
import chartColors from "./chartColors";
import DashboardSectionWrapper from "./DashboardSectionWrapper";

const EffectiveContactMethods = ({ records }) => {
  const statsMap = {};

  const isValidMethod = (val) => {
    if (!val) return false;
    const lower = val.toString().toLowerCase().trim();
    return (
      lower && lower !== "n/a" && lower !== "na" && lower !== "not applicable"
    );
  };

  const addAttempt = (method, success) => {
    if (!statsMap[method]) statsMap[method] = { attempts: 0, successes: 0 };
    statsMap[method].attempts++;
    if (success) statsMap[method].successes++;
  };

  records.forEach((rec) => {
    const fields = rec.fields;

    const attempts = [
      { method: fields["1st Contact Method"], reply: fields["Reply (1st Contact)"] },
      { method: fields["2nd Contact Method"], reply: fields["Reply (2nd Contact)"] },
      { method: fields["3rd Contact Method"], reply: fields["Reply (3rd Contact)"] },
    ];

    attempts.forEach(({ method, reply }) => {
      if (isValidMethod(method)) addAttempt(method, reply === "Yes");
    });

    const replyFollowUp = fields["Reply (Follow up)"];
    const followUp = fields["Follow-Up Method"];
    if (followUp) {
      const methods = Array.isArray(followUp)
        ? followUp
        : followUp.split(",").map((s) => s.trim());
      methods.forEach((method) => {
        if (isValidMethod(method)) addAttempt(method, replyFollowUp === "Yes");
      });
    }
  });

  const chartData = Object.entries(statsMap)
    .map(([method, { attempts, successes }]) => ({
      method: `${method} (${Math.round((successes / attempts) * 100)}%)`,
      attempts,
      successes,
      successRate: Math.round((successes / attempts) * 100),
    }))
    .sort((a, b) => b.successRate - a.successRate);

  return (
    <DashboardSectionWrapper>
      <h2 className="text-xl font-semibold text-brandGreen mb-4">
        Most Effective Contact Methods (Success Rates)
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No reply data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} unit="%" />
            <YAxis type="category" dataKey="method" width={300} />
            <Tooltip
              formatter={(value, name, props) => {
                const { payload } = props;
                return [
                  `${payload.successes} of ${payload.attempts} replies (${payload.successRate}%)`,
                  "Success Rate",
                ];
              }}
            />
            <Legend />
            <Bar dataKey="successRate">
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

export default EffectiveContactMethods;
