import { axiosClient } from "@/lib/axiosClient";
import { Business } from "@/types/business";

export const useBusiness = () => {
  const createBusiness = async (data: Partial<Business>) => {
    const res = await axiosClient.post("/api/business", data);
    return res.data;
  };

  const getById = async (id: string) => {
    const res = await axiosClient.get(`/api/business/${id}`);
    return res.data;
  };

  const getByUser = async (userId: string) => {
    const res = await axiosClient.get(`/api/business/user/${userId}`);
    return res.data;
  };

  return { createBusiness, getById, getByUser };
};
