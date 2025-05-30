"use client";
import { useEffect, useState } from "react";
import CalendlyLinkInput from "@/components/Meetings/CalendlyLinkInput";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { axiosClient } from "@/lib/axiosClient";
import { Button, Table, TextInput, Avatar, Divider } from "@mantine/core";
import { IconFilter, IconFileExport } from "@tabler/icons-react";
import Image from "next/image";

interface Meeting {
  id: string;
  time: string;
  status: string;
  prospect: string;
  account: string;
  prospectTitle?: string;
  company?: string;
  caller: string;
  callerAvatar?: string;
  accountExecutive: string;
}

const AdminDashboard = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [calendlyLinkSet, setCalendlyLinkSet] = useState(false);
  const [activeTab, setActiveTab] = useState("action");
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(8);

  const dummyMeetings: Meeting[] = [
    {
      id: "1",
      time: "2025-03-24T10:00:00",
      status: "Scheduled",
      prospect: "Jason Fernandez",
      prospectTitle: "Director of Finance",
      company: "New Creation Inc",
      account: "New Creation Inc",
      caller: "Martin Lewis",
      callerAvatar: "/placeholder.svg?height=40&width=40",
      accountExecutive: "James Geoffrey",
    },
  ];

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axiosClient.get(`/api/campaign/${campaignId}/meetings`);
        if (response.data && response.data.length > 0) {
          const meetingsData = Array.isArray(response.data)
            ? response.data
            : response.data.meetings || [];
          const mappedMeetings = (meetingsData as any[]).map((meeting: any) => ({
            id: meeting._id,
            time: meeting.time,
            status: meeting.status,
            prospect: meeting.fullName,
            account: "",
            email: meeting.email,
            caller: "",
            accountExecutive: "",
          }));

          setMeetings(mappedMeetings);
        } else {
          setMeetings(activeTab === "action" ? [] : dummyMeetings);
        }
        setTotalEntries(8);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setMeetings(activeTab === "action" ? [] : dummyMeetings);
      }
    };

    fetchMeetings();
  }, [campaignId, activeTab]);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await axiosClient.get(`/api/campaign/${campaignId}`);
        if (response.data.calendlyLink) {
          setCalendlyLinkSet(true);
        }
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;

    return (
      <div className="flex flex-col">
        <span className="text-sm font-medium">{`${month} ${day}, ${year}`}</span>
        <span className="text-sm text-gray-600">{`${formattedHours}:${minutes} ${ampm}`}</span>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-centre">
      {!calendlyLinkSet ? (
        <CalendlyLinkInput />
      ) : (
        <>
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Meetings</h1>
              <div className="flex gap-4">
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

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "action" ? "filled" : "outline"}
                  color={activeTab === "action" ? "primary" : "gray"}
                  onClick={() => handleTabChange("action")}
                  className={`px-4 h-[50px] font-normal text-md py-2 ${activeTab === "action" ? "bg-primary text-white" : "text-[#555461] border-[#E7E7E9]"}`}
                  radius="md"
                >
                  Action Required
                </Button>
                <Button
                  variant={activeTab === "upcoming" ? "filled" : "outline"}
                  color={activeTab === "upcoming" ? "violet" : "gray"}
                  onClick={() => handleTabChange("upcoming")}
                  className={`px-4 py-2 h-[50px] font-normal text-md ${activeTab === "upcoming" ? "bg-primary text-white" : "text-[#555461] border-[#E7E7E9]"}`}
                  radius="md"
                >
                  Upcoming Meetings
                </Button>
                <Button
                  variant={activeTab === "past" ? "filled" : "outline"}
                  color={activeTab === "past" ? "violet" : "gray"}
                  onClick={() => handleTabChange("past")}
                  className={`px-4 py-2 h-[50px] font-normal text-md ${activeTab === "past" ? "bg-[#6D57FC] text-white" : "text-[#555461] border-[#E7E7E9]"}`}
                  radius="md"
                >
                  Past Meetings
                </Button>
              </div>

              <Button
                className="px-4 py-2 font-normal text-md h-[50px]"
                radius="md"
                size="md"
                leftSection={<IconFileExport size={16} />}
              >
                Export all meetings to CSV
              </Button>
            </div>
          </div>

          <div className="flex flex-col flex-grow px-6">
            <div className="flex-grow overflow-auto">
              <Table className="w-full" verticalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="text-gray-600 font-medium">Time</Table.Th>
                    <Table.Th className="text-gray-600 font-medium">Status</Table.Th>
                    <Table.Th className="text-gray-600 font-medium">Prospect / Account</Table.Th>
                    <Table.Th className="text-gray-600 font-medium">Caller</Table.Th>
                    <Table.Th className="text-gray-600 font-medium">Account Executive</Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {meetings.length === 0 && activeTab === "action" ? (
                    <Table.Tr>
                      <Table.Td colSpan={5} className="py-16">
                        <div className="flex flex-col items-center justify-center text-center">
                          <h3 className="text-xl font-medium mb-2">
                            Nice! You have completed all your action required tasks
                          </h3>
                          <p className="text-gray-500 mb-6">
                            You can find your upcoming and past meetings in the two other tabs
                            above.
                          </p>
                          <Button variant="filled" size="md" className="font-normal radius-lg">
                            Have helpful tips for callers? Share them on your campaign sales floor
                          </Button>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    meetings.map((meeting, idx) => (
                      <Table.Tr key={meeting.id || idx} className="hover:bg-[#F2F0FF]">
                        <Table.Td>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-violet-600 rounded-full mr-2"></div>
                            {formatDate(meeting.time)}
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <span
                            className="px-4 py-1 bg-[#9DE1BE] text-black rounded-lg text-sm font-semibold"
                            style={{
                              border: "1px solid #65C995",
                            }}
                          >
                            {meeting.status || "Scheduled"}
                          </span>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {meeting.prospect || "Jason Fernandez"}
                            </span>
                            {/* <span className="text-sm text-gray-600">
                          {meeting.prospectTitle || "Director of Finance"}
                        </span>
                        <span className="text-sm text-gray-600">
                          {meeting.company || "New Creation Inc"}
                        </span> */}
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex items-center">
                            <Avatar
                              src={meeting.callerAvatar || "/placeholder.svg?height=40&width=40"}
                              radius="xl"
                              size="sm"
                              className="mr-2"
                            />
                            <span>{meeting.caller || "Ayushi SDR"}</span>
                          </div>
                        </Table.Td>
                        <Table.Td>{meeting.accountExecutive || "Admin"}</Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </div>

            {meetings.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t mt-auto py-4">
                <Divider mb={15} />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-tinteddark4">
                    Showing 1 to {meetings.length} of {totalEntries} entries
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="subtle"
                      color="#9E9DA4"
                      // disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="px-4 py-2 font-normal text-md rounded-md"
                    >
                      Previous
                    </Button>
                    <Button variant="filled" className="px-4 py-2 h-[36px]">
                      1
                    </Button>
                    <Button variant="outline" color="gray" className="px-4 py-2 h-[36px]">
                      2
                    </Button>
                    <Button
                      variant="subtle"
                      color="#9E9DA4"
                      className="px-4 py-2 font-normal text-md rounded-md"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      // disabled={currentPage * meetings.length >= totalEntries}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
