// ReferralSummary.js
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardSectionWrapper from "./DashboardSectionWrapper";
import Counter from "../UI/Counter";
import DropOffAnalysis from "./DropOffAnalysis";
import EscalationsByHub from "./EscalationsByHub";


const ReferralSummary = ({ records, allRecords }) => {
  const totalReferralsMade = records.length;

  const completedReviews = records.filter((rec) => {
    const status = rec.fields["Record Status"] || "";
    return status.startsWith("✅ Complete");
  }).length;

  const totalServicesSignposted = records.reduce(
    (acc, rec) =>
      acc + (rec.fields["Resources/Services Signposted"] || []).length,
    0
  );

  // Prepare pie data
  const hubCounts = allRecords.reduce((acc, rec) => {
    const hub = rec.fields["Local EPUT Hub"] || "Not Recognised";
    acc[hub] = (acc[hub] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(hubCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    "#0093a4",
    "#d60b52",
    "#7fbf71",
    "#007cab",
    "#8854c0",
    "#ffa500",
    "#8884d8",
  ];

  return (
    <DashboardSectionWrapper>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Referral Summary
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {/* Total Referrals Made */}
        <div className="bg-white shadow-md rounded-xl p-4 text-center border relative group">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Total Wellbeing Reviews Requested
          </h3>
          <Counter
            value={totalReferralsMade}
            className="text-2xl font-bold text-brandBlue"
            decimals={0}
          />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-700 text-white text-sm rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
            Number of records submitted to the Other Half Hub.
          </div>
        </div>

        {/* Completed Reviews */}
        <div className="bg-white shadow-md rounded-xl p-4 text-center border relative group">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Completed Reviews
          </h3>
          <Counter
            value={completedReviews}
            className="text-2xl font-bold text-brandGreen"
            decimals={0}
          />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-700 text-white text-sm rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
            Reviews marked as complete based on "Record Status" field.
          </div>
        </div>

        {/* Services Signposted */}
        <div className="bg-white shadow-md rounded-xl p-4 text-center border relative group">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Services Signposted
          </h3>
          <Counter
            value={totalServicesSignposted}
            className="text-2xl font-bold text-brandPink"
            decimals={0}
          />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-700 text-white text-sm rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
            Total number of individual resources/services signposted.
          </div>
        </div>
      </div>

      {/* Referrals Received by Hub (Pie Chart) */}
      <div className="bg-white p-6 shadow-md rounded-xl border mb-4">
        <h2 className="text-xl font-semibold text-brandPink mb-4">
          Referrals Received by Hub
        </h2>
        <ResponsiveContainer width="100%" height={380}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={130}
              labelLine
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(1)}%)`
              }
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

      </div>
      <div className="bg-white p-6 shadow-md rounded-xl border mb-4">
      <DropOffAnalysis records={records} />
      </div>
      <div className="bg-white p-6 shadow-md rounded-xl border mb-4">
      <EscalationsByHub records={records} />
      </div>
    </DashboardSectionWrapper>
  );
};

export default ReferralSummary;
