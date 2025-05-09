// components/Dashboard/CarersAssessmentByHub.js
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

const CarersAssessmentByHub = ({ records }) => {
  const totalCounts = {};
  const withoutReferralCounts = {};

  records.forEach((rec) => {
    const hub = rec.fields["Local EPUT Hub"] || "Not Recognised";
    const referred = rec.fields["Referred for Carers Assessment"];

    if (!totalCounts[hub]) {
      totalCounts[hub] = 0;
      withoutReferralCounts[hub] = 0;
    }

    totalCounts[hub]++;
    if (!referred) {
      withoutReferralCounts[hub]++;
    }
  });

  const chartData = Object.keys(totalCounts).map((hub) => {
    const total = totalCounts[hub];
    const safe = withoutReferralCounts[hub];
    const successRate = Math.round((safe / total) * 100);
    return {
      hub: `${hub} (${successRate}%)`,
      successRate,
      safe,
      total,
    };
  }).sort((a, b) => b.successRate - a.successRate);

  return (
    <DashboardSectionWrapper>
      <h2 className="text-xl font-semibold text-brandGreen mb-4">
        Cases Without Carers Assessment Referral (by Hub)
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
            <YAxis type="category" dataKey="hub" width={300} />
            <Tooltip
              formatter={(value, name, props) => {
                const { payload } = props;
                return [`${payload.safe} of ${payload.total} cases`, "No Referral"];
              }}
            />
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

export default CarersAssessmentByHub;