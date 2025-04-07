"use client";

import { useDispatch, useSelector } from "react-redux";
import { setNote } from "@/store/notesSlice";
import { RootState } from "@/store/store";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "@/lib/toast";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const NoteEditor = dynamic(() => import("@/components/Feedback/NoteEditor"), {
  ssr: false,
});
import { Group, Text, ActionIcon, Stack, Avatar } from "@mantine/core";
import {
  IconPhone,
  IconVolume,
  IconVolumeOff,
  IconMicrophone,
  IconMicrophoneOff,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { CallStatusBadge } from "./CallStatusBadge";
import { Contact } from "../Contacts/ContactList";

interface DialerProps {
  contact: Contact;
  status: "idle" | "calling" | "ringing" | "connected" | "ended";
  duration: number;
  callId: string;
  onCallStart: () => void;
  onCallEnd: (callId: string) => void;
  onMuteToggle: (muted: boolean) => void;
  onSpeakerToggle: (speaker: boolean) => void;
}

export function Dialer({
  contact,
  status,
  duration,
  callId,
  onCallStart,
  onCallEnd,
  onMuteToggle,
  onSpeakerToggle,
}: DialerProps) {
  const dispatch = useDispatch();
  const savedNotes = useSelector(
    (state: RootState) =>
      (state.notes as { notes: { [key: string]: string } }).notes[callId] || ""
  );

  const [noteInput, setNoteInput] = useState(savedNotes);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);

  useEffect(() => {
    setNoteInput(savedNotes);
  }, [savedNotes, callId]);

  const debouncedSave = useDebouncedCallback((value: string) => {
    if (callId) {
      dispatch(setNote({ callId, note: value }));
    }
  }, 1000);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTextAreaFocused) {
        e.stopPropagation();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isTextAreaFocused]);

  return (
    <motion.div
      className="w-full rounded-3xl flex flex-col items-center justify-start space-y-6"
      style={{
        backgroundColor: "#f9fcfe",
        padding: "20px",
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Contact Info */}
      <Stack align="center" gap="xs" className="w-full mb-5">
        {contact ? (
          <>
            <Avatar size={110} radius="50%" color="ocean">
              {contact.name[0].toUpperCase()}
            </Avatar>
            <CallStatusBadge status={status} />
            <Text fw={600} size="xl" className="text-center tracking-tight">
              {contact.name}
            </Text>
            <Text
              size="md"
              fw={600}
              className="text-center tracking-tight -mt-1 text-[#8b94a9]"
            >
              {contact.number}
            </Text>
            {status !== "idle" && (
              <Text size="sm" className="font-mono text-[#8b94a9] mb-[20px]">
                {formatDuration(duration)}
              </Text>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center px-4 py-6">
            {/* You can replace this with any SVG you like */}
            <IconPhone size={100} className="mb-2" color="#7d91e2" />
            <Text fw={600} size="lg" className="text-[#7d91e2] mb-1">
              No Active Call
            </Text>
            <Text size="xs" className="text-[#a0a7b8] max-w-xs">
              Start a call to see contact details, take notes, and manage audio
              settings.
            </Text>
          </div>
        )}
      </Stack>

      {/* Action Buttons */}
      {contact && (
          <>
      <Group
        justify="center"
        gap="xl"
        style={{
          margin: "20px",
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
            className="text-white shadow-lg"
            onClick={onCallStart}
            disabled={!contact.number}
          >
            <IconPhone size={18} />
          </ActionIcon>
        ) : (
          status !== "ended" && (
            <ActionIcon
              variant="filled"
              size={60}
              radius="xl"
              color="red"
              onClick={() => onCallEnd(callId)}
              className="transition-all duration-200 hover:shadow-lg"
            >
              <IconPhone size={18} />
            </ActionIcon>
          )
        )}

        <ActionIcon
          variant={speaker ? "filled" : "light"}
          size={60}
          radius="xl"
          color={speaker ? "primary" : "gray"}
          onClick={handleSpeakerToggle}
          disabled={status === "idle" || status === "ended"}
          className="transition-all duration-200 hover:shadow-lg"
        >
          {speaker ? <IconVolume size={18} /> : <IconVolumeOff size={18} />}
        </ActionIcon>
      </Group>
      </>
      )
    }

      {/* Notes */}
      {status !== "idle" && callId && (
        <div className="w-full my-5"
        style={{
          border: "1px solid #f0f3f5",
          borderRadius: "10px",
        }}
        >
          <NoteEditor
            content={noteInput}
            onChange={(value) => {
              setNoteInput(value);
              debouncedSave(value);
            }}
            onBlur={() => {
              setIsTextAreaFocused(false);
              toast.success("Notes saved");
            }}
          />
        </div>
      )}
    </motion.div>
  );
}
