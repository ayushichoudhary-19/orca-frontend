"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function OnboardingIndexPage() {
  const router = useRouter();

  const membership = useAppSelector((state) => state.membership.data);
  const loading = useAppSelector((state) => state.membership.loading);
  const step = membership?.onboardingStep ?? null;

  useEffect(() => {
    if (loading || step === null) return;

    if (step < 1) router.replace("/onboarding/step1");
    else if (step === 1) router.replace("/onboarding/campaign");
    else if (step === 2) router.replace("/onboarding/contacts");
    else if (step === 3) router.replace("/onboarding/review-sign");
    else router.replace("/dashboard");
  }, [step, loading, router]);

  return null;
}
