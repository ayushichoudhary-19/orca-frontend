"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { axiosClient } from "@/lib/axiosClient";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Button } from "@mantine/core";

const BlockNoteViewer = dynamic(() => import("@/components/Training/BlockNoteViewer"), {
  ssr: false,
});

interface TrainingContent {
  _id: string;
  campaignId: string;
  type: string;
  title: string;
  description: string;
  content: any;
}

export default function TrainingContentPage() {
  const [training, setTraining] = useState<TrainingContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const salesRepId = useSelector((state: RootState) => state.auth.user?.uid);
  const trainingId = usePathname().split("/").pop();
  const campaignId = usePathname().split("/")[2];

  useEffect(() => {
    const fetchTrainingContent = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get(`/api/trainings/content/${trainingId}`);
        setTraining(response.data);
      } catch (error) {
        console.error("Failed to fetch training content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainingContent();
  }, [trainingId]);

  const markComplete = async () => {
    try {
      setIsCompleting(true);
      await axiosClient.post(`/api/trainings/complete/${trainingId}`, { salesRepId });
      window.location.href = `/campaigns/${campaignId}/training`;
    } catch (error) {
      console.error("Failed to mark training complete:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D57FC]" />
      </div>
    );
  }

  if (!training) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Training content not found</h1>
        <Link
          href={`/campaigns/${campaignId}/training`}
          className="inline-flex items-center gap-2 text-gray-600 mb-6"
          style={{
            fontWeight: "500",
            color: "gray",
            textDecoration: "none",
            transition: "color 0.3s",
            cursor: "pointer",
          }}
        >
          <IconArrowLeft size={18} />
          Back to trainings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href={`/campaigns/${campaignId}/training`}
          className="inline-flex items-center gap-2 text-gray-600 mb-6"
          style={{
            fontWeight: "500",
            color: "gray",
            textDecoration: "none",
            transition: "color 0.3s",
            cursor: "pointer",
          }}
        >
          <IconArrowLeft size={18} />
          Back to trainings
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg p-8 mb-6">
            <h1 className="text-2xl font-bold mb-4">{training.title}</h1>
            <p className="text-gray-600 mb-8">{training.description}</p>

            <div className="border-t border-gray-200 pt-6">
              <BlockNoteViewer content={training.content} />
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={markComplete}
                disabled={isCompleting}
                className="px-6 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-70"
              >
                {isCompleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <IconCheck size={18} />
                    Mark as Complete
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
