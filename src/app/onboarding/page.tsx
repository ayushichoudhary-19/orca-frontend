"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/hooks/Business/useBusiness";
import { toast } from "@/lib/toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function OnboardingIndexPage() {
  const router = useRouter();
  const { getById } = useBusiness();
  const user = useSelector((state: RootState) => state.auth.user);
  const businessId = user?.businessId;
  const [step, setStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStep = async () => {
      try {
        const business = await getById(businessId || "");
        setStep(business?.onboardingStep ?? 0);
      } catch (err) {
        toast.error("Failed to fetch onboarding step.");
      } finally {
        setLoading(false);
      }
    };
    fetchStep();
  }, []);

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
