"use client";

import { useState } from "react";
import { Button, TextInput, Text, Divider } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import LeadHealthTab from "./LeadHealthTab";
import LeadPerformanceTab from "./LeadPerformanceTab";
import LeadQualityTab from "./LeadQualityTab";
import IngestionTable from "./IngestionTable";
import Image from "next/image";
import CustomBadge from "./CustomBadge";
import { useRouter } from "next/navigation";

export default function LeadAnalyticsTabs({ data }: { data: any }) {
  const router = useRouter();
  const [active, setActive] = useState("health");
  const hasData = data?.ingestions?.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[32px] font-bold">Leads & Ingestions</h1>
        <div className="flex items-center gap-2">
          <CustomBadge label="Lead Health" value="30 days left" />
        </div>
      </div>

      <div className="mb-6 rounded-md border overflow-hidden bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex gap-2">
            <Button
              h={40}
              radius={8}
              variant={active === "health" ? "filled" : "light"}
              color={active === "health" ? "" : "gray"}
              onClick={() => setActive("health")}
              className={active === "health" ? "font-semibold" : "font-normal"}
            >
              Lead Health
            </Button>
            <Button
              h={40}
              radius={8}
              variant={active === "performance" ? "filled" : "light"}
              color={active === "performance" ? "" : "gray"}
              onClick={() => setActive("performance")}
              className={active === "performance" ? "font-medium" : "font-normal"}
            >
              Lead Performance
            </Button>
            <Button
              h={40}
              radius={8}
              variant={active === "quality" ? "filled" : "light"}
              color={active === "quality" ? "" : "gray"}
              onClick={() => setActive("quality")}
              className={active === "quality" ? "font-medium" : "font-normal"}
            >
              Lead Quality
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              color="gray"
              className="bg-white hover:bg-gray-50 font-normal"
              style={{
                border: "1px solid #E7E7E9",
                height: "40px",
                color: "#261E58",
                borderRadius: "8px",
              }}
              rightSection={
                <Image src="/icons/export.svg" alt="export icon" width={16} height={16} />
              }
            >
              Export
            </Button>
            <Button 
              className="font-normal h-[40px] text-[16px] rounded-[10px]"
              onClick={() => router.push("/leads/ingestions/upload-leads")}
            >
              Add new leads
            </Button>
          </div>
        </div>

        <Divider mx={8} c="#E7E7E9"/>

        <div className="p-4">
          {hasData ? (
            <>
              {active === "health" && <LeadHealthTab data={data.health} />}
              {active === "performance" && <LeadPerformanceTab data={data.performance} />}
              {active === "quality" && <LeadQualityTab />}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <Text className="text-md" fw={700}>
                You do not have any lead and ingestion data yet
              </Text>
              <p className="text-tinteddark6 mb-4 text-md">
                Track the health, quality and performance of your leads
              </p>
              <Button 
              size="md"
              h={46}
              className="px-6 py-3 rounded-lg font-normal">
                Learn how to read lead & ingestion data
              </Button>
            </div>
          )}
        </div>
      </div>

      {hasData && (
        <div className="mt-10 bg-white rounded-lg p-8 py-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Ingestions</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <TextInput
                  placeholder="Search"
                  rightSection={
                    <Image
                      src="/icons/search.svg"
                      alt="Search Icon"
                      width={16}
                      height={16}
                      className="text-gray-400"
                    />
                  }
                  className="w-64"
                  styles={{
                    input: {
                      borderRadius: "8px",
                      border: "1px solid #E7E7E9",
                      height: "40px",
                    },
                  }}
                />
              </div>
              <Button
                variant="outline"
                color="gray"
                className="flex items-center font-normal gap-2"
                styles={{
                  root: {
                    border: "1px solid #E7E7E9",
                    height: "40px",
                    borderRadius: "8px",
                  },
                }}
              >
                <span>Filter by</span>
                <IconFilter size={16} className="ml-2" stroke={1.5} />
              </Button>
            </div>
          </div>
          <IngestionTable ingestions={data.ingestions} />
        </div>
      )}
    </div>
  );
}
