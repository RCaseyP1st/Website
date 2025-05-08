// Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import WellbeingReviews from "./WellbeingReviews";
import UserDemo from "./UserDemo";
import ReferralAnalytics from "./ReferralAnalytics";
import ActivityByArea from "./ActivityByArea";
import { SECTION_TAILWIND_CLASSES } from "./chartColors";
import DashboardLayout from "./DashboardLayout";
import ReferralSummary from "./ReferralSummary";

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [monthlySubmissionData, setMonthlySubmissionData] = useState([]);
  const [avgTurnaround, setAvgTurnaround] = useState("–");
  const [activeSection, setActiveSection] = useState("All Data");
  const [selectedHub, setSelectedHub] = useState("Essex-wide");

  const filterByHub = (records, hub) => {
    if (hub === "Essex-wide") return records;
    return records.filter((rec) => rec.fields["Local EPUT Hub"] === hub);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          `https://api.airtable.com/v0/${
            process.env.REACT_APP_AIRTABLE_BASE_ID
          }/${encodeURIComponent(process.env.REACT_APP_AIRTABLE_TABLE)}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
            },
            params: { pageSize: 100 },
          }
        );

        const fetched = response.data.records;
        console.log("🔎 Airtable Records:", fetched);
        setRecords(fetched);

        const parseDate = (input) => (input ? new Date(input) : null);
        const monthlyMap = {};
        const turnaroundList = [];

        fetched.forEach((rec) => {
          const submitted = parseDate(rec.fields["Submission Timestamp (raw)"]);
          if (!submitted) return;
          const label = submitted.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          monthlyMap[label] = (monthlyMap[label] || 0) + 1;

          const completed = parseDate(rec.fields["Date Completed"]);
          if (completed && completed > submitted) {
            const days = (completed - submitted) / (1000 * 60 * 60 * 24);
            turnaroundList.push(days);
          }
        });

        const monthlySorted = Object.entries(monthlyMap)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([month, count]) => ({ month, count }));
        setMonthlySubmissionData(monthlySorted);

        const avg =
          turnaroundList.length > 0
            ? (
                turnaroundList.reduce((a, b) => a + b, 0) /
                turnaroundList.length
              ).toFixed(1)
            : "–";
        setAvgTurnaround(avg);
      } catch (err) {
        console.error("Airtable error:", err);
      }
    };

    fetchRecords();
  }, []);

  const sectionList = [
    "All Data",
    "Referral Summary", 
    "Wellbeing Reviews",
    "User Demographics",
    "Referral Analytics",
    "Activity by Area",
  ];

  const renderSidebar = () => (
    <div className="w-64 min-h-screen fixed top-0 left-0 bg-white border-r pt-6 px-4">
      <div className="flex items-center mb-6 gap-3">
        <img
          src={`${process.env.PUBLIC_URL}/images/P1Logos/P1Symbol25.png`}
          alt="Logo Symbol"
          className="h-8 w-8"
        />
        <h2 className="text-xl font-bold text-gray-700">Dashboard</h2>
      </div>
      {sectionList.map((section) => {
        const { bg, text, hoverBg, hoverText } =
          SECTION_TAILWIND_CLASSES[section] || {};
        const isActive = activeSection === section;
        return (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`block w-full text-left px-3 py-2 mb-1 rounded-md text-sm font-medium transition ${
              isActive
                ? `${bg} ${text}`
                : `text-gray-700 ${hoverBg} ${hoverText}`
            }`}
          >
            {section}
          </button>
        );
      })}
    </div>
  );

  const renderSection = () => {
    const filtered = filterByHub(records, selectedHub);

    switch (activeSection) {
      case "All Data":
        return (
          <>
            <WellbeingReviews
              records={filtered}
              avgTurnaround={avgTurnaround}
              monthlySubmissionData={monthlySubmissionData}
            />
            <UserDemo records={filtered} />
            <ReferralAnalytics records={filtered} />
            <ActivityByArea records={filtered} />
          </>
        );
        case "Referral Summary":
          return <ReferralSummary records={filtered} allRecords={records} />;
        

      case "Wellbeing Reviews":
        return (
          <WellbeingReviews
            records={filtered}
            avgTurnaround={avgTurnaround}
            monthlySubmissionData={monthlySubmissionData}
          />
        );
      case "User Demographics":
        return <UserDemo records={filtered} />;
      case "Referral Analytics":
        return <ReferralAnalytics records={filtered} />;
      case "Activity by Area":
        return <ActivityByArea records={filtered} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      {renderSidebar()}
      <DashboardLayout
        selectedHub={selectedHub}
        setSelectedHub={setSelectedHub}
      >
        {renderSection()}
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
