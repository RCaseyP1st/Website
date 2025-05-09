import React from "react";
import DashboardSectionWrapper from "./DashboardSectionWrapper";
import GenderBreakdown from "./GenderBreakdown";
import EthnicityBreakdown from "./EthnicityBreakdown";

const UserDemo = ({ records }) => {
  return (
    <DashboardSectionWrapper>
      <div className="w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Demographics</h1>
      </div>
      <div className="flex flex-wrap justify-center bg-white p-6 shadow-md rounded-xl border mb-4">
        <GenderBreakdown records={records} />
        <EthnicityBreakdown records={records} />
      </div>
    </DashboardSectionWrapper>
  );
};

export default UserDemo;
