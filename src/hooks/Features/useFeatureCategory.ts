import { useState } from "react";
import { axiosClient } from "@/lib/axiosClient";
import { FeatureCategory } from "@/types/featureCategory";

export const useFeatureCategory = () => {
  const [loading, setLoading] = useState(false);

  const createCategory = async (name: string) => {
    setLoading(true);
    const res = await axiosClient.post("/api/feature-category", { name });
    setLoading(false);
    return res.data as FeatureCategory;
  };

  const getAllCategories = async () => {
    const res = await axiosClient.get("/api/feature-category");
    return res.data as FeatureCategory[];
  };

  return { createCategory, getAllCategories, loading };
};
