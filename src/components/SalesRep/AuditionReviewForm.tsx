"use client";
import { useState } from "react";
import { Button, Group } from "@mantine/core";
import { axiosClient } from "@/lib/axiosClient";
import CustomTextInput from "../Utils/CustomTextInput";

export default function AuditionReviewForm({
  campaignId,
  repId,
  onStatusChange,
}: {
  campaignId: string;
  repId: string;
  onStatusChange: (status: string) => void;
}) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (type: "approve" | "reject" | "retry") => {
    setLoading(true);
    const reasonPayload = { reason: feedback };

    try {
      const url = `/api/auditions/${campaignId}/reps/${repId}/${type}`;
      await axiosClient.put(url, reasonPayload);
      onStatusChange(type);
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Feedback
        </label>
      <CustomTextInput
        multiline = {true}
        rows={3}
        placeholder="Write a short reason (optional)"
        value={feedback}
        onChange={(e) => setFeedback(e.currentTarget.value)}
      />
      <Group>
        <Button 
        size="md" loading={loading} onClick={() => handleAction("approve")}>
          Approve
        </Button>
        <Button 
        size="md"
        color="#ED2641" loading={loading} onClick={() => handleAction("reject")}>
          Reject
        </Button>
        <Button
        size="md"
        color="#F59E0B"
        loading={loading} onClick={() => handleAction("retry")}>
          Ask for Retry
        </Button>
      </Group>
    </div>
  );
}
