import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import chartColors from "./chartColors";
import Counter from "../UI/Counter";

const WellbeingReviews = ({
  records,
  avgTurnaround,
  chartData,
  monthlySubmissionData,
}) => {
  const totalEntries = records.length;
  const completedReviews = records.filter(
    (r) => r.fields["Wellbeing Review Completed?"]
  ).length;
  const requestToReview = totalEntries
    ? Math.round((completedReviews / totalEntries) * 100)
    : 0;
  const totalReferrals = records.reduce(
    (acc, rec) =>
      acc + (rec.fields["Resources/Services Signposted"] || []).length,
    0
  );
  const avgReferrals = totalEntries ? totalReferrals / totalEntries : 0;
  const activeRecords = records.filter(
    (r) => !r.fields["Date Completed"]
  ).length;
  const turnaround = avgTurnaround !== "–" ? parseFloat(avgTurnaround) : "–";

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Wellbeing Reviews
      </h1>

      {/* Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {/* Total Entries */}
        <div className="bg-white shadow-md rounded-xl p-4 text-center border relative group">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Total Entries
          </h3>
          <Counter
            value={totalEntries}
            className="text-2xl font-bold text-brandBlue"
            decimals={0}
          />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-gray-700 text-white text-sm rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
            Number of total records submitted via the form.
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
            Reviews where “Wellbeing Review Completed?” was checked ✅.
          </div>
        </div>

        {/* Request-to-Review % */}
        <div className="bg-white shadow-md rounded-xl p-4 text-center border relative group">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Request-to-Review %
          </h3>
          <Counter
            value={requestToReview}
            className="text-2xl font-bold text-brandPink"
            decimals={0}
          />
          %
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-60 bg-gray-700 text-white text-sm rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
            % of Wellbeing Review Requests that result in a wellbeing review.
          </div>
        </div>
      </div>

      {/* Extra Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 mt-12">
        {/* Average Referrals */}
        <div className="bg-white shadow-md rounded-xl p-4 text-center border relative group">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Average Referrals per Review
          </h3>
          <Counter
            value={avgReferrals}
            className="text-xl font-bold text-brandBlue"
            decimals={1}
          />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-700 text-white text-sm rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
            The average number of services signposted in each review.
          </div>
        </div>

        {/* Avg Turnaround */}
        <div className="bg-white shadow-md rounded-xl p-4 text-center border relative group">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Avg. Turnaround (days)
          </h3>
          {turnaround !== "–" ? (
            <Counter
              value={turnaround}
              className="text-xl font-bold text-brandPink"
              decimals={1}
            />
          ) : (
            <p className="text-xl font-bold text-brandPink">–</p>
          )}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-700 text-white text-sm rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
            Average number of days between request and completion.
          </div>
        </div>

        {/* Active Records */}
        <div className="bg-white shadow-md rounded-xl p-4 text-center border relative group">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Current Active Records
          </h3>
          <Counter
            value={activeRecords}
            className="text-xl font-bold text-yellow-600"
            decimals={0}
          />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-700 text-white text-sm rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
            Number of entries without a completed date — these reviews are still
            active.
          </div>
        </div>
      </div>

      {/* Monthly Submissions */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-brandBlue mb-4">
          Monthly Review Submissions
        </h2>
        {monthlySubmissionData.length === 0 ? (
          <p className="text-gray-500">No monthly data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySubmissionData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count">
                {monthlySubmissionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Signposted Resources */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-brandGreen mb-4">
          Top Signposted Resources
        </h2>
        {chartData.length === 0 ? (
          <p className="text-gray-500">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={180} />
              <Tooltip />
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
      </div>
    </div>
  );
};

export default WellbeingReviews;
