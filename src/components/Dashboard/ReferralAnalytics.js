import React from "react";
import MonthlyCompletionTrend from "./MonthlyCompletionTrend";
import MonthlyReferralsVolume from "./MonthlyReferralsVolume";
import DashboardSectionWrapper from "./DashboardSectionWrapper";
import MonthlyAvgReferrals from "./MonthlyAvgReferrals";
import MonthlyTurnaroundTrend from "./MonthlyTurnaroundTrend";
import TopResourcesAllTime from "./TopResourcesAllTime";
import Top5ServicesByMonth from "./Top5ServicesByMonth";
import DropOffAnalysis from "./DropOffAnalysis";


const ReferralAnalytics = ({ records }) => {
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
    <DashboardSectionWrapper>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Referral Analytics
        </h1>

      {/* List of Top Referrals */}
      <div className="bg-white p-6 shadow-md rounded-xl border mb-4">
        <h2 className="text-xl font-semibold text-brandPink mb-4">
          Top 10 Referred Services
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-8">
          {sorted.map(([service, count]) => (
            <li key={service}>
              {service}: {count}
            </li>
          ))}
        </ul>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 shadow-md rounded-xl border mb-4">
      <MonthlyCompletionTrend records={records} />
      </div>
      <div className="bg-white p-6 shadow-md rounded-xl border mb-4">
      <MonthlyReferralsVolume records={records} />
      </div>
      <div className="bg-white p-6 shadow-md rounded-xl border mb-4">
      <MonthlyAvgReferrals records={records} />
      </div>
      <div className="bg-white p-6 shadow-md rounded-xl border mb-4">
      <MonthlyTurnaroundTrend records={records} />
      </div>
      <div className="bg-white p-6 shadow-md rounded-xl border mb-4">
      <Top5ServicesByMonth records={records} />
      </div>      
      <div className="bg-white p-6 shadow-md rounded-xl border mb-4">
      <TopResourcesAllTime records={records} />
      </div>
      

    </DashboardSectionWrapper>
  );
};

export default ReferralAnalytics;
