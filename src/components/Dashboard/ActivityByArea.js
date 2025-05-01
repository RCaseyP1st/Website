import React from "react";

const ActivityByArea = ({ records }) => {
  const areaField = "Locality"; // Adjust if your field name differs

  const areaCounts = records.reduce((acc, rec) => {
    const area = rec.fields[areaField] || "Unspecified";
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(areaCounts)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Activity by Area</h1>
      <h2 className="text-xl font-semibold text-brandGreen mb-4">Reviews by Location</h2>
      <ul className="list-disc list-inside text-gray-700">
        {sorted.map(([area, count]) => (
          <li key={area}>{area}: {count}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityByArea;