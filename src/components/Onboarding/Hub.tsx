"use client";

import { useEffect, useState } from "react";
import { Button, Container, Title, Text } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { IconCircleCheck, IconCircleCheckFilled } from "@tabler/icons-react";
import { getDraftCampaignId, getStepFromDraft } from "@/utils/campaignUtils";
import { useCampaign } from "@/hooks/Campaign/useCampaign";
import { toast } from "@/lib/toast";
import { useAppSelector } from "@/store/hooks";
import dayjs from "dayjs";

export default function Hub() {
  const router = useRouter();
  const pathname = usePathname();
  const isCreateFlow = pathname.includes("/campaign/create");
  const { getById } = useCampaign();

  const onboardingStep = useAppSelector((state) => state.business.data?.onboardingStep || 0);

  useEffect(() => {
    const fetchStep = async () => {
      if (isCreateFlow) {
        const campaignId = getDraftCampaignId();
        if (!campaignId) {
          toast.error("No campaign found");
          return;
        }
      }
    };
    fetchStep();
  }, []);

  return (
    <Container size="sm" className="pt-8 pb-20">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Title order={2}>{isCreateFlow ? "Campaign Setup" : "Welcome"}</Title>
          <Text c="dimmed" size="xs">
            {dayjs().format("ddd, MMM D · h:mm A")}
          </Text>
        </div>

        <div
          className="bg-[#F4F2FF] rounded-lg px-6 py-4 mt-4"
          style={{ border: "1px solid #B0A4FD" }}
        >
          <Text fw={600} className="text-[18px] mb-1 text-[#0C0A1C]">
            {isCreateFlow
              ? "Let's set up your campaign 🚀"
              : "We're a sales game changer for a reason 🥳🥳"}
          </Text>
          <Text size="sm" c="#555461" mb="md">
            {isCreateFlow
              ? "Follow these steps to configure your campaign settings and get ready to launch"
              : "Get a quick overview of how ORCA works and why it's changing the sales performance space by watching the demo video to the left."}
          </Text>
          <div className="flex flex-wrap gap-2">
            {[
              "Auto-dialer",
              "AI content generation",
              "Data enrichment",
              "Analytics",
              "24 / 7 customer service",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs rounded-md text-[#0C0A1C] px-3 py-1 bg-transparent flex items-center gap-2"
                style={{ border: "1px solid #E7E7E9" }}
              >
                <IconCircleCheck size={14} className="text-dark" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <HubItem
          title={isCreateFlow ? "Campaign details" : "Start your first campaign"}
          done={onboardingStep > 1}
          onClick={() => router.push(isCreateFlow ? "/campaign/create" : "/onboarding/campaign")}
        />
        <HubItem
          title={"About your contacts"}
          done={onboardingStep > 2}
          disabled={onboardingStep < 2}
          onClick={() =>
            router.push(isCreateFlow ? "/campaign/create?step=contacts" : "/onboarding/contacts")
          }
        />
        <HubItem
          title={"Review & sign"}
          done={onboardingStep > 3}
          disabled={onboardingStep < 3}
          onClick={() =>
            router.push(isCreateFlow ? "/campaign/create?step=review" : "/onboarding/review-sign")
          }
        />
      </div>
    </Container>
  );
}

function HubItem({
  title,
  done,
  onClick,
  disabled,
}: {
  title: string;
  done: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-between items-center border border-[#E7E7E9] rounded-lg py-4 px-5">
      <div className="flex items-center gap-2">
        {done ? (
          <IconCircleCheckFilled size={24} className="text-[#6D57FC]" stroke={1.5} />
        ) : (
          <IconCircleCheck size={24} className="text-[#6D6C77]" stroke={1.5} />
        )}
        <Text fw={500}>{title}</Text>
      </div>

      <Button
        radius="md"
        size="sm"
        variant={done ? "outline" : "filled"}
        color={disabled ? "gray" : "primary"}
        onClick={done ? () => {} : onClick}
        disabled={disabled}
        className={done ? "cursor-not-allowed" : ""}
      >
        {done ? "Completed" : "Start"}
      </Button>
    </div>
  );
}
