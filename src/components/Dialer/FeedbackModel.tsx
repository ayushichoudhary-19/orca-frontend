"use client";
import {
  Modal,
  Button,
  Textarea,
  Group,
  Text,
  Stack,
  Badge,
  Box,
} from "@mantine/core";
import { useState } from "react";
import { motion } from "framer-motion";
import { IconSend } from "@tabler/icons-react";
import { FeedbackData } from "@/hooks/useFeedback";

interface FeedbackModalProps {
  opened: boolean;
  onClose: () => void;
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
}: FeedbackModalProps) => {
  const [callOutcome, setCallOutcome] = useState<
    FeedbackData["callOutcome"] | ""
  >("");
  const [leadStatus, setLeadStatus] = useState<FeedbackData["leadStatus"] | "">(
    ""
  );
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!callOutcome || !leadStatus) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        callOutcome,
        leadStatus,
        notes: notes || undefined,
      });
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
        <Text className="text-xl font-semibold gradient-text">
          Call Feedback
        </Text>
      }
      centered
      radius="lg"
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      classNames={{
        content: "border border-white/10",
        header: "border-b border-white/10 pb-3",
      }}
    >
      <Stack gap="md">
        <Box>
          <Text fw={600} size="sm" mb={6}>
            What happened on the call? <span className="text-red-500">*</span>
          </Text>
          <Group gap="xs">
            {callOutcomes.map((option) => (
              <Badge
                key={option.value}
                variant={callOutcome === option.value ? "filled" : "light"}
                color={callOutcome === option.value ? "violet" : "gray"}
                onClick={() => setCallOutcome(option.value)}
                style={{
                  cursor: "pointer",
                  padding: "8px 14px",
                  border:
                    !callOutcome && isSubmitting
                      ? "1px solid #f87171"
                      : undefined,
                }}
              >
                {option.label}
              </Badge>
            ))}
          </Group>
        </Box>

        <Box>
          <Text fw={600} size="sm" mb={6}>
            Lead Status <span className="text-red-500">*</span>
          </Text>
          <Group gap="xs">
            {leadStatuses.map((status) => (
              <Badge
                key={status.value}
                variant={leadStatus === status.value ? "filled" : "light"}
                color={leadStatus === status.value ? "violet" : "gray"}
                onClick={() => setLeadStatus(status.value)}
                style={{
                  cursor: "pointer",
                  padding: "8px 14px",
                  border:
                    !leadStatus && isSubmitting
                      ? "1px solid #f87171"
                      : undefined,
                }}
              >
                {status.label}
              </Badge>
            ))}
          </Group>
        </Box>

        <Textarea
          label="Notes"
          placeholder="Type anything helpful here..."
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
          minRows={3}
          autosize
          maxRows={6}
        />

        <Group justify="right" mt="md">
          <Button variant="subtle" onClick={onClose} color="gray">
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSubmit}
              disabled={!callOutcome || !leadStatus}
              loading={isSubmitting}
              leftSection={<IconSend size={16} />}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              Submit Feedback
            </Button>
          </motion.div>
        </Group>
      </Stack>
    </Modal>
  );
};
