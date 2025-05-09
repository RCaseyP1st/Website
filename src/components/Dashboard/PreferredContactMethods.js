import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import chartColors from "./chartColors";
import DashboardSectionWrapper from "./DashboardSectionWrapper";

const PreferredContactMethods = ({ records }) => {
  const methodCounts = {};

  records.forEach((rec) => {
    const values = rec.fields["Preferred Method of Contact"];
    const otherField = rec.fields["Other Method of Contact"];

    const isValidMethod = (val) => {
      if (!val) return false;
      const str = val.toString().trim();
      const lower = str.toLowerCase();
      if (!str || lower === "n/a" || lower === "na" || lower === "not applicable")
        return false;
      if (lower === "other" && (!otherField || otherField.toLowerCase() === "n/a" || otherField.toLowerCase() === "na"))
        return false;
      return true;
    };

    if (Array.isArray(values)) {
      values.forEach((method) => {
        if (isValidMethod(method)) {
          methodCounts[method] = (methodCounts[method] || 0) + 1;
        }
      });
    } else if (typeof values === "string") {
      values
        .split(",")
        .map((s) => s.trim())
        .filter(isValidMethod)
        .forEach((method) => {
          methodCounts[method] = (methodCounts[method] || 0) + 1;
        });
    }
  });

  const chartData = Object.entries(methodCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <DashboardSectionWrapper>
      <h2 className="text-xl font-semibold text-brandBlue mb-4">
        Preferred Method of Contact for Wellbeing Review (Form Responses)
      </h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">No preference data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </DashboardSectionWrapper>
  );
};

export default PreferredContactMethods;
