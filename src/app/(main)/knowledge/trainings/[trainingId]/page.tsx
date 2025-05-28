"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosClient } from "@/lib/axiosClient";
import { Container, Text, Divider, Anchor, Button } from "@mantine/core";
import { toast } from "@/lib/toast";
import Loader from "@/components/Utils/Loader";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import TrainingEditor from "@/components/Training/TrainingEditor";

export default function TrainingEditorPage() {
  const { trainingId } = useParams();
  const [trainingData, setTrainingData] = useState({
    title: "Untitled Training",
    content: null as any[] | null,
    savedAt: null as string | null,
  });
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const router = useRouter();

  const handleUpload = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axiosClient.post('/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Return the URL of the uploaded image
      return response.data.url;
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Image upload error:', error);
      return null;
    }
  }, []);

  // Fetch training content
  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await axiosClient.get(`/api/trainings/${trainingId}`);
        setTrainingData({
          title: res.data.title || "Untitled Training",
          content: res.data.content || [],
          savedAt: res.data.lastSavedAt || res.data.createdAt || null
        });
      } catch (err) {
        toast.error("Failed to load training content.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (trainingId) fetchTraining();
  }, [trainingId]);

  // Create editor with initial content and image upload capability
  const editor = useCreateBlockNote({
    initialContent: trainingData.content || undefined,
    uploadFile: handleUpload
  });

  // Update editor content when new data is loaded
  useEffect(() => {
    if (editor && trainingData.content) {
      editor.replaceBlocks(editor.document, trainingData.content);
    }
  }, [editor, trainingData.content]);

  const handleContentChange = (content: any) => {
    setCurrentContent(content);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    
    try {
      await axiosClient.put(`/api/trainings/${trainingId}`, { content: currentContent });
      toast.success("Training updated successfully.");
      setTrainingData((prev) => ({ ...prev, savedAt: new Date().toISOString() }));
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
          <Anchor href="/knowledge/trainings" underline="hover" style={{ color: "gray" }}>
            Trainings
          </Anchor>
          <span className="mx-1 text-gray-400">/</span>
          <Anchor href="/knowledge/trainings">{trainingData.title}</Anchor>
        </Text>

        <Text className="text-2xl font-bold my-3 text-darker">{trainingData.title}</Text>
        <Divider my="sm" />
        <Text size="sm" className="mb-4" color="dimmed">
          Last saved: {trainingData.savedAt ? new Date(trainingData.savedAt).toLocaleString() : "Unknown"}
        </Text>

        <div className="mb-4 border rounded-lg p-2">
          <TrainingEditor
            content={trainingData.content}
            onSave={handleSave}
            handleUpload={handleUpload}
            onChange={handleContentChange}
          />
        </div>
      </Container>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end space-x-4" style={{ boxShadow: "0px -2px 10px rgba(0,0,0,0.1)" }}>
        <Button
          variant="light"
          color="gray"
          onClick={() => router.push("/knowledge/trainings")}
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          {hasChanges ? "Save Changes" : "Saved"}
        </Button>
      </div>
    </>
  );
}