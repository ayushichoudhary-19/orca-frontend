"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { auth } from "@/lib/firebase";
import { toast } from "@/lib/toast";
import { signOut } from "firebase/auth";
import Loader from "../Utils/Loader";
import { useBusiness } from "@/hooks/Business/useBusiness";
import { setBusiness, setLoading as setBusinessLoading } from "@/store/businessSlice";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authInitialized, setAuthInitialized] = useState(false);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const business = useAppSelector((state) => state.business.data);
  const loadingBusiness = useAppSelector((state) => state.business.loading);
  const businessId = user?.businessId;

  const dispatch = useAppDispatch();
  const { getById } = useBusiness();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => setAuthInitialized(true));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!businessId || user?.role === "sdr") return;
      try {
        dispatch(setBusinessLoading(true));
        const biz = await getById(businessId);
        dispatch(setBusiness(biz));
      } catch {
        toast.error("Failed to fetch business info");
      } finally {
        dispatch(setBusinessLoading(false));
      }
    };

    if (authInitialized && isAuthenticated && user?.role !== "sdr") {
      fetchBusiness();
    }
  }, [authInitialized, isAuthenticated, user]);

  useEffect(() => {
    if (!authInitialized || !isAuthenticated || !user || user.role === "sdr") return;

    const manuallyLoggedOut = localStorage.getItem("manualLogout") === "true";
    if (!user.role) {
      if (!manuallyLoggedOut) toast.error("Your session is invalid. Please log in again.");
      localStorage.removeItem("manualLogout");
      signOut(auth).then(() => router.replace("/signin"));
      return;
    }

    if (loadingBusiness || !business) return;

    const onboardingStep = business.onboardingStep ?? 0;
    const isOnboardingPage = pathname.startsWith("/onboarding");

    if (onboardingStep < 1 && pathname !== "/onboarding/step1") {
      router.replace("/onboarding/step1");
    } else if (
      onboardingStep === 1 &&
      !(pathname.includes("/campaign") || pathname.includes("/hub"))
    ) {
      router.replace("/onboarding/hub");
    } else if (
      onboardingStep === 2 &&
      !pathname.includes("/contacts") &&
      !pathname.includes("/hub")
    ) {
      router.replace("/onboarding/hub");
    } else if (
      onboardingStep === 3 &&
      !pathname.includes("/review-sign") &&
      !pathname.includes("/hub")
    ) {
      router.replace("/onboarding/hub");
    } else if (onboardingStep >= 4 && isOnboardingPage) {
      toast.success("You're all set! Redirecting to dashboard 🎉");
      setTimeout(() => router.replace("/dashboard"), 1500);
    }
  }, [authInitialized, isAuthenticated, user, loadingBusiness, business, pathname, router]);

  if (!authInitialized || !isAuthenticated || !user || (user.role !== "sdr" && loadingBusiness)) {
    return <Loader />;
  }

  return <>{children}</>;
}
