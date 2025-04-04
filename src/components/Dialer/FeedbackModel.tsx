'use client';
import { Modal, Button, Textarea, NumberInput } from '@mantine/core';
import { useState } from 'react';

interface FeedbackModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (feedback: { rating: number; notes?: string }) => void;
}

export const FeedbackModal = ({ opened, onClose, onSubmit }: FeedbackModalProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (rating !== null) {
      onSubmit({ rating, notes });
      setRating(null);
      setNotes('');
      onClose();
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Submit Call Feedback" centered>
      <NumberInput
        label="Rating (1-5)"
        value={rating || undefined}
        onChange={(value) => setRating(Number(value))}
        min={1}
        max={5}
        required
      />
      <Textarea
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.currentTarget.value)}
        mt="md"
        autosize
        minRows={3}
      />
      <Button fullWidth mt="lg" onClick={handleSubmit} disabled={rating === null}>
        Submit Feedback
      </Button>
    </Modal>
  );
};
