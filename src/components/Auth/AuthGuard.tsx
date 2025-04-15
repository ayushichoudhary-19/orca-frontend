"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useFetchFeaturesByRole } from "uptut-rbac";
import { auth } from "@/lib/firebase-config";
import { toast } from "@/lib/toast";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authInitialized, setAuthInitialized] = useState(false);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const roleId = useAppSelector((state) => state.auth.roleId);

  const membership = useAppSelector((state) => state.membership.data);
  console.log("Redux membership state:", membership);
  const membershipLoading = useAppSelector((state) => state.membership.loading);

  useFetchFeaturesByRole(isAuthenticated && roleId ? roleId : "");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Firebase Auth User:", user.uid);
      } else {
        console.log("No Firebase Auth User");
      }
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (!authInitialized || !isAuthenticated) return;
    if (membershipLoading) return;
    if (!membership) {
      console.log("No membership found after loading");
      return;
    }

    const step = membership.onboardingStep;
    const isOnboardingPage = pathname.startsWith("/onboarding");

    console.log(`Enforcing onboarding flow for step ${step} at path ${pathname}`);

    if (step < 1 && pathname !== "/onboarding/step1") {
      router.replace("/onboarding/step1");
      return;
    }

    if (step === 1) {
      const isHub = pathname.includes("/onboarding/hub");
      const isCampaign = pathname.includes("/onboarding/campaign");
      if (!(isHub || isCampaign)) {
        router.replace("/onboarding/hub");
        return;
      }
    }

    if (
      step === 2 &&
      !pathname.includes("/onboarding/contacts") &&
      !pathname.includes("/onboarding/hub")
    ) {
      router.replace("/onboarding/hub");
      return;
    }

    if (
      step === 3 &&
      !pathname.includes("/onboarding/review-sign") &&
      !pathname.includes("/onboarding/hub")
    ) {
      router.replace("/onboarding/hub");
      return;
    }

    if (step >= 4 && isOnboardingPage) {
      toast.success("You're all set! Redirecting to dashboard 🎉");
      setTimeout(() => router.replace("/dashboard"), 1500);
      return;
    }
  }, [membership, membershipLoading, pathname, router, isAuthenticated, authInitialized]);

  if (!authInitialized || !isAuthenticated || (membershipLoading && !membership)) {
    // Only show loading if we're waiting for membership AND don't have it yet
    console.log('authInitialized', authInitialized)
    console.log('isAuthenticated', isAuthenticated)
    console.log('membershipLoading', membershipLoading)
    console.log('membership', membership)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
