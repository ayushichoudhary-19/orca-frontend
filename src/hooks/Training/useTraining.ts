import { axiosClient } from "@/lib/axiosClient";
import { Training, TrainingType } from "@/types/training";

export const getTrainingsByCampaign = async (campaignId: string): Promise<Training[]> => {
  const res = await axiosClient.get(`/api/trainings/campaign/${campaignId}`);
  return res.data;
};

export const getTrainingById = async (id: string): Promise<Training> => {
  const res = await axiosClient.get(`/api/trainings/${id}`);
  return res.data;
};

export const createTraining = async (payload: Partial<Training>) => {
  const res = await axiosClient.post("/api/trainings", payload);
  return res.data;
};

export const updateTraining = async (id: string, updates: Partial<Training>) => {
  const res = await axiosClient.put(`/api/trainings/${id}`, updates);
  return res.data;
};

export const deleteTraining = async (id: string) => {
  const res = await axiosClient.delete(`/api/trainings/${id}`);
  return res.data;
};

export const seedDefaultTrainings = async (campaignId: string, adminId: string) => {
  const res = await axiosClient.post("/api/trainings/seed-defaults", { campaignId, adminId });
  return res.data;
};

export const checkCoreTrainingsComplete = async (
  campaignId: string
): Promise<{ complete: boolean }> => {
  const res = await axiosClient.get(`/api/trainings/check-core/${campaignId}`);
  return res.data;
};

export const getCoreTrainingTypes = async (): Promise<
  { type: TrainingType; title: string; description: string }[]
> => {
  const res = await axiosClient.get("/api/trainings/core-types");
  return res.data;
};
