"use client";

import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/axiosClient";
import {
  Stack,
  Text,
  Paper,
  Button,
  Group,
  Loader,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "react-hot-toast";
import CustomTextInput from "@/components/Utils/CustomTextInput";

interface Question {
  _id: string;
  question: string;
}

export default function SalesRepAuditionForm() {
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [campaign, setCampaign] = useState<{ campaignName: string } | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const salesRepId = useSelector((state: RootState) => state.auth.user?.uid);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes, campaignRes] = await Promise.all([
          axiosClient.get(`/api/auditions/${campaignId}/questions`),
          axiosClient.get(`/api/campaign/${campaignId}`),
        ]);

        setQuestions(questionsRes.data);
        setCampaign(campaignRes.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load audition data.");
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) fetchData();
  }, [campaignId]);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    const formatted = Object.entries(responses).map(([questionId, audioUrl]) => ({
      questionId,
      audioUrl,
    }));

    if (formatted.some((r) => !r.audioUrl)) {
      toast.error("Please provide all audio links.");
      return;
    }

    setSubmitting(true);
    try {
      await axiosClient.post(`/api/auditions/${campaignId}/submit`, { 
        salesRepId,
        responses: formatted });
      toast.success("Audition submitted successfully!");
    } catch (err) {
        console.log(err);
      toast.error("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Group justify="center" mt="xl">
        <Loader />
      </Group>
    );
  }

  return (
    <Stack gap="xl" p="xl" maw={700} mx="auto">
      {/* Campaign Header */}
      <Paper withBorder p="md" radius="md" className="bg-gray-50 shadow-sm transition-all duration-200">
        <Text size="xl" fw={600} className="mb-2">
          Campaign: {campaign?.campaignName}
        </Text>
        <Text size="sm" c="dimmed" className="leading-relaxed">
          Please upload your answers for each audition question below.
        </Text>
      </Paper>

      {/* Questions */}
      {questions.map((q, index) => (
        <Paper 
          key={q._id} 
          withBorder 
          p="xl" 
          radius="md" 
          className="bg-white hover:shadow-sm transition-all duration-200"
        >
          <Text fw={400} mb="md" className="text-md">
            Q{index + 1}: {q.question}
          </Text>
          <CustomTextInput
            placeholder="Paste your audio URL here"
            value={responses[q._id] || ""}
            onChange={(e) => handleResponseChange(q._id, e.target.value)}
            className="mt-2"
          />
        </Paper>
      ))}

      <Button
        h={50}
        loading={submitting}
        onClick={handleSubmit}
        className="font-normal text-md hover:opacity-90 transition-opacity duration-200"
        disabled={questions.length === 0}
        fullWidth
      >
        Submit Audition
      </Button>
    </Stack>
  );
}
