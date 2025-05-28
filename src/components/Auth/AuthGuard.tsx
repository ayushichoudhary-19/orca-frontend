"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { auth } from "@/lib/firebase";
import { toast } from "@/lib/toast";
import { signOut } from "firebase/auth";
import Loader from "../Utils/Loader";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authInitialized, setAuthInitialized] = useState(false);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const membership = useAppSelector((state) => state.membership.data);
  const membershipLoading = useAppSelector((state) => state.membership.loading);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authInitialized || !isAuthenticated || membershipLoading) return;

    if (!membership || !membership.roleId) {
      toast.error("Your session is invalid. Please log in again.");
      signOut(auth).then(() => {
        router.replace("/signin");
      });
      return;
    }

    const hasBusiness = !!membership.businessId;
    const step = membership.onboardingStep || 0;
    const isOnboardingPage = pathname.startsWith("/onboarding");

    if (hasBusiness) {
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
      }
    }
  }, [authInitialized, isAuthenticated, membership, membershipLoading, pathname, router]);

  if (!authInitialized || !isAuthenticated || !membership) {
    console.log("Still waiting", {
      authInitialized,
      isAuthenticated,
      membershipLoading,
      membership,
    });
    return <Loader />;
  }
  

  return <>{children}</>;
}
