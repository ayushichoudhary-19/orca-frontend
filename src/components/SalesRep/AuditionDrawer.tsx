"use client";
import { useEffect, useState } from "react";
import { Drawer, Text, Divider, Loader, Group, Paper, Title, Button } from "@mantine/core";
import AuditionResponseList from "./AuditionResponseList";
import AuditionReviewForm from "./AuditionReviewForm";
import { axiosClient } from "@/lib/axiosClient";
import {
  IconMail,
  IconPhone,
  IconBrandLinkedin,
  IconMapPin,
  IconLanguage,
  IconLink,
} from "@tabler/icons-react";

type Language = {
  language: string;
  proficiency: string;
};

export async function uploadAudioBlob(blob: Blob): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("audio", blob, `recording-${Date.now()}.webm`);

    const res = await axiosClient.post("/api/audio/upload", {
      formData,
    });

    const data = await res.data;
    return data.key;
  } catch (err) {
    console.error("Audio upload failed:", err);
    return null;
  }
}

export default function AuditionReviewDrawer({
  opened,
  onClose,
  campaignId,
  rep,
  onStatusChange,
}: {
  opened: boolean;
  onClose: () => void;
  campaignId: string;
  rep: any;
  onStatusChange: (status: string) => void;
}) {
  const [responses, setResponses] = useState<
    { questionId: string; questionText: string; audioUrl: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      if (!rep) return;

      try {
        const questionsRes = await axiosClient.get(`/api/auditions/${campaignId}/questions`);
        const questionMap = Object.fromEntries(
          questionsRes.data.map((q: any) => [q._id, q.question])
        );

        const statusRes = await axiosClient.get(`/api/auditions/${campaignId}/status/${rep?.salesRepId?._id}`);
        const parsed = statusRes.data?.auditionResponses?.map((r: any) => ({
          ...r,
          questionText: questionMap[r.questionId] || "Question not found",
        }));

        setResponses(parsed || []);
      } catch (err) {
        console.error("Error loading audition data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (opened) fetchResponses();
  }, [opened, rep, campaignId]);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      size="lg"
      title={`Review ${rep?.salesRepId.salesRepProfile?.fullName || "Rep"}`}
      position="right"
    >
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      ) : (
        <>
          <Title className="font-bold text-darker m-2 p-2">
            {rep?.salesRepId.salesRepProfile?.fullName}
          </Title>
          {/* Contact Info Section */}
          <Paper p="md" radius="md" withBorder className="mb-4">
            <Text fw={600} size="md" className="mb-3">
              Contact Information
            </Text>

            {rep.resumeUrl && (
              <Group gap="xs mb-5">
                <a
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/api/uploads/stream/${rep.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  <Button size="xs" className="hover:underline-none text-sm">
                    View Resume
                  </Button>
                </a>
              </Group>
            )}

            <div className="space-y-3 mt-5">
              <Group gap="xs">
                <IconMail size={18} stroke={1.5} className="text-gray-600" />
                <Text size="sm" className="text-gray-700">
                  {rep.salesRepId.email}
                </Text>
              </Group>

              <Group gap="xs">
                <IconPhone size={18} stroke={1.5} className="text-gray-600" />
                <Text size="sm" className="text-gray-700">
                  {rep.salesRepId.salesRepProfile?.phoneNumber}
                </Text>
              </Group>

              <Group gap="xs">
                <IconBrandLinkedin size={18} stroke={1.5} className="text-gray-600" />
                {rep.linkedInUrl ? (
                  <a
                    href={rep.linkedInUrl}
                    target="_blank"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {rep.linkedInUrl}
                  </a>
                ) : (
                  <Text size="sm" className="text-gray-700">
                    Not Available
                  </Text>
                )}
              </Group>

              <Group gap="xs">
                <IconMapPin size={18} stroke={1.5} className="text-gray-600" />

                <Text size="sm" className="text-gray-700">
                  {rep.country ? rep.country : "Not Available"}
                </Text>
              </Group>

              <Group gap="xs" align="flex-start">
                <IconLanguage size={18} stroke={1.5} className="text-gray-600 mt-0.5" />
                <Text size="sm" className="text-gray-700">
                  {rep.salesRepId.salesRepProfile?.languages
                    ?.map((l: Language) => `${l.language} (${l.proficiency})`)
                    .join(", ") || "N/A"}
                </Text>
              </Group>
            </div>
          </Paper>

          <Divider my="md" />

          {/* Audio */}
          <Text fw={600} size="lg" className="mb-3">
            Audio Responses
          </Text>
          <AuditionResponseList responses={responses} />

          <Divider my="md" />

          {/* Approve/Reject Form */}
          <AuditionReviewForm
            campaignId={campaignId}
            repId={rep.salesRepId._id}
            onStatusChange={(status) => {
              onStatusChange(status);
              onClose();
            }}
          />
        </>
      )}
    </Drawer>
  );
}
