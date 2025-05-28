"use client";

import {
  Modal,
  Button,
  Group,
  Text,
  Stack,
  Badge,
  Box,
} from "@mantine/core";
import dynamic from "next/dynamic";
const NoteEditor = dynamic(() => import("@/components/Feedback/NoteEditor"), { ssr: false });
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconSend } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { removeNote } from "@/store/notesSlice";
import { RootState } from "@/store/store";

interface FeedbackModalProps {
  opened: boolean;
  onClose: () => void;
  callId: string;
  onSubmit: (feedback: {
    feedbackReason: FeedbackReason;
    notes?: string;
  }) => void;  
}

const feedbackOptions = [
  { value: "tentative_interest", label: "Tentative Interest ✅", color: "green" },
  { value: "no_pickup", label: "No Pick Up ☎️", color: "gray" },
  { value: "not_interested", label: "Not Interested ❌", color: "red" },
  { value: "not_qualified", label: "Not Qualified 🚫", color: "red" },
  { value: "bad_data", label: "Bad Data / Do Not Call 🚫", color: "red" },
] as const;

type FeedbackReason = typeof feedbackOptions[number]["value"];

export const FeedbackModal = ({
  opened,
  onClose,
  onSubmit,
  callId,
}: FeedbackModalProps) => {
  const dispatch = useDispatch();
  const savedNotes = useSelector(
    (state: RootState) => state.notes?.notes?.[callId] || ""
  );

  const [feedbackReason, setFeedbackReason] = useState<FeedbackReason | "">("");
  const [notes, setNotes] = useState(savedNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (opened && callId) {
      setNotes(savedNotes || "");
    }
  }, [opened, callId, savedNotes]);

  const handleSubmit = async () => {
    if (!feedbackReason) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        feedbackReason,
        notes: notes || undefined,
      });
      dispatch(removeNote(callId));
    } finally {
      setIsSubmitting(false);
      setFeedbackReason("");
      setNotes("");
    }
  };
  

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text className="text-xl font-semibold text-gray-800">
          Call Feedback
        </Text>
      }
      style={{
        backgroundColor: "#f9fcfe",
      }}
      centered
      radius="md"
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      size="md"
      withCloseButton={false}
    >
      <Stack gap="md">
      <Box>
  <Text fw={600} size="sm" mb={8}>
    What happened on the call? <span>*</span>
  </Text>
  <div className="flex flex-wrap" style={{ gap: "10px" }}>
    {feedbackOptions.map((option) => (
      <Badge
        key={option.value}
        radius="md"
        variant={feedbackReason === option.value ? "filled" : "light"}
        color={feedbackReason === option.value ? option.color : "gray.6"}
        onClick={() => setFeedbackReason(option.value)}
        style={{
          cursor: "pointer",
          padding: "15px",
          fontSize: "14px",
          textTransform: "none",
          fontWeight: 500,
        }}
      >
        {option.label}
      </Badge>
    ))}
  </div>
</Box>
        <Box>
          <Text fw={600} size="sm" mb={8}>
            Notes
          </Text>
          <div

          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.13)",
          }}
          >
        <NoteEditor
  content={notes}
  onChange={(value) => setNotes(value)}
/>

          </div>
        </Box>

        {/* Submit Button */}
        <Group justify="right" mt="md">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSubmit}
              disabled={!feedbackReason || isSubmitting}
              loading={isSubmitting}
              leftSection={<IconSend size={16} />}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg"
            >
              Submit Feedback
            </Button>
          </motion.div>
        </Group>
      </Stack>
    </Modal>
  );
};
