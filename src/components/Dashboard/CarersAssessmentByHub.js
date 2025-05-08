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
  const assessmentCounts = {};

  records.forEach((rec) => {
    const referred = rec.fields["Referred for Carers Assessment"];
    const hub = rec.fields["Local EPUT Hub"] || "Not Recognised";

    if (!referred) return;

    if (!assessmentCounts[hub]) {
      assessmentCounts[hub] = 0;
    }

    assessmentCounts[hub]++;
  });

  const chartData = Object.entries(assessmentCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([hub, count]) => ({ hub, count }));

  return (
    <DashboardSectionWrapper>
      <h2 className="text-xl font-semibold text-brandGreen mb-4">
        Carers Assessment Referrals (by Hub)
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No referrals recorded.</p>
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
    </DashboardSectionWrapper>
  );
};

export default CarersAssessmentByHub;
