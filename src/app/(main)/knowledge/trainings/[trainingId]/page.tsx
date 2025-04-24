"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { JSONContent } from "@tiptap/core";
import { axiosClient } from "@/lib/axiosClient";
import { Container, Text, Divider, Anchor } from "@mantine/core";
import { toast } from "@/lib/toast";
import TrainingRichEditor from "@/components/Training/TrainingEditor";
import Loader from "@/components/Utils/Loader";

interface TrainingData {
  title: string;
  content?: JSONContent;
  lastSavedAt?: string;
  createdAt?: string;
}

export default function TrainingEditorPage() {
  const { trainingId } = useParams();
  const [training, setTraining] = useState<TrainingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await axiosClient.get(`/api/trainings/${trainingId}`);
        setTraining(res.data);
      } catch (err) {
        toast.error("Failed to load training content.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (trainingId) {
      fetchTraining();
    }
  }, [trainingId]);

  const handleSave = async ({ content }: { content: JSONContent }) => {
    try {
      await axiosClient.put(`/api/trainings/${trainingId}`, { content });
      toast.success("Training updated successfully.");
    } catch (err) {
      toast.error("Failed to save changes.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container size="lg" className="py-8">
        <Loader />
      </Container>
    );
  }

  const savedAt = training?.lastSavedAt || training?.createdAt;
  const formattedDate = savedAt ? new Date(savedAt).toLocaleString() : "Unknown";

  return (
    <Container size="lg" className="py-4">
     <div>

<Text size="sm" className="text-gray-500 mb-2">
  <Anchor href="/knowledge/trainings" underline="hover"
    style={{ color: "gray"}}
  >
    Trainings
  </Anchor>
  <span className="mx-1 text-gray-400">/</span>
  <Anchor href="/knowledge/trainings">
    {training?.title || "Untitled Training"}
  </Anchor>
</Text>

      </div>
      <Text className="text-2xl font-bold my-3 text-darker">
        {training?.title || "Untitled Training"}
      </Text>
      <Divider my="sm" />
      <Text size="sm" className="mb-4" color="dimmed">
        Last saved: {formattedDate}
      </Text>

      <TrainingRichEditor initialContent={training?.content} onSave={handleSave} />
    </Container>
  );
}
