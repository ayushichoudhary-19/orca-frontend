import { useState } from "react";
import { axiosClient } from "@/lib/axiosClient";

export const useInit = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initializeFeatures = async () => {
    setLoading(true);
    try {
      await axiosClient.post("/init/features");
    } catch (err) {
      console.error("Failed to initialize features.", err);
      setError("Failed to initialize features.");
    } finally {
      setLoading(false);
    }
  };

  const createAdminRole = async (businessId: string) => {
    setLoading(true);
    try {
      await axiosClient.post(`/init/admin-role/${businessId}`);
    } catch (err) {
      console.error("Failed to create admin role.", err); // Add thi
      setError("Failed to create admin role.");
    } finally {
      setLoading(false);
    }
  };

  return { initializeFeatures, createAdminRole, loading, error };
};
