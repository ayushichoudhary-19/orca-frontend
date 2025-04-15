"use client";

import { useEffect, useState } from "react";
import { Button, Container, Title, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconCircleCheck, IconCircleCheckFilled } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useFetchMembership } from "@/hooks/Membership/useFetchMembership";

export default function Hub() {
  const router = useRouter();
  const { membership } = useFetchMembership();
  const [onboardingStep, setStep] = useState<number>(0);

  useEffect(() => {
    if (membership) {
      setStep(membership.onboardingStep || 0);
    }
  }, [membership]);

  return (
    <Container size="sm" className="pt-8 pb-20">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Title order={2}>Welcome</Title>
          <Text c="dimmed" size="xs">
            {dayjs().format("ddd, MMM D · h:mm A")}
          </Text>
        </div>

        <div
          className="bg-[#F4F2FF] rounded-lg px-6 py-4 mt-4"
          style={{ border: "1px solid #B0A4FD" }}
        >
          <Text fw={600} className="text-[18px] mb-1 text-[#0C0A1C]">
            {"We're a sales game changer for a reason 🥳🥳"}
          </Text>
          <Text size="sm" c="#555461" mb="md">
            Get a quick overview of how ORCA works and why it’s changing the sales performance space
            by watching the demo video to the left.
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

      {/* Step Items */}
      <div className="space-y-5">
        <HubItem
          title="Start your first campaign"
          done={onboardingStep > 1}
          onClick={() => router.push("/onboarding/campaign")}
        />
        <HubItem
          title="About your contacts"
          done={onboardingStep > 2}
          disabled={onboardingStep < 2}
          onClick={() => router.push("/onboarding/contacts")}
        />
        <HubItem
          title="Review & sign"
          done={onboardingStep > 3}
          disabled={onboardingStep < 3}
          onClick={() => router.push("/onboarding/review-sign")}
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
