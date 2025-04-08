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
import { FeedbackData } from "@/hooks/useFeedback";
import { useDispatch, useSelector } from "react-redux";
import { removeNote } from "@/store/notesSlice";
import { RootState } from "@/store/store";
import { theme } from "@/app/theme";

interface FeedbackModalProps {
  opened: boolean;
  onClose: () => void;
  callId: string;
  onSubmit: (feedback: {
    callOutcome: FeedbackData["callOutcome"];
    leadStatus: FeedbackData["leadStatus"];
    notes?: string;
  }) => void;
}

const callOutcomes: { value: FeedbackData["callOutcome"]; label: string }[] = [
  { value: "ANSWERED", label: "Answered" },
  { value: "WENT_TO_VOICEMAIL", label: "Went to Voicemail" },
  { value: "NO_ANSWER", label: "No Answer" },
  { value: "CALL_DROPPED", label: "Call Dropped" },
  { value: "TECHNICAL_ISSUE", label: "Technical Issue" },
  { value: "WRONG_NUMBER", label: "Wrong Number" },
];

const leadStatuses: { value: FeedbackData["leadStatus"]; label: string }[] = [
  { value: "HIGH_POTENTIAL", label: "High Potential 🔥" },
  { value: "WARM_LEAD", label: "Warm Lead 👍" },
  { value: "COLD_LEAD", label: "Cold Lead ❄️" },
  { value: "NOT_A_FIT", label: "Not a Fit 🚫" },
  { value: "USING_COMPETITOR", label: "Using Competitor" },
];

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

  const [callOutcome, setCallOutcome] = useState<
    FeedbackData["callOutcome"] | ""
  >("");
  const [leadStatus, setLeadStatus] = useState<FeedbackData["leadStatus"] | "">(
    ""
  );
  const [notes, setNotes] = useState(savedNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (opened && callId) {
      setNotes(savedNotes || "");
    }
  }, [opened, callId, savedNotes]);

  const handleSubmit = async () => {
    if (!callOutcome || !leadStatus) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        callOutcome,
        leadStatus,
        notes: notes || undefined,
      });
      dispatch(removeNote(callId));
    } finally {
      setIsSubmitting(false);
      setCallOutcome("");
      setLeadStatus("");
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
        {/* Call Outcome Section */}
        <Box>
          <Text fw={600} size="sm" mb={8}>
            What happened on the call? <span>*</span>
          </Text>
          <div className="flex flex-wrap"
          style={{
            gap: "10px",
          }}
          >
            {callOutcomes.map((option) => (
              <Badge
                key={option.value}
                radius="md"
                variant={callOutcome === option.value ? "filled" : "light"}
                color={
                  callOutcome === option.value
                    ? theme?.colors?.ocean?.[7] ?? ""
                    : "gray.6"
                }
                onClick={() => setCallOutcome(option.value)}
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

        {/* Lead Status Section */}
        <Box>
          <Text fw={600} size="sm" mb={8}>
            Lead Status <span>*</span>
          </Text>
          <div className="flex flex-wrap"
          
          style={{
            gap: "10px",
          }}
          >
            {leadStatuses.map((status) => (
              <Badge
                key={status.value}
                radius="md"
                variant={leadStatus === status.value ? "filled" : "light"}
                color={
                  leadStatus === status.value
                    ? theme?.colors?.ocean?.[7] ?? ""
                    : "gray.6"
                }
                onClick={() => setLeadStatus(status.value)}
                style={{
                  cursor: "pointer",
                  padding: "15px",
                  fontSize: "14px",
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                {status.label}
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
              disabled={!callOutcome || !leadStatus}
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
