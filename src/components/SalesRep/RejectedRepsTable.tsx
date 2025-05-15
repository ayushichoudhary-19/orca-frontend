"use client";

import { Table, Button, Badge, Paper } from "@mantine/core";
import { useState } from "react";
import AuditionReviewDrawer from "./AuditionDrawer";
import { IconArrowRight } from "@tabler/icons-react";

interface SalesRep {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

interface Rep {
  _id: string;
  campaignId: string;
  salesRepId: SalesRep;
  trainingProgress: number;
  auditionStatus: string;
  auditionAttempts: number;
  createdAt: string;
}

export default function RejectedRepsTable({ reps: initialReps }: { reps: Rep[] }) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedRep, setSelectedRep] = useState<Rep | null>(null);
  const [reps, setReps] = useState(initialReps);

  const handleViewAttempts = (rep: Rep) => {
    setSelectedRep(rep);
    setDrawerOpened(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "retrying":
      case "retry":
        return "gray";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "yellow";
    }
  };

  const formatStatus = (status: string) => {
    if (status.toLowerCase() === "retry") {
      return "Retrying";
    }
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <>
      <Paper radius="md" p="xl" className="bg-white">
        <Table highlightOnHover verticalSpacing="md" horizontalSpacing="xl">
          <thead>
            <tr 
            style={{
              borderBottom: "1px solid #E7E7E9",
              paddingBottom: "16px"
            }}
            >
              <th className="text-left text-tinteddark8 font-[500] text-[12px] py-4">Caller</th>
              <th className="text-left text-tinteddark8 font-[500] text-[12px] py-4">Status</th>
              <th className="text-left text-tinteddark8 font-[500] text-[12px] py-4">Attempts</th>
              <th className="text-left text-tinteddark8 font-[500] text-[12px] py-4">
                Last Attempt
              </th>
              <th className="text-left text-tinteddark8 font-[500] text-[12px] py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {reps.map((rep) => (
              <tr key={rep._id} className="last:border-0"
              style={
                {
                  borderBottom: "1px solid #E7E7E9",
                  paddingBottom: "16px"
                }
              }
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    {/* <Avatar radius="xl" size="md" color="#6D57FC"> */}
                      {/* {rep.salesRepId?.fullName?.charAt(0) || "?"}
                    </Avatar> */}
                    <span className="font-medium text-[14px]">
                      {rep.salesRepId?.fullName || "Unknown"}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <Badge
                    radius="md"
                    className="text-[12px] font-semibold text-black"
                    color={getStatusBadgeColor(rep.auditionStatus)}
                    variant="light"
                    size="lg"
                  >
                    {formatStatus(rep.auditionStatus)}
                  </Badge>
                </td>
                <td className="py-4 text-[14px]">{rep.auditionAttempts}</td>
                <td className="py-4 text-[14px]">{formatDate(rep.createdAt)}</td>
                <td className="py-4">
                  <Button
                    variant="light"
                    size="sm"
                    // color="gray"
                    className="text-[12px] font-semibold text-black"
                    onClick={() => handleViewAttempts(rep)}
                    rightSection={<IconArrowRight size={15} stroke={1.5} />}
                  >
                    View last audition
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>

      {selectedRep && (
        <AuditionReviewDrawer
          opened={drawerOpened}
          onClose={() => {
            setDrawerOpened(false);
            setSelectedRep(null);
          }}
          campaignId={selectedRep.campaignId}
          rep={selectedRep}
          onStatusChange={(status) => {
            setReps(
              reps.map((rep) =>
                rep._id === selectedRep._id ? { ...rep, auditionStatus: status } : rep
              )
            );
          }}
        />
      )}
    </>
  );
}
