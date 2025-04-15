import { axiosClient } from "@/lib/axiosClient";
import { useDispatch } from "react-redux";
import { setOnboardingStep } from "@/store/membershipSlice";

export const useUpdateOnboardingStep = () => {
  const dispatch = useDispatch();

  const updateStep = async (membershipId: string, step: number) => {
    const res = await axiosClient.patch(`/api/memberships/${membershipId}/onboarding-step`, {
      step,
    });
    
    dispatch(setOnboardingStep(step));
    return res.data;
  };

  return { updateStep };
};
