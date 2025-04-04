import { useState } from 'react';
import axios from 'axios';

interface FeedbackData {
  callId: string;
  rating: number;
  notes: string;
  callDuration: number;
}

export const useFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = 'http://localhost:8080/api';

  const submitFeedback = async (data: FeedbackData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post(`${API_BASE_URL}/calls/feedback`, {
        callId: data.callId,
        rating: data.rating,
        notes: data.notes,
        duration: data.callDuration
      });
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitFeedback,
    isSubmitting,
    error
  };
};