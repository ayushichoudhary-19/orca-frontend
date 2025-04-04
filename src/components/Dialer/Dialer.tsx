// components/Dialer/Dialer.tsx
"use client";

import { useState, useEffect } from "react";
import { Button, Group, Text, ActionIcon, Paper, Stack } from "@mantine/core";
import {
  IconPhone,
  IconPhoneOff,
  IconVolume,
  IconMicrophone,
  IconMicrophoneOff,
} from "@tabler/icons-react";
import { CallStatusBadge } from "./CallStatusBadge";

interface DialerProps {
  number: string;
  status: "idle" | "calling" | "ringing" | "connected" | "ended";
  duration: number;
  onCallStart: () => void;
  onCallEnd: () => void;
  onMuteToggle: (muted: boolean) => void;
  onSpeakerToggle: (speaker: boolean) => void;
}

export function Dialer({
  number,
  status,
  duration,
  onCallStart,
  onCallEnd,
  onMuteToggle,
  onSpeakerToggle,
}: DialerProps) {
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (status === "ended") {
      setMuted(false);
      setSpeaker(false);
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

  return (
    <Paper
      radius="2xl"
      p="xl"
      shadow="lg"
      className="bg-white/10 backdrop-blur-md border border-white/10 transition-all"
    >
      <Stack align="center" gap="xs">
        <Text size="lg" fw={600} className="text-white tracking-wide">
          {number || "Enter a number"}
        </Text>
        <CallStatusBadge status={status} />
        {status !== "idle" && (
          <Text size="xs" c="gray.4" mt={-2}>
            {formatDuration(duration)}
          </Text>
        )}
      </Stack>

      <Group justify="center" mt="xl" gap="lg">
        <ActionIcon
          variant="light"
          size="xl"
          radius="xl"
          color={muted ? "red" : "gray"}
          onClick={handleMuteToggle}
          disabled={status === "idle" || status === "ended"}
        >
          {muted ? (
            <IconMicrophoneOff size={24} />
          ) : (
            <IconMicrophone size={24} />
          )}
        </ActionIcon>

        <ActionIcon
          variant="light"
          size="xl"
          radius="xl"
          color={speaker ? "blue" : "gray"}
          onClick={handleSpeakerToggle}
          disabled={status === "idle" || status === "ended"}
        >
          <IconVolume size={24} />
        </ActionIcon>
      </Group>

      <Group justify="center" mt="xl">
        {status === "idle" && (
          <Button
            size="lg"
            radius="xl"
            leftSection={<IconPhone size={20} />}
            color="green"
            onClick={onCallStart}
            disabled={!number}
          >
            Call
          </Button>
        )}

        {status !== "idle" && status !== "ended" && (
          <Button
            size="lg"
            radius="xl"
            leftSection={<IconPhoneOff size={20} />}
            color="red"
            onClick={onCallEnd}
          >
            End
          </Button>
        )}
      </Group>
    </Paper>
  );
}
