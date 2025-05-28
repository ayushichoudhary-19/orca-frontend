"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Dialer } from "@/components/Dialer/Dialer";
import { useCallManager } from "@/hooks/useCallManager";
import { useFeedback, FeedbackData } from "@/hooks/useFeedback";
import { Container, Paper, PaperProps, Text, Stack, Button } from "@mantine/core";
import { useAutoDialer } from "@/hooks/useAutoDialer";
import { ScriptReader } from "@/components/Script/ScriptReader";
import { FeedbackModal } from "@/components/Feedback/FeedbackModel";
import { motion } from "framer-motion";
import { forwardRef } from "react";
import { CountdownOverlay } from "@/components/Dialer/CountdownOverlay";
import { toast } from "@/lib/toast";
import { StartCallingOverlay } from "@/components/Dialer/StartCallingOverlay";
import Loader from "@/components/Utils/Loader";
import { IconChevronLeft } from "@tabler/icons-react";

const PaperWithRef = forwardRef<HTMLDivElement, PaperProps>((props, ref) => (
  <Paper ref={ref} {...props} />
));
PaperWithRef.displayName = "PaperWithRef";

const MotionPaper = motion.create(PaperWithRef);
const MotionContainer = motion.create(Container);

export default function CallPage() {
  const { call, startCall, endCall, toggleMute, toggleSpeaker, isDeviceReady, device } =
    useCallManager();
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const {
    contacts,
    currentContactData,
    goToNextContact,
    startAutoDialing,
    getAutoDialStatus,
    pauseAutoDialing,
  } = useAutoDialer(startCall, endCall);

  const hasHandledCallEndRef = useRef(false);

  useEffect(() => {
    if (call.status === "ended" && call.id && !hasHandledCallEndRef.current) {
      console.log("CallPage: Call ended, showing feedback modal for call ID:", call.id);
      setShowFeedback(true);
      hasHandledCallEndRef.current = true;
    }
    if (call.status !== "ended") {
      hasHandledCallEndRef.current = false;
    }
  }, [call.status, call.id]);
  const { submitFeedback } = useFeedback();

  useEffect(() => {
    if (!showIntro && contacts.length > 0 && isDeviceReady && getAutoDialStatus() === "idle") {
      console.log(
        "CallPage: Conditions met (Intro hidden, Contacts loaded, Device ready, Dialer idle). Starting auto-dialing."
      );
      startAutoDialing();
    } else if (
      !showIntro &&
      contacts.length > 0 &&
      !isDeviceReady &&
      getAutoDialStatus() === "idle"
    ) {
      console.log("CallPage: Waiting for device to become ready...");
      toast.info("Audio system initializing... Auto-dialing will begin shortly.");
    } else if (!showIntro && contacts.length === 0 && getAutoDialStatus() === "idle") {
      console.log("CallPage: Waiting for contacts to load...");
    }
  }, [showIntro, contacts, isDeviceReady, getAutoDialStatus, startAutoDialing]);

  const handleFeedbackSubmit = async (feedback: FeedbackData) => {
    const promise = submitFeedback(feedback);
  
    toast.promise(promise, {
      loading: "Submitting feedback...",
      success: "Feedback submitted successfully!",
      error: "Failed to submit feedback.",
    });
  
    try {
      await promise;
      setShowFeedback(false);
      if (getAutoDialStatus() === "running") {
        setShowCountdown(true);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };
  

  const handleStartSession = useCallback(() => {
    console.log("CallPage: 'Start Session' clicked.");
    if (contacts.length === 0) {
      toast.error("Leads are still loading. Please wait a moment.");
      return;
    }

    setShowIntro(false);

    if (!isDeviceReady) {
      toast.info("Audio system initializing... Auto-dialing will begin shortly.");
      console.log("CallPage: Audio system not ready yet. Waiting for device via useEffect.");
      if (!device && typeof window !== "undefined") {
        console.warn(
          "CallPage: Device object is null, attempting to dispatch a synthetic click to ensure interaction for Twilio init."
        );
      }
    }
  }, [contacts, isDeviceReady, device]);

  const handleManualCallClick = useCallback(() => {
    setShowIntro(false);
    if (getAutoDialStatus() === "running") {
      pauseAutoDialing();
      toast.info("Auto-dialing paused for manual call.");
    } else if (getAutoDialStatus() === "idle") {
      console.log(
        "CallPage: Manual call mode selected. Auto-dialing (if any) should be paused/stopped."
      );
    }
    if (!isDeviceReady) {
      toast.info("Audio system initializing... Please wait a moment before making a manual call.");
    }
  }, [isDeviceReady, getAutoDialStatus, pauseAutoDialing]);

  const renderDialerContent = () => {
    if (showIntro) {
      return (
        <StartCallingOverlay
          onStart={handleStartSession}
          onManualCallClick={handleManualCallClick}
        />
      );
    }

    if (!isDeviceReady) {
      return (
        <Paper p="xl" withBorder>
          <Stack align="center">
            <Text fw={500}>Initializing Audio System</Text>
            <Text c="dimmed" size="sm">
              Please wait, preparing the dialer...
            </Text>
            <Loader />
          </Stack>
        </Paper>
      );
    }

    if (contacts.length === 0 && getAutoDialStatus() !== "running") {
      return (
        <Paper p="xl" withBorder>
          <Stack align="center">
            <Text fw={500}>Loading Leads</Text>
            <Text c="dimmed" size="sm">
              Waiting for contacts to display in the dialer...
            </Text>
          </Stack>
        </Paper>
      );
    }

    if (currentContactData) {
      return (
        <Dialer
          contact={currentContactData}
          status={call.status}
          duration={call.duration}
          callId={call.id}
          onCallStart={() => {
            if (currentContactData?.phone) {
              if (getAutoDialStatus() === "idle") {
                startCall(currentContactData.phone);
              } else {
                toast.info("Auto-dialer is active.");
              }
            } else {
              toast.error("No phone number for current contact.");
            }
          }}
          onCallEnd={() => endCall()}
          onMuteToggle={toggleMute}
          onSpeakerToggle={toggleSpeaker}
          isAutoDialerReady={getAutoDialStatus() === "running"}
        />
      );
    }

    return (
      <Paper p="xl" withBorder>
        <Stack align="center">
          <Text fw={500}>Preparing Dialer</Text>
          <Text c="dimmed" size="sm">
            Please wait...
          </Text>
        </Stack>
      </Paper>
    );
  };

  return (
    <MotionContainer
      size="xxl"
      p={0}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <div className="w-screen h-[60px] py-3 px-4">
        <Button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className="flex items-center justify-between"
        >
          <IconChevronLeft stroke={1.5} size={16} />
          <Text>Exit</Text>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row w-full min-h-screen bg-gradient-to-r from-[#3a3873] to-[#8061d7]">
        <div
          className="w-full md:w-2/3 min-h-screen flex items-center justify-center"
          style={{
            boxShadow: "-16px 0 40px -8px rgba(0, 0, 0, 0.05)",
            zIndex: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {showCountdown && (
            <CountdownOverlay
              seconds={8}
              onComplete={() => {
                setShowCountdown(false);
                if (getAutoDialStatus() === "running") {
                  goToNextContact();
                } else {
                  console.log(
                    "Countdown complete, but auto-dialer not running. Status:",
                    getAutoDialStatus()
                  );
                }
              }}
            />
          )}

          <div className="w-full px-4">
            <MotionPaper
              className="border-none bg-transparent"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              p="xl"
            >
              {renderDialerContent()}
            </MotionPaper>
          </div>
        </div>

        <div className="w-full md:w-1/3 min-h-screen">
          <ScriptReader />
        </div>
      </div>

      {call.id && (
        <FeedbackModal
          key={call.id}
          callId={call.id}
          opened={showFeedback}
          onClose={() => {
            setShowFeedback(false);
          }}
          onSubmit={(feedback) => handleFeedbackSubmit({ ...feedback, callId: call.id })}
        />
      )}
    </MotionContainer>
  );
}