import { useState } from 'react';
import axios from 'axios';

interface FeedbackData {
  callId: string;
  rating: number;
  notes?: string;
  callDuration: number;
}

export const useFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = async (data: FeedbackData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8080/api/calls/feedback', data);
      return response.data;
    } catch (err) {
      setError('Failed to submit feedback');
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