// app/call/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Dialer } from "@/components/Dialer/Dialer";
import { NumberPad } from "@/components/Dialer/NumberPad";
import { useCallManager } from "@/hooks/useCallManager";
import { Container, Grid, Tabs, Paper, Switch } from "@mantine/core";
import { UploadNumbers } from "@/components/Dialer/UploadNumbers";
import { ContactList } from "@/components/Dialer/ContactList";
import { useAutoDialer } from "@/hooks/useAutoDialer";
import ScriptReader from "@/components/Dialer/ScriptReader";
import { FeedbackModal } from "@/components/Dialer/FeedbackModel";

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

  const handleFeedbackSubmit = (feedback: {
    rating: number;
    notes?: string;
  }) => {
    // Submit feedback logic to backend if needed
    setShowFeedback(false);
    if (autoDial) {
      goToNextContact();
    }
  };

  return (
    <Container size="xl" py="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Tabs defaultValue="list">
            <Tabs.List>
              <Tabs.Tab value="list">Contact List</Tabs.Tab>
              <Tabs.Tab value="pad">Number Pad</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="list" pt="md">
              <UploadNumbers onUpload={handleUpload} />
              <Paper mt="md" p="sm" radius="md" withBorder>
                <Switch
                  label="Auto Dial"
                  checked={autoDial}
                  onChange={(e) => setAutoDial(e.currentTarget.checked)}
                />
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

            <Tabs.Panel value="pad" pt="md">
              <NumberPad
                value={number}
                onChange={setNumber}
                disabled={call.status !== "idle"}
              />
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Dialer
            number={number}
            status={call.status}
            duration={call.duration}
            onCallStart={() => startCall(number)}
            onCallEnd={endCall}
            onMuteToggle={toggleMute}
            onSpeakerToggle={toggleSpeaker}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <ScriptReader />
        </Grid.Col>
      </Grid>

      <FeedbackModal
        opened={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </Container>
  );
}
