"use client";

import { useState, useEffect } from "react";
import { Group, Text, ActionIcon, Stack, Title } from "@mantine/core";
import {
  IconPhone,
  IconPhoneOff,
  IconVolume,
  IconVolumeOff,
  IconMicrophone,
  IconMicrophoneOff,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { CallStatusBadge } from "./CallStatusBadge";

interface DialerProps {
  number: string;
  status: "idle" | "calling" | "ringing" | "connected" | "ended";
  duration: number;
  callId: string;
  onCallStart: () => void;
  onCallEnd: (callId: string) => void;
  onMuteToggle: (muted: boolean) => void;
  onSpeakerToggle: (speaker: boolean) => void;
}

export function Dialer({
  number,
  status,
  duration,
  callId,
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
    <motion.div
      className="w-full rounded-3xl p-8 flex flex-col items-center justify-center"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Stack
        align="center"
        gap="xs"
        className="mb-6 p-2"
        style={{
          padding: "10px",
        }}
      >
        <Title
          order={3}
          className="tracking-tight"
          style={{
            marginTop: "10px",
          }}
        >
          {number || "Enter a number"}
        </Title>

        <CallStatusBadge status={status} />

        {status !== "idle" && (
          <Text size="lg" className="font-mono text-gray-300 mt-1">
            {formatDuration(duration)}
          </Text>
        )}
      </Stack>

      <Group justify="center" gap="xl"
      style={{
        marginTop: "30px",
      }}
      >
        <ActionIcon
          variant={muted ? "filled" : "light"}
          size={60}
          radius="xl"
          color={muted ? "red" : "gray"}
          onClick={handleMuteToggle}
          disabled={status === "idle" || status === "ended"}
          className="transition-all duration-200 hover:shadow-lg"
          my={10}
        >
          {muted ? (
            <IconMicrophoneOff size={18} />
          ) : (
            <IconMicrophone size={18} />
          )}
        </ActionIcon>

        {status === "idle" ? (
          <ActionIcon
            variant="filled"
            size={60}
            radius="xl"
            color="green"
            onClick={onCallStart}
            disabled={!number}
            className="transition-all duration-200 hover:shadow-lg"
            my={10}
          >
            <IconPhone size={18} />
          </ActionIcon>
        ) : status !== "ended" && (
          <ActionIcon
            variant="filled"
            size={60}
            radius="xl"
            color="red"
            onClick={() => onCallEnd(callId)}
            className="transition-all duration-200 hover:shadow-lg"
            my={10}
          >
            <IconPhoneOff size={18} />
          </ActionIcon>
        )}

        <ActionIcon
          variant={speaker ? "filled" : "light"}
          size={60}
          radius="xl"
          color={speaker ? "violet" : "gray"}
          onClick={handleSpeakerToggle}
          disabled={status === "idle" || status === "ended"}
          className="transition-all duration-200 hover:shadow-lg"
          my={10}
        >
          {speaker ? <IconVolume size={18} /> : <IconVolumeOff size={18} />}
        </ActionIcon>
      </Group>

    </motion.div>
  );
}
