import { useState } from 'react';
import { Modal, Rating, Textarea, Button, Stack, Text } from '@mantine/core';
import { useFeedback } from '@/hooks/useFeedback';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  callId: string;
  callDuration: number;
}

export function FeedbackModal({ isOpen, onClose, callId, callDuration }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const { submitFeedback, isSubmitting, error } = useFeedback();

  const handleSubmit = async () => {
    try {
      await submitFeedback({
        callId,
        rating,
        notes,
        callDuration
      });
      onClose();
      setRating(0);
      setNotes('');
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Call Feedback"
      centered
    >
      <Stack gap="md">
        <div>
          <Text size="sm" fw={500} mb="xs">How was the call quality?</Text>
          <Rating
            value={rating}
            onChange={setRating}
            size="lg"
          />
        </div>

        <Textarea
          label="Additional Notes"
          placeholder="Any comments about the call?"
          value={notes}
          onChange={(event) => setNotes(event.currentTarget.value)}
          minRows={3}
        />

        {error && (
          <Text color="red" size="sm">
            {error}
          </Text>
        )}

        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={rating === 0}
          fullWidth
        >
          Submit Feedback
        </Button>
      </Stack>
    </Modal>
  );
}