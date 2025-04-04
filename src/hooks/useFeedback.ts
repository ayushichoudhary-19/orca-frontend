import { useState } from "react";
import axios from "axios";

export interface FeedbackData {
  callId: string;
  callOutcome: "ANSWERED" | "WENT_TO_VOICEMAIL" | "NO_ANSWER" | "CALL_DROPPED" | "TECHNICAL_ISSUE" | "WRONG_NUMBER";
  leadStatus: "HIGH_POTENTIAL" | "WARM_LEAD" | "COLD_LEAD" | "NOT_A_FIT" | "USING_COMPETITOR";
  notes?: string;
}

export const useFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = "http://localhost:8080/api";

  const submitFeedback = async (data: FeedbackData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post(`${API_BASE_URL}/calls/feedback`, data);
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
