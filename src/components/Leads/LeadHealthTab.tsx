import { PieChart, Pie, Cell } from "recharts";
import { useState } from "react";
import { Button, Text } from "@mantine/core";

export default function LeadHealthTab({
}: {
  data?: { statusCounts?: Record<string, number>; total?: number };
}) {
  const [isSimulated, setIsSimulated] = useState(false);
//   const statusCounts = data?.statusCounts ?? {};
  // const total = data?.total ?? 0;

//   const getPercent = (count: number) => (total > 0 ? ((count / total) * 100).toFixed(1) : "0.0");

  const initialStatus = [
    { label: "Available To Call", count: 10, percent: 100, color: "#6D57FC" },
    { label: "Terminal Call Disposition", count: 0, percent: 0, color: "#ef4444" },
    { label: "Actively Being Worked", count: 0, percent: 0, color: "#f59e0b" },
    { label: "Meeting", count: 0, percent: 0, color: "#10b981" },
  ];

  const simulatedStatus = [
    { label: "Available To Call", count: 2, percent: 20, color: "#6D57FC" },
    { label: "Terminal Call Disposition", count: 3, percent: 30, color: "#ef4444" },
    { label: "Actively Being Worked", count: 3, percent: 30, color: "#f59e0b" },
    { label: "Meeting", count: 2, percent: 20, color: "#10b981" },
  ];

  const initialCallBuckets = [
    { label: "Called Zero Times", count: 10, percent: 100, color: "#d1d5db" },
    { label: "Called One To Three Times", count: 0, percent: 0, color: "#9ca3af" },
    { label: "Called Four To Six Times", count: 0, percent: 0, color: "#6b7280" },
    { label: "Called Seven To Ten Times", count: 0, percent: 0, color: "#4b5563" },
    { label: "Called More Than Ten Times", count: 0, percent: 0, color: "#1f2937" },
  ];

  const simulatedCallBuckets = [
    { label: "Called Zero Times", count: 2, percent: 20, color: "#d1d5db" },
    { label: "Called One To Three Times", count: 4, percent: 40, color: "#9ca3af" },
    { label: "Called Four To Six Times", count: 3, percent: 30, color: "#6b7280" },
    { label: "Called Seven To Ten Times", count: 1, percent: 10, color: "#4b5563" },
    { label: "Called More Than Ten Times", count: 0, percent: 0, color: "#1f2937" },
  ];

  const accountStatus = isSimulated ? simulatedStatus : initialStatus;
  const callBuckets = isSimulated ? simulatedCallBuckets : initialCallBuckets;

  return (
    <div>
      <div className="flex justify-between items-center">
        <Button
          size="xs"
          variant="light"
          onClick={() => setIsSimulated(!isSimulated)}
          className="mb-4"
        >
          {isSimulated ? "Reset Simulation" : "Simulate 10 Days Activity"}
        </Button>
        <a href="#" className="text-primary font-semibold hover:underline text-sm">
          How to read lead & ingestion data
        </a>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div
          className="bg-white p-5 rounded-lg basis-[240px] flex-shrink-0 "
          style={{
            border: "1px solid #E8E4FF",
            borderRadius: "0.5rem",
          }}
        >
          <Text className="text-lg font-semibold mb-4">Account Status</Text>
          <div className="space-y-4">
            {accountStatus.map((status) => (
              <div key={status.label} className="flex items-center">
                <div className="w-1 h-12 mr-3" style={{ backgroundColor: status.color }}></div>
                <div className={`flex-1`}>
                  <div className="font-medium text-sm" style={{ color: status.color }}>
                    {status.label}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {status.count} ({status.percent}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="basis-[300px] flex-shrink-0 bg-white p-6 rounded-lg border flex items-center justify-center lg:col-span-1">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">Total 10</div>
            <div className="relative w-48 h-48 mx-auto">
              <PieChart width={200} height={192}>
                <Pie
                  data={accountStatus}
                  cx={96}
                  cy={96}
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="count"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill={accountStatus[index].color}
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        className="text-xs font-medium"
                      >
                        {value}
                      </text>
                    );
                  }}
                >
                  {accountStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xl font-semibold">10</div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-white p-6 rounded-lg basis-[500px] flex-shrink-0"
          style={{
            border: "1px solid #E8E4FF",
            borderRadius: "0.5rem",
          }}
        >
          <h3 className="text-lg font-semibold mb-4">Number of calls made</h3>
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
                  labelLine={false}
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
                        {value}%
                      </text>
                    );
                  }}
                >
                  {callBuckets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
