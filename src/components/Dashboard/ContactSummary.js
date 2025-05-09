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

const ContactSummary = ({ records }) => {
  let totalAttempts = 0;
  let sentMessages = 0;
  let receivedMessages = 0;

  const methodBreakdown = {};

  const parseNoteEntry = (entry) => {
    const lines = entry
      .split(/-{2,}/g)
      .map((l) => l.trim())
      .filter(Boolean);

    lines.forEach((line) => {
      totalAttempts++;

      const isSent = line.startsWith("*");
      if (isSent) sentMessages++;
      else receivedMessages++;

      const cleaned = line.replace(/^\*/, "").trim();

      const methodMatch = cleaned.match(/^(\w+):/);
      if (methodMatch) {
        const method = methodMatch[1];
        if (!methodBreakdown[method]) {
          methodBreakdown[method] = { sent: 0, received: 0 };
        }

        if (isSent) {
          methodBreakdown[method].sent++;
        } else {
          methodBreakdown[method].received++;
        }
      }
    });
  };

  records.forEach((rec) => {
    const fields = rec.fields;

    [
      "1st Contact Notes",
      "2nd Contact Notes",
      "3rd Contact Notes",
      "Post WBR Notes",
      "Follow-Ups",
    ].forEach((field) => {
      if (fields[field]) parseNoteEntry(fields[field]);
    });
  });

  const data = [
    { label: "Total Contact Attempts", value: totalAttempts },
    { label: "Sent Messages", value: sentMessages },
    { label: "Received Messages", value: receivedMessages },
  ];

  const groupedData = Object.entries(methodBreakdown).map(([method, counts]) => ({
    method,
    Sent: counts.sent,
    Received: counts.received,
  }));

  return (
    <DashboardSectionWrapper>
      {/* Contact Summary */}
      <>
        <h2 className="text-xl font-semibold text-brandBlue mb-4">
          Contact & Engagement Summary
        </h2>

        <ResponsiveContainer width="100%" height={data.length * 50}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 160, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis dataKey="label" type="category" width={240} />
            <Tooltip />
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </>

      {/* Message Method Breakdown */}
      <div className="w-full mt-12">
        <h3 className="text-lg font-semibold text-brandGreen mb-2">
          Message Method Breakdown (Sent vs Received)
        </h3>
        <ResponsiveContainer width="100%" height={groupedData.length * 60}>
          <BarChart
            data={groupedData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 160, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="method" width={180} />
            <Tooltip />
            <Bar dataKey="Sent" fill="#00bdf7" />
            <Bar dataKey="Received" fill="#d60b52" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardSectionWrapper>
  );
};

export default ContactSummary;
