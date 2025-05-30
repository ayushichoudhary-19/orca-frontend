"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosClient } from "@/lib/axiosClient";
import { Container, Text, Divider, Anchor, Button } from "@mantine/core";
import { toast } from "@/lib/toast";
import Loader from "@/components/Utils/Loader";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import TrainingEditor from "@/components/Training/TrainingEditor";

export default function TrainingEditorPage() {
  const { trainingId } = useParams();
  const [trainingData, setTrainingData] = useState<{
    title: string;
    content: any[] | null;
    savedAt: string | null;
  }>({
    title: "Untitled Training",
    content: null,
    savedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentContent, setCurrentContent] = useState<any[] | null>(null);
  const router = useRouter();

  const handleUpload = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosClient.post('/api/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.url;
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Image upload error:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchTraining = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/api/trainings/${trainingId}`);
        const rawFetchedContent = res.data.content;
        let processedBlocks: any[] = [];

        if (Array.isArray(rawFetchedContent)) {
          processedBlocks = rawFetchedContent;
        } else if (
          rawFetchedContent &&
          typeof rawFetchedContent === 'object' &&
          rawFetchedContent.type === 'doc' &&
          Array.isArray(rawFetchedContent.content)
        ) {
          processedBlocks = rawFetchedContent.content;
        } else if (rawFetchedContent === null || rawFetchedContent === undefined) {
          processedBlocks = [];
        } else if (rawFetchedContent) {
          console.warn(
            "Fetched training content is in an unexpected non-array, non-doc format:",
            rawFetchedContent
          );
          processedBlocks = [];
        }

        setTrainingData({
          title: res.data.title || "Untitled Training",
          content: processedBlocks,
          savedAt: res.data.lastSavedAt || res.data.createdAt || null,
        });
        setCurrentContent(processedBlocks);

      } catch (err) {
        toast.error("Failed to load training content.");
        console.error(err);
        setTrainingData((prev) => ({ ...prev, content: [] }));
        setCurrentContent([]);
      } finally {
        setLoading(false);
      }
    };

    if (trainingId) fetchTraining();
  }, [trainingId]);

  const handleContentChange = (newEditorContent: any[]) => {
    setCurrentContent(newEditorContent);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges || currentContent === null) return;
    try {
      const contentToSave = Array.isArray(currentContent) ? currentContent : [];
      await axiosClient.put(`/api/trainings/${trainingId}`, { content: contentToSave });
      toast.success("Training updated successfully.");
      setTrainingData((prev) => ({ ...prev, content: contentToSave, savedAt: new Date().toISOString() }));
      setHasChanges(false);
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

  return (
    <>
      <Container size="lg" className="py-4 pb-24">
        <Text size="sm" className="text-gray-500 mb-2">
          <Anchor href="/knowledge/trainings">Trainings</Anchor>
          <span className="mx-1 text-gray-400">/</span>
          <Anchor href={`/knowledge/trainings/${trainingId}`}>{trainingData.title}</Anchor>
        </Text>
        <Text className="text-2xl font-bold my-3 text-darker">{trainingData.title}</Text>
        <Divider my="sm" />
        <Text size="sm" className="mb-4" color="dimmed">
          Last saved: {trainingData.savedAt ? new Date(trainingData.savedAt).toLocaleString() : "Not saved yet"}
        </Text>

        <div className="mb-4 border rounded-lg p-2">
          <TrainingEditor
            content={trainingData.content}
            handleUpload={handleUpload}
            onChange={handleContentChange}
          />
        </div>
      </Container>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end space-x-4" style={{ boxShadow: "0px -2px 10px rgba(0,0,0,0.1)" }}>
        <Button variant="light" color="gray" onClick={() => router.push("/knowledge/trainings")}>
          Cancel
        </Button>
        <Button variant="filled" onClick={handleSave} disabled={!hasChanges || loading}>
          {hasChanges ? "Save Changes" : "Saved"}
        </Button>
      </div>
    </>
  );
}