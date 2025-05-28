"use client";

import { useState } from "react";
import { axiosClient } from "@/lib/axiosClient";

interface ProfileData {
  businessId: string;
  companySize: string;
  referralSource: string;
}

export const useCreateBusinessProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProfile = async ({ businessId, companySize, referralSource }: ProfileData) => {
    setLoading(true);
    setError(null);
    try {
      await axiosClient.patch(`/api/business/${businessId}/details`, {
        companySize,
        referralSource,
      });
    } catch (err) {
      setError("Failed to update business profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProfile, loading, error };
};
