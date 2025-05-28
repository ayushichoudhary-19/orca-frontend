import { useDispatch, useSelector } from "react-redux";
import { setNote } from "@/store/notesSlice";
import { RootState } from "@/store/store";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Group, Text, ActionIcon, Stack, Button, Divider, Drawer, Paper, Box } from "@mantine/core";
import {
  IconPhone,
  IconVolume,
  IconVolumeOff,
  IconMicrophone,
  IconMicrophoneOff,
  IconUsers,
  IconBuildings,
  IconWallet,
  IconMail,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Lead } from "@/hooks/useAutoDialer";
import { toast } from "@/lib/toast";
import CustomBadge from "../Leads/CustomBadge";
import { useCalendly } from "@/hooks/useCalendly";

const NoteEditor = dynamic(() => import("@/components/Feedback/NoteEditor"), { ssr: false });

export function Dialer({
  contact,
  status,
  duration,
  callId,
  onCallEnd,
  onMuteToggle,
  onSpeakerToggle,
  isAutoDialerReady,
}: {
  contact: Lead | null;
  status: "idle" | "calling" | "ringing" | "connected" | "ended";
  duration: number;
  callId: string;
  onCallStart: () => void;
  onCallEnd: (callId: string) => void;
  onMuteToggle: (muted: boolean) => void;
  onSpeakerToggle: (speaker: boolean) => void;
  isAutoDialerReady?: boolean;
}) {
  const dispatch = useDispatch();
  const savedNotes = useSelector((state: RootState) => state.notes?.notes?.[callId] || "");
  const [noteInput, setNoteInput] = useState("");
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const { calendlyLink, loading: calendlyLoading } = useCalendly();
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);

  const calendlyWithParams =
    calendlyLink && contact?.email
      ? `${calendlyLink}?email=${encodeURIComponent(contact.email)}&name=${encodeURIComponent(
          contact.fullName || contact.name || ""
        )}&utm_campaign=${campaignId}`
      : null;

  const debouncedSave = useDebouncedCallback((value: string) => {
    if (callId) dispatch(setNote({ callId, note: value }));
  }, 1000);

  useEffect(() => {
    if (callId) {
      setNoteInput(savedNotes || "");
    } else {
      setNoteInput("");
    }
  }, [callId, savedNotes]);

  useEffect(() => {
    if (status === "ended") {
      setNoteInput("");
    }
  }, [status]);

  const handleMuteToggle = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    onMuteToggle(newMuted);
  };

  const handleSpeakerToggle = () => {
    const newSpeaker = !speaker;
    setSpeaker(newSpeaker);
    onSpeakerToggle(newSpeaker);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getCallStatusText = () => {
    switch (status) {
      case "calling":
        return "Calling...";
      case "ringing":
        return "Ringing...";
      case "connected":
        return "Connected";
      case "ended":
        return "Call Ended";
      case "idle":
        return "Idle";
      default:
        return "";
    }
  };

  if (!contact) return null;

  return (
    <motion.div
      className="w-full h-full flex flex-col justify-between px-4 md:px-8 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Box style={{ flexGrow: 1, overflowY: "auto", paddingBottom: "16px" }}>
        <Paper
          p="md"
          radius="md"
          className="bg-[#E8E4FF] rounded-xl p-6 shadow-md border border-white/20 mb-4"
        >
          <Stack gap="xs">
            <Text size="xl" fw={600}>
              {contact.fullName || contact.name}
            </Text>

            {status !== "idle" && (
              <Group justify="space-between" align="center" mt="xs" mb="xs">
                <Text
                  size="md"
                  fw={500}
                  c={
                    status === "connected"
                      ? "green.6"
                      : status === "ringing" || status === "calling"
                        ? "blue.6"
                        : status === "ended"
                          ? "red.6"
                          : "dimmed"
                  }
                >
                  {getCallStatusText()}
                </Text>
                {status === "connected" && (
                  <Text size="md" fw={500} c="green.6">
                    {formatDuration(duration)}
                  </Text>
                )}
              </Group>
            )}

            <Text size="sm" c="black">
              {contact.title} <span className="text-[#6D57FC]">@{contact.company}</span>
            </Text>
            <Divider />
            <Text size="sm" fw={600}>
              Company Info
            </Text>
            <Group gap="xs" wrap="wrap">
              <CustomBadge icon={<IconUsers size={14} />} value={contact.employeeCount || "-"} />
              <CustomBadge icon={<IconBuildings size={14} />} value={contact.industry || "-"} />
              <CustomBadge icon={<IconWallet size={14} />} value={contact.revenue || "-"} />
              <CustomBadge
                icon={<IconWallet size={14} />}
                value={
                  contact.city && contact.location
                    ? `${contact.city}, ${contact.location}`
                    : contact.city || contact.location || "-"
                }
              />
            </Group>
            <Text size="sm" fw={600} mt="md">
              Contact Info
            </Text>
            <Group gap="xs" wrap="wrap">
              <CustomBadge icon={<IconPhone size={14} />} value={contact.phone} />
              <CustomBadge icon={<IconMail size={14} />} value={contact.email} />
            </Group>

            <Group justify="flex-start" mt="md">
              <Button
                radius="md"
                size="md"
                disabled={status !== "connected" && !isAutoDialerReady}
                leftSection={<IconCalendarEvent size={16} />}
                onClick={() => setDrawerOpened(true)}
              >
                Schedule Meeting
              </Button>
            </Group>
          </Stack>
        </Paper>

        {(status !== "idle" || callId) && (
          <div className="w-full">
            <NoteEditor
              key={callId || "no-call-id"}
              content={noteInput}
              theme="dialer"
              onChange={(value) => {
                setNoteInput(value);
                debouncedSave(value);
              }}
              onBlur={() => {
                if (noteInput.length > 0) toast.success("Notes saved");
              }}
            />
          </div>
        )}
      </Box>

      <Paper
        p="xs"
        radius="md"
        mt="sm"
        shadow="xs"
        className="bg-[#E8E4FF] w-[50%] h-[60px] rounded-xl shadow-md border border-white/20 self-center
        flex justify-center items-center
        "
      >
        <Group justify="around" align="center">
          <ActionIcon variant="transparent" onClick={handleMuteToggle} size={48}>
            {muted ? (
              <IconMicrophoneOff size={20} color="#555461" stroke={1.5} />
            ) : (
              <IconMicrophone size={20} color="#555461" stroke={1.5} />
            )}
          </ActionIcon>

          <ActionIcon variant="transparent" onClick={handleSpeakerToggle} size={48}>
            {speaker ? (
              <IconVolume size={20} color="#555461" stroke={1.5} />
            ) : (
              <IconVolumeOff size={20} color="#555461" stroke={1.5} />
            )}
          </ActionIcon>

          <Button
            radius="md"
            size="md"
            color="red"
            onClick={() => onCallEnd(callId)}
            className="font-normal text-sm"
            leftSection={<IconPhone size={16} stroke={1.5} />}
          >
            End Call
          </Button>
        </Group>
      </Paper>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        position="right"
        size="60%"
        title="Schedule a Meeting"
      >
        {calendlyLoading ? (
          <Text>Loading...</Text>
        ) : calendlyWithParams ? (
          <iframe
            src={calendlyWithParams}
            width="100%"
            height="100%"
            style={{ minHeight: "80vh" }}
            title="Calendly Meeting Scheduler"
          />
        ) : (
          <Text>No Calendly link available for this campaign.</Text>
        )}
      </Drawer>
    </motion.div>
  );
}
