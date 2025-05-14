"use client";

import { Table, Button, Drawer, Text, Avatar, Badge, Paper } from "@mantine/core";
import { useState } from "react";

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

export default function PendingRepsTable({ reps }: { reps: Rep[] }) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedRep, setSelectedRep] = useState<Rep | null>(null);

  const handleViewAttempts = (rep: Rep) => {
    setSelectedRep(rep);
    setDrawerOpened(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "retrying":
        return "gray";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "blue";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <>
      <Paper radius="md" p="xl" className="bg-white">
        <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
          <thead
            style={{
              borderBottom: "1px solid #E7E7E9",
            }}
          >
            <tr>
              <th className="text-left text-tinteddark8 font-[500] text-[12px]">Caller</th>
              <th className="text-left text-tinteddark8 font-[500] text-[12px]">Status</th>
              <th className="text-left text-tinteddark8 font-[500] text-[12px]">
                Audition Attempts
              </th>
              <th className="text-left text-tinteddark8 font-[500] text-[12px]">Last Attempt</th>
              <th className="text-left text-tinteddark8 font-[500] text-[12px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {reps.map((rep) => (
              <tr key={rep._id} className="align-middle mt-5">
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar radius="xl" size="sm" color="blue">
                      {rep.salesRepId.fullName.charAt(0)}
                    </Avatar>
                    <span className="font-medium">{rep.salesRepId.fullName}</span>
                  </div>
                </td>
                <td>
                  <Badge color={getStatusBadgeColor(rep.auditionStatus)} variant="light">
                    {formatStatus(rep.auditionStatus)}
                  </Badge>
                </td>
                <td>{rep.auditionAttempts}</td>
                <td>{new Date(rep.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="light"
                    size="sm"
                    color="indigo"
                    onClick={() => handleViewAttempts(rep)}
                  >
                    View last audition
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        position="right"
        size="lg"
        title={
          <Text size="xl" fw={700}>
            Sales Rep Details
          </Text>
        }
      >
        {selectedRep && (
          <div className="space-y-6">
            <div>
              <Text size="lg" fw={600} className="mb-2">
                Personal Information
              </Text>
              <div className="space-y-2">
                <Text>
                  <strong>Name:</strong> {selectedRep.salesRepId.fullName}
                </Text>
                <Text>
                  <strong>Email:</strong> {selectedRep.salesRepId.email}
                </Text>
                <Text>
                  <strong>Phone:</strong> {selectedRep.salesRepId.phone}
                </Text>
                <Text>
                  <strong>Bio:</strong> {selectedRep.salesRepId.bio}
                </Text>
              </div>
            </div>

            <div>
              <Text size="lg" fw={600} className="mb-2">
                Audition Status
              </Text>
              <div className="space-y-2">
                <Text>
                  <strong>Current Status:</strong> {formatStatus(selectedRep.auditionStatus)}
                </Text>
                <Text>
                  <strong>Total Attempts:</strong> {selectedRep.auditionAttempts}
                </Text>
                <Text>
                  <strong>Training Progress:</strong> {selectedRep.trainingProgress}%
                </Text>
                <Text>
                  <strong>Joined:</strong> {new Date(selectedRep.createdAt).toLocaleString()}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
