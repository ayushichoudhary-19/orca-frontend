"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CalendlyLinkInput from "@/components/Meetings/CalendlyLinkInput";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { axiosClient } from "@/lib/axiosClient";
import { Button, Table, TextInput, Tabs, Avatar } from "@mantine/core";
import { IconSearch, IconFilter, IconFileExport } from "@tabler/icons-react";

// Define meeting type
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
    // More dummy meeting data...
  ];

  // Fetch meetings
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axiosClient.get(`/api/campaign/${campaignId}/meetings`);
        if (response.data && response.data.length > 0) {
          const mappedMeetings = response.data.map(meeting => ({
            id: meeting._id,
            time: meeting.time,
            status: meeting.status,
            prospect: meeting.fullName,
            account: "",
            email: meeting.email,
            caller: "",
            accountExecutive: ""
          }));
          setMeetings(mappedMeetings);
        } else {
          setMeetings(activeTab === "action" ? [] : dummyMeetings);
        }
        setTotalEntries(8); // Set total entries for pagination
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setMeetings(activeTab === "action" ? [] : dummyMeetings);
      }
    };

    fetchMeetings();
  }, [campaignId, activeTab]);

  // Fetch campaign details to check if Calendly link is set
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await axiosClient.get(`/api/campaign/${campaignId}`);
        if (response.data.calendlyLink) {
          setCalendlyLinkSet(true); // If calendlyLink is present, set it to true
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
    <div className="bg-white min-h-screen">
      {!calendlyLinkSet && <CalendlyLinkInput />}

      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Meetings</h1>
          <div className="flex gap-4">
            <TextInput
              placeholder="Search"
              rightSection={<IconSearch size={16} />}
              className="w-64"
              styles={{
                input: {
                  borderRadius: "4px",
                  border: "1px solid #e2e8f0",
                },
              }}
            />
            <Button
              variant="outline"
              color="gray"
              className="flex items-center gap-2"
              styles={{
                root: {
                  border: "1px solid #e2e8f0",
                  borderRadius: "4px",
                },
              }}
            >
              <span>Filter by</span>
              <IconFilter size={16} />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Tabs value={activeTab} onChange={handleTabChange} className="w-full">
            <Tabs.List>
              <motion.div
                className={`px-6 py-3 cursor-pointer rounded-t-lg ${activeTab === "action" ? "text-violet-600 border-b-2 border-violet-600 font-medium" : "text-gray-600"}`}
                whileHover={{ y: -2 }}
                onClick={() => handleTabChange("action")}
              >
                Action Required
              </motion.div>
              <motion.div
                className={`px-6 py-3 cursor-pointer rounded-t-lg ${activeTab === "upcoming" ? "text-violet-600 border-b-2 border-violet-600 font-medium" : "text-gray-600"}`}
                whileHover={{ y: -2 }}
                onClick={() => handleTabChange("upcoming")}
              >
                Upcoming Meetings
              </motion.div>
              <motion.div
                className={`px-6 py-3 cursor-pointer rounded-t-lg ${activeTab === "past" ? "text-violet-600 border-b-2 border-violet-600 font-medium" : "text-gray-600"}`}
                whileHover={{ y: -2 }}
                onClick={() => handleTabChange("past")}
              >
                Past Meetings
              </motion.div>
            </Tabs.List>
          </Tabs>

          <Button
            color="violet"
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md"
          >
            <IconFileExport size={16} className="mr-2" />
            Export all meetings to CSV
          </Button>
        </div>
      </div>

      <div className="px-6 py-4">
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
                      Nice! You've completed all your action required tasks
                    </h3>
                    <p className="text-gray-500 mb-6">
                      You can find your upcoming and past meetings in the two other tabs above.
                    </p>
                    <Button
                      variant="filled"
                      color="violet"
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      Have helpful tips for callers? Share them on your campaign sales floor
                    </Button>
                  </div>
                </Table.Td>
              </Table.Tr>
            ) : (
              meetings.map((meeting, idx) => (
                <Table.Tr key={meeting.id || idx} className={idx % 2 === 0 ? "bg-violet-50" : ""}>
                  <Table.Td>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-violet-600 rounded-full mr-2"></div>
                      {formatDate(meeting.time)}
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {meeting.status || "Scheduled"}
                    </span>
                  </Table.Td>
                  <Table.Td>
                    <div className="flex flex-col">
                      <span className="font-medium">{meeting.prospect || "Jason Fernandez"}</span>
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
                      <span>{meeting.caller || "SDR's Name"}</span>
                    </div>
                  </Table.Td>
                  <Table.Td>{meeting.accountExecutive || "Admin Name"}</Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>

        {/* Pagination */}
        {meetings.length > 0 && (
          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <div className="text-sm text-gray-600">
              Showing 1 to {meetings.length} of {totalEntries} entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                color="gray"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2"
              >
                Previous
              </Button>
              <Button variant="filled" color="violet" className="px-4 py-2 bg-violet-600">
                1
              </Button>
              <Button variant="outline" color="gray" className="px-4 py-2">
                2
              </Button>
              <Button
                variant="outline"
                color="gray"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage * meetings.length >= totalEntries}
                className="px-4 py-2"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
