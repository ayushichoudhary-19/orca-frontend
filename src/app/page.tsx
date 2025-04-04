"use client";

import { useEffect, useRef, useState } from "react";
import { Dialer } from "@/components/Dialer/Dialer";
import { NumberPad } from "@/components/Dialer/NumberPad";
import { useCallManager } from "@/hooks/useCallManager";
import { useFeedback, FeedbackData } from "@/hooks/useFeedback";
import {
  Container,
  Grid,
  Tabs,
  Paper,
  PaperProps,
  Switch,
  Text,
  Group,
} from "@mantine/core";
import { UploadNumbers } from "@/components/Dialer/UploadNumbers";
import { ContactList } from "@/components/Dialer/ContactList";
import { useAutoDialer } from "@/hooks/useAutoDialer";
import { ScriptReader } from "@/components/Dialer/ScriptReader";
import { FeedbackModal } from "@/components/Dialer/FeedbackModel";
import { motion } from "framer-motion";
import { IconList, IconDialpad } from "@tabler/icons-react";
import { forwardRef } from "react";
import { Toaster } from "react-hot-toast";
import { toast } from "@/lib/toast";

const PaperWithRef = forwardRef<HTMLDivElement, PaperProps>((props, ref) => (
  <Paper ref={ref} {...props} />
));

PaperWithRef.displayName = "MotionPaper";

const MotionPaper = motion(PaperWithRef);
const MotionContainer = motion(Container);

export default function CallPage() {
  const { call, startCall, endCall, toggleMute, toggleSpeaker } =
    useCallManager();
  const [number, setNumber] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [autoDial, setAutoDial] = useState(true);

  const {
    contacts,
    currentContact,
    handleUpload,
    goToNextContact,
    setManualNumber,
  } = useAutoDialer(startCall, endCall);

  const hasHandledCallEndRef = useRef(false);

  useEffect(() => {
    if (call.status === "ended" && !hasHandledCallEndRef.current) {
      setShowFeedback(true);
      hasHandledCallEndRef.current = true;
    }

    if (call.status !== "ended") {
      hasHandledCallEndRef.current = false;
    }
  }, [call.status]);

  const { submitFeedback } = useFeedback();

  const handleFeedbackSubmit = async (feedback: {
    callOutcome: FeedbackData["callOutcome"];
    leadStatus: FeedbackData["leadStatus"];
    notes?: string;
  }) => {
    const promise = submitFeedback({
      callId: call.id,
      callOutcome: feedback.callOutcome,
      leadStatus: feedback.leadStatus,
      notes: feedback.notes || "",
    });

    toast.promise(promise, {
      loading: "Submitting feedback...",
      success: "Feedback submitted successfully!",
      error: "Failed to submit feedback.",
    });

    try {
      await promise;
      setShowFeedback(false);
      if (autoDial) {
        goToNextContact();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setShowFeedback(false);
      if (autoDial) {
        goToNextContact();
      }
    }
  };

  return (
    <MotionContainer
      size="xl"
      py="xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <Toaster position="top-center" />

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <MotionPaper
            p="md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              height: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tabs defaultValue="list" variant="pills" radius="xl">
              <Tabs.List grow mb="md">
                <Tabs.Tab
                  value="list"
                  leftSection={<IconList size={16} />}
                  className="font-medium"
                >
                  Contacts
                </Tabs.Tab>
                <Tabs.Tab
                  value="pad"
                  leftSection={<IconDialpad size={16} />}
                  className="font-medium"
                >
                  Dial Pad
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="list">
                <UploadNumbers onUpload={handleUpload} />
                <Paper mt="md" p="sm" radius="md">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>
                      Auto Dial
                    </Text>
                    <Switch
                      checked={autoDial}
                      onChange={(e) => setAutoDial(e.currentTarget.checked)}
                      size="md"
                      color="violet"
                    />
                  </Group>
                </Paper>
                <ContactList
                  contacts={contacts}
                  currentContact={currentContact}
                  onSelect={(c) => {
                    setManualNumber(c.number);
                    setNumber(c.number);
                  }}
                />
              </Tabs.Panel>

              <Tabs.Panel value="pad">
                <NumberPad
                  value={number}
                  onChange={setNumber}
                  disabled={call.status !== "idle"}
                />
              </Tabs.Panel>
            </Tabs>
          </MotionPaper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <MotionPaper
            className="glass-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "500px",
            }}
          >
            <Dialer
              number={number}
              status={call.status}
              duration={call.duration}
              callId={call.id}
              onCallStart={() => startCall(number)}
              onCallEnd={endCall}
              onMuteToggle={toggleMute}
              onSpeakerToggle={toggleSpeaker}
            />
          </MotionPaper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }} className="px-10">
          <ScriptReader />
        </Grid.Col>
      </Grid>

      <FeedbackModal
        opened={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </MotionContainer>
  );
}
