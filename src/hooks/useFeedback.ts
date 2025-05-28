import { useState } from "react";
import { axiosClient } from "@/lib/axiosClient";

export type FeedbackReason =
  | "tentative_interest"
  | "no_pickup"
  | "not_interested"
  | "not_qualified"
  | "bad_data";

export interface FeedbackData {
  callId: string;
  feedbackReason: FeedbackReason;
  notes?: string;
}

export const useFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api`

  const submitFeedback = async (data: FeedbackData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await axiosClient.post(`${API_BASE_URL}/calls/feedback`, data);
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitFeedback,
    isSubmitting,
    error,
  };
};
