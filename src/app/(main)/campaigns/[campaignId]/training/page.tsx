"use client";

import { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconCheck,
  IconBuildingSkyscraper,
  IconDeviceDesktop,
  IconUsers,
  IconChartBar,
  IconListCheck,
  IconMessageCircle2,
  IconPlayerPlay,
} from "@tabler/icons-react";
import Link from "next/link";
import { axiosClient } from "@/lib/axiosClient";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Button, Text } from "@mantine/core";
import { usePathname } from "next/navigation";

interface Training {
  _id: string;
  campaignId: string;
  type?: string;
  title: string;
  description: string;
  content: any;
  isVisible: boolean;
  isPublished: boolean;
  sortOrder: number;
  lastSavedAt: Date;
  lastEditedBy: string;
}

interface TrainingProgress {
  progress: number;
  completedTrainingIds: string[];
}

export default function TrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [progress, setProgress] = useState<TrainingProgress>({
    progress: 0,
    completedTrainingIds: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const salesRepId = useSelector((state: RootState) => state.auth.user?.uid);
  const campaignId = usePathname().split("/")[2];

  const trainingIcons: Record<string, JSX.Element> = {
    company_overview: <IconBuildingSkyscraper size={24} />,
    product_overview: <IconDeviceDesktop size={24} />,
    buyer_persona: <IconUsers size={24} />,
    competition: <IconChartBar size={24} />,
    qualification_criteria: <IconListCheck size={24} />,
    objection_handling: <IconMessageCircle2 size={24} />,
    custom: <IconMessageCircle2 size={24} />,
  };

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setIsLoading(true);

        const trainingsResponse = await axiosClient.get(`/api/trainings/${campaignId}/sdr`);
        const fetchedTrainings = trainingsResponse.data;

        let fetchedProgress: TrainingProgress = {
          progress: 0,
          completedTrainingIds: [],
        };

        try {
          const progressResponse = await axiosClient.get(
            `/api/trainings/progress/${campaignId}/${salesRepId}`
          );
          fetchedProgress = progressResponse.data;
        } catch (err: any) {
          if (err.response?.status === 404 || err.response?.status === 500) {
            console.warn("No progress record found, using empty state.");
          } else {
            throw err;
          }
        }

        const trainingsWithIcons = fetchedTrainings.map((training: Training) => ({
          ...training,
          icon: trainingIcons[training.type || "custom"],
        }));

        setTrainings(trainingsWithIcons);
        setProgress(fetchedProgress);
      } catch (error) {
        console.error("Failed to fetch trainings or progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainings();
  }, [campaignId, salesRepId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D57FC]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href={`/campaigns/${campaignId}`}>
          <div className="inline-flex gap-2 justify-center items-center text-tinteddark6 hover:text-tinteddark8">
            <IconArrowLeft size={18} />
            Back
          </div>
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-0 mb-0">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold text-darker">
                {progress.completedTrainingIds.length} of {trainings.length} Steps Completed
              </h1>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div
                className="bg-[#6D57FC] h-2.5 rounded-full"
                style={{ width: `${progress.progress}%` }}
              >
                <span className="sr-only">Progress</span>
              </div>
            </div>

            <div className="mb-6">
              <Text className="text-xl font-bold m-0">Get Started</Text>
              <p className="text-tinteddark5 m-0">
                Complete each training section to understand the product background and campaign
                requirements
              </p>
            </div>

            <div className="space-y-6">
              {trainings.map((training) => (
                <div
                  key={training._id}
                  className="bg-white rounded-lg p-6"
                  style={{
                    border: "1px solid #E4E4E7",
                  }}
                >
                  <div className="flex justify-between">
                    <div className="flex gap-6 items-center">
                      {/* <div className="flex-shrink-0">{training.icon}</div> */}
                      <div>
                        <h3 className="text-lg font-bold mb-1 m-0">{training.title}</h3>
                        <p className="text-gray-600 m-0">{training.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {progress.completedTrainingIds.includes(training._id) ? (
                        <Link
                          href={`/campaigns/${campaignId}/training/${training._id}`}
                          className="no-underline"
                        >
                          <Button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md flex items-center gap-2">
                            <IconCheck size={18} className="text-white mr-2" />
                            Review
                          </Button>
                        </Link>
                      ) : (
                        <Link
                          href={`/campaigns/${campaignId}/training/${training._id}`}
                          className="no-underline"
                        >
                          <Button className="px-4 py-2 rounded-md">
                            <IconPlayerPlay size={18} className="text-white mr-2" />
                            Start
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {progress.completedTrainingIds.length === trainings.length && (
              <div className="mt-8 flex justify-center">
                <Link href={`/campaigns/${campaignId}/apply`} className="no-underline">
                  <Button size="md" className="">
                    Submit Application
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
