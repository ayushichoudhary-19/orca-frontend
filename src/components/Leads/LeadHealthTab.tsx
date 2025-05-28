"use client";

import { PieChart, Pie, Cell } from "recharts";
import { Text, Button } from "@mantine/core";
import { useState } from "react";

const COLORS = {
  available: "#6D57FC",
  terminal: "#ef4444",
  active: "#f59e0b",
  meeting: "#10b981",
};

const CALL_BUCKET_COLORS = [
  "#d1d5db", // 0
  "#9ca3af", // 1–3
  "#6b7280", // 4–6
  "#4b5563", // 7–10
  "#1f2937", // >10
];

export default function LeadHealthTab({
  data,
}: {
  data?: {
    statusCounts: Record<string, number>;
    total: number;
  };
}) {
  const [isSimulated, setIsSimulated] = useState(false);

  const total = data?.total || 0;
  const counts = data?.statusCounts || {};

  const availableCount = counts["untouched"] || 0;
  const disqualifiedCount = counts["disqualified"] || 0;
  const calledCount = counts["called"] || 0;
  const meetingCount = counts["meeting"] || 0;
  const activeCount = Math.max(calledCount - disqualifiedCount - meetingCount, 0);

  const pieData = [
    { label: "Available To Call", count: availableCount, color: COLORS.available },
    { label: "Terminal Call Disposition", count: disqualifiedCount, color: COLORS.terminal },
    { label: "Actively Being Worked", count: activeCount, color: COLORS.active },
    { label: "Meeting", count: meetingCount, color: COLORS.meeting },
  ];

  const simulatedCallBuckets = [
    { label: "Called Zero Times", count: 2, percent: 20, color: CALL_BUCKET_COLORS[0] },
    { label: "Called One To Three Times", count: 4, percent: 40, color: CALL_BUCKET_COLORS[1] },
    { label: "Called Four To Six Times", count: 3, percent: 30, color: CALL_BUCKET_COLORS[2] },
    { label: "Called Seven To Ten Times", count: 1, percent: 10, color: CALL_BUCKET_COLORS[3] },
    { label: "Called More Than Ten Times", count: 0, percent: 0, color: CALL_BUCKET_COLORS[4] },
  ];

  const defaultCallBuckets = [
    { label: "Called Zero Times", count: total, percent: 100, color: CALL_BUCKET_COLORS[0] },
    { label: "Called One To Three Times", count: 0, percent: 0, color: CALL_BUCKET_COLORS[1] },
    { label: "Called Four To Six Times", count: 0, percent: 0, color: CALL_BUCKET_COLORS[2] },
    { label: "Called Seven To Ten Times", count: 0, percent: 0, color: CALL_BUCKET_COLORS[3] },
    { label: "Called More Than Ten Times", count: 0, percent: 0, color: CALL_BUCKET_COLORS[4] },
  ];

  const callBuckets = isSimulated ? simulatedCallBuckets : defaultCallBuckets;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button size="xs" variant="light" onClick={() => setIsSimulated(!isSimulated)}>
          {isSimulated ? "Reset Simulation" : "Simulate 10 Days Activity"}
        </Button>
        <a href="#" className="text-primary font-semibold hover:underline text-sm">
          How to read lead & ingestion data
        </a>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
      <div className="bg-white p-5 rounded-lg flex-grow">
          <Text className="text-lg font-semibold mb-4">Account Status</Text>
          <div className="space-y-3">
            {pieData.map((status) => (
              <div key={status.label} className="flex items-center gap-3">
                <div className="w-2 h-6" style={{ backgroundColor: status.color }}></div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm" style={{ color: status.color }}>
                    {status.label}
                  </span>
                  <span className="text-gray-500 text-sm">{status.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="basis-[300px] flex-shrink-0 bg-white p-6 rounded-lg border flex items-center justify-center">
          <div className="text-center">
            <Text className="text-2xl font-bold mb-2">Total {total}</Text>
            <PieChart width={220} height={200}>
              <Pie
                data={pieData}
                cx={100}
                cy={100}
                innerRadius={60}
                outerRadius={80}
                dataKey="count"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill={pieData[index].color}
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      className="text-xs font-medium"
                    >
                      {value}
                    </text>
                  );
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-status-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>
        <div
          className="bg-white p-6 rounded-lg basis-[500px] flex-shrink-0"
          style={{ border: "1px solid #E8E4FF", borderRadius: "0.5rem" }}
        >
          <h3 className="text-lg font-semibold mb-4">Number of Calls Made</h3>
          <div className="flex gap-8">
            <div className="relative w-48 h-48">
              <PieChart width={220} height={200}>
                <Pie
                  data={callBuckets}
                  cx={96}
                  cy={96}
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="count"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill={callBuckets[index].color}
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        className="text-xs font-medium"
                      >
                        {value}
                      </text>
                    );
                  }}
                >
                  {callBuckets.map((entry, index) => (
                    <Cell key={`cell-call-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="mt-4 space-y-2 ml-4">
              {callBuckets.map((bucket) => (
                <div key={bucket.label} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: bucket.color }}
                  ></div>
                  <div className="text-sm text-gray-600">{bucket.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
