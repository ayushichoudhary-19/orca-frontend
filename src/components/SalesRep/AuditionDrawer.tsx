"use client";
import { useEffect, useState } from "react";
import { Drawer, Text, Divider, Loader } from "@mantine/core";
import AuditionResponseList from "./AuditionResponseList";
import AuditionReviewForm from "./AuditionReviewForm";
import { axiosClient } from "@/lib/axiosClient";

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
  const [responses, setResponses] = useState<{ questionId: string; questionText: string; audioUrl: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      if (!rep) return;

      try {
        const questionsRes = await axiosClient.get(`/api/auditions/${campaignId}/questions`);
        const questionMap = Object.fromEntries(
          questionsRes.data.map((q: any) => [q._id, q.question])
        );

        const statusRes = await axiosClient.get(`/api/auditions/${campaignId}/status`);
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
    <Drawer opened={opened} onClose={onClose} size="lg" title={`Review ${rep?.salesRepId.fullName}`} position="right">
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Loader />
        </div>
      ) : (
        <>
          <Text fw={600} size="lg">Audio Responses</Text>
          <AuditionResponseList responses={responses} />

          <Divider my="md" />
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
