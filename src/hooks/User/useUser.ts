import { axiosClient } from "@/lib/axiosClient";
import { useState } from "react";
import { User} from "@/types/user";

export const useUser = () => {
  const [loading, setLoading] = useState(false);

  const getCurrentUser = async (): Promise<User> => {
    const res = await axiosClient.get("/api/user/me");
    return res.data;
  };

  const createUser = async (data: { firebaseUid: string; email: string }) => {
    setLoading(true);
    const res = await axiosClient.post("/api/user", data);
    setLoading(false);
    return res.data;
  };

  return { getCurrentUser, createUser, loading };
};
