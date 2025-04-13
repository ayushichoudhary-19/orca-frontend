"use client";

import { useEffect, useRef, useState } from "react";
import { Dialer } from "@/components/Dialer/Dialer";
import { NumberPad } from "@/components/Dialer/NumberPad";
import { useCallManager } from "@/hooks/useCallManager";
import { useFeedback, FeedbackData } from "@/hooks/useFeedback";
import { Container, Tabs, Paper, PaperProps, Switch, Text, Group, Button } from "@mantine/core";
import { UploadNumbers } from "@/components/Contacts/UploadNumbers";
import { ContactList } from "@/components/Contacts/ContactList";
import { useAutoDialer } from "@/hooks/useAutoDialer";
import { ScriptReader } from "@/components/Script/ScriptReader";
import { FeedbackModal } from "@/components/Feedback/FeedbackModel";
import { motion } from "framer-motion";
import {
  IconList,
  IconDialpad,
  IconPlayerStopFilled,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { forwardRef } from "react";
import { Toaster } from "react-hot-toast";
import { CountdownOverlay } from "@/components/Dialer/CountdownOverlay";
import { toast } from "@/lib/toast";

const PaperWithRef = forwardRef<HTMLDivElement, PaperProps>((props, ref) => (
  <Paper ref={ref} {...props} />
));

PaperWithRef.displayName = "MotionPaper";

const MotionPaper = motion(PaperWithRef);
const MotionContainer = motion(Container);

export default function CallPage() {
  const { call, startCall, endCall, toggleMute, toggleSpeaker } = useCallManager();
  const [number, setNumber] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [autoDial, setAutoDial] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false); 

  const {
    contacts,
    currentContact,
    handleUpload,
    goToNextContact,
    setManualNumber,
    startAutoDialing,
    pauseAutoDialing,
    stopAutoDialing,
    getAutoDialStatus,
    incrementContactIndex,
  } = useAutoDialer(startCall, endCall);

  const currentContactData =
  contacts[currentContact] ||
  (number
    ? { name: "Unknown Number", number }
    : null);
  const hasHandledCallEndRef = useRef(false);

  useEffect(() => {
    if (call.status === "ended" && !hasHandledCallEndRef.current) {
      setShowFeedback(true);
      hasHandledCallEndRef.current = true;

      // Delay contact index shift until after feedback is submitted
    }

    if (call.status !== "ended") {
      hasHandledCallEndRef.current = false;
    }
  }, [call.status]);

  const { submitFeedback } = useFeedback();

  const handleFeedbackSubmit = async (feedback: FeedbackData) => {
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

      if (getAutoDialStatus() === "running") {
        incrementContactIndex();
        setShowCountdown(true);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setShowFeedback(false);
    }
  };

  return (
    <MotionContainer
      size="xxl"
      p={0}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <Toaster position="top-center" />

      <div
        className="flex flex-row w-full min-h-screen"
        style={{ background: "linear-gradient(to right,#dbe1f2,  #dae0f2)" }}
      >
        {/* Contacts & Controls */}
        <div className="w-full md:w-1/3 min-h-screen" style={{ zIndex: 1 }}>
          <div className="w-full">
            <MotionPaper
              p="xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="bg-transparent"
            >
              <Tabs defaultValue="list" variant="pills" radius="xl">
                <Tabs.List grow mb="md">
                  <Tabs.Tab value="list" leftSection={<IconList size={16} />}>
                    Contacts
                  </Tabs.Tab>
                  <Tabs.Tab value="pad" leftSection={<IconDialpad size={16} />}>
                    Dial Pad
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="list">
                  <UploadNumbers onUpload={handleUpload} />
                  <Paper mt="md" p="sm" radius="md" className="gradient-horizontal-light-2 w-max">
                    <Group justify="space-between">
                      <Group>
                        <Text size="sm" fw={500}>
                          Auto Dial
                        </Text>
                        <Switch
                          checked={autoDial}
                          onChange={(e) => setAutoDial(e.currentTarget.checked)}
                          size="md"
                        />
                      </Group>
                      <Group>
                        <Button
                          onClick={() => {
                            setAutoDial(true);
                            startAutoDialing();
                          }}
                          leftSection={<IconPlayerPlayFilled size={16} />}
                          size="xs"
                          variant="filled"
                        >
                          Start
                        </Button>
                        <Button
                          onClick={() => {
                            pauseAutoDialing();
                            setAutoDial(false);
                          }}
                          size="xs"
                          variant="filled"
                          color="yellow"
                        >
                         <IconPlayerPauseFilled size={16} />
                        </Button>
                        <Button
                          onClick={() => {
                            stopAutoDialing();
                            setAutoDial(false);
                          }}
                          size="xs"
                          variant="filled"
                          color="red"
                        >
                          <IconPlayerStopFilled size={16} />
                        </Button>
                      </Group>
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
                    onChange={(num) => {
                      setNumber(num);
                      setManualNumber(num);
                    }}
                    disabled={call.status !== "idle"}
                  />
                </Tabs.Panel>
              </Tabs>
            </MotionPaper>
          </div>
        </div>

        {/* Dialer */}
        <div
          className="w-full md:w-1/3 min-h-screen flex items-center justify-center"
          style={{
            boxShadow: "-16px 0 40px -8px rgba(0, 0, 0, 0.05)",
            zIndex: 2,
            borderTopLeftRadius: "24px",
            borderBottomLeftRadius: "24px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#f9fcfe",
          }}
        >
          {showCountdown && (
            <CountdownOverlay
              seconds={8}
              onComplete={() => {
                setShowCountdown(false);
                goToNextContact();
              }}
            />
          )}
          <div className="w-full px-4">
            <MotionPaper
              className="border-none bg-transparent backdrop-blur-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              p="xl"
            >
              
              <Dialer
                contact={currentContactData}
                status={call.status}
                duration={call.duration}
                callId={call.id}
                onCallStart={() => startCall(currentContactData?.number || "")}
                onCallEnd={endCall}
                onMuteToggle={toggleMute}
                onSpeakerToggle={toggleSpeaker}
              />
            </MotionPaper>
          </div>
        </div>

        {/* Script Reader */}
        <div className="w-full md:w-1/3 bg-white min-h-screen">
          <ScriptReader contact={currentContactData} />
        </div>
      </div>

      <FeedbackModal
        callId={call.id}
        opened={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={(feedback) => handleFeedbackSubmit({ ...feedback, callId: call.id })}
      />
    </MotionContainer>
  );
}
