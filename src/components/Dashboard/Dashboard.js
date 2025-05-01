import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import WellbeingReviews from "./WellbeingReviews";
import UserDemo from "./UserDemo";
import ReferralAnalytics from "./ReferralAnalytics";
import ActivityByArea from "./ActivityByArea";
import { SECTION_TAILWIND_CLASSES } from "./chartColors";

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [monthlySubmissionData, setMonthlySubmissionData] = useState([]);
  const [avgTurnaround, setAvgTurnaround] = useState("–");
  const [activeSection, setActiveSection] = useState("All Data");

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
            params: {
              pageSize: 100,
            },
          }
        );

        const fetchedRecords = response.data.records;
        setRecords(fetchedRecords);

        const countMap = {};
        fetchedRecords.forEach((record) => {
          const tags = record.fields["Resources/Services Signposted"] || [];
          tags.forEach((tag) => {
            countMap[tag] = (countMap[tag] || 0) + 1;
          });
        });

        const sorted = Object.entries(countMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 7)
          .map(([name, count]) => ({ name, count }));

        setChartData(sorted);

        const parseDate = (input) => {
          return input ? new Date(input) : null;
        };

        const monthlyMap = {};
        const turnaroundList = [];

        fetchedRecords.forEach((rec) => {
          const raw = rec.fields["Submission Timestamp (raw)"];
          const submitted = parseDate(raw);
          if (!submitted) return;

          const label = submitted.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });

          monthlyMap[label] = (monthlyMap[label] || 0) + 1;

          const completedRaw = rec.fields["Date Completed"];
          const completed = parseDate(completedRaw);
          if (completed && completed > submitted) {
            const days = (completed - submitted) / (1000 * 60 * 60 * 24);
            turnaroundList.push(days);
          }
        });

        const sortedMonthly = Object.entries(monthlyMap)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([month, count]) => ({ month, count }));

        setMonthlySubmissionData(sortedMonthly);

        const avg = turnaroundList.length
          ? (
              turnaroundList.reduce((a, b) => a + b, 0) / turnaroundList.length
            ).toFixed(1)
          : "–";

        setAvgTurnaround(avg);
      } catch (err) {
        console.error("Error fetching Airtable data:", err);
      }
    };

    fetchRecords();
  }, []);

  const sectionColors = ["teal", "blue", "pink", "green", "purple"];

  const sectionList = [
    "All Data",
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
        const { bg, text, hoverBg, hoverText } = SECTION_TAILWIND_CLASSES[section] || {};
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
  

  const renderMain = () => (
    <div className="ml-64 p-6">
      {activeSection === "Wellbeing Reviews" && (
        <WellbeingReviews
          records={records}
          avgTurnaround={avgTurnaround}
          chartData={chartData}
          monthlySubmissionData={monthlySubmissionData}
        />
      )}
      {activeSection === "User Demographics" && <UserDemo records={records} />}

      {activeSection === "Referral Analytics" && (
  <ReferralAnalytics records={records} isMinimal={true} />
)}



      {activeSection === "Activity by Area" && (
        <ActivityByArea records={records} isMinimal={true} />
      )}

      {activeSection === "All Data" && (
        <div className="space-y-12">
          <WellbeingReviews
            records={records}
            avgTurnaround={avgTurnaround}
            chartData={chartData}
            monthlySubmissionData={monthlySubmissionData}
          />
          <UserDemo records={records} isMinimal={true} />
          <ReferralAnalytics records={records} />

          <ActivityByArea records={records} isMinimal={true} />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex">
      {renderSidebar()}
      {renderMain()}
    </div>
  );
};

export default Dashboard;
