import React from "react";
import MonthlyCompletionTrend from "./MonthlyCompletionTrend";
import MonthlyReferralsVolume from "./MonthlyReferralsVolume";
import chartColors from "./chartColors";

const ReferralAnalytics = ({ records, isMinimal = false }) => {
  const referralCount = records.reduce((acc, rec) => {
    const tags = rec.fields["Resources/Services Signposted"] || [];
    tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const sorted = Object.entries(referralCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className={`${isMinimal ? " p-6" : ""} w-full`}>
      <div className="max-w-screen-xl mx-auto flex flex-col space-y-12">
        <h1 className="text-3xl font-bold text-gray-800">Referral Analytics</h1>

        <div>
          <h2 className="text-xl font-semibold text-brandPink mb-4">Top 10 Referred Services</h2>
          <ul className="list-disc list-inside text-gray-700 mb-8">
            {sorted.map(([service, count]) => (
              <li key={service}>{service}: {count}</li>
            ))}
          </ul>
        </div>

        <MonthlyCompletionTrend records={records} />
        <MonthlyReferralsVolume records={records} />
      </div>
    </div>
  );
};

export default ReferralAnalytics;
