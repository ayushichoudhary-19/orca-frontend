"use client";

import { useForm } from "@mantine/form";
import { Button, Container, Title } from "@mantine/core";
import { auth } from "@/lib/firebase-config";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import CustomTextInput from "@/components/Utils/CustomTextInput";
import { useCreateBusinessProfile } from "@/hooks/Onboarding/useCreateBusinessProfile";
import { IconArrowRight } from "@tabler/icons-react";
import { useUpdateOnboardingStep } from "@/hooks/Onboarding/useUpdateOnboardingStep";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Step1() {
  const router = useRouter();
  const { createProfile } = useCreateBusinessProfile();
  const { updateStep } = useUpdateOnboardingStep();
  const businessId = useSelector((state: RootState) => state.membership.businessId);
  const membershipId = useSelector((state: RootState) => state.membership.membershipId);

  const form = useForm<{
    companySize: string;
    referralSource: string;
  }>({
    initialValues: {
      companySize: "",
      referralSource: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const user = auth.currentUser;
    if (!user || !membershipId || !businessId) return;
  
    try {
      await createProfile({
        businessId: businessId,
        companySize: values.companySize,
        referralSource: values.referralSource,
      });
  
      await updateStep(membershipId, 1);
  
      toast.success("Profile saved");
      router.push("/onboarding/hub");
    } catch {
      toast.error("Error saving profile");
    }
  };

  return (
    <Container>
      <Title mb="md" style={{ fontWeight: "700", fontSize: "32px", color: "#0C0A1C" }}>
        Tell us about your company
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
        {/* Company Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">How big is your company?</label>
          <div className="grid grid-cols-2 gap-3">
            {["0 - 50", "50 - 200", "200 - 1000", "1000+"].map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => form.setFieldValue("companySize", size)}
                className={`w-full h-[50px] rounded-md border text-sm font-medium transition-all
                  ${
                    form.values.companySize === size
                      ? "bg-[#F4F1FF] border-primary text-primary"
                      : "bg-white border-[#E7E7E9] text-black"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Referral Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
          <CustomTextInput
            {...form.getInputProps("referralSource")}
            className="h-[50px]"
            placeholder="Write here"
          />
        </div>

        <Button
          type="submit"
          mt="xl"
          radius="md"
          size="lg"
          rightSection={<IconArrowRight size={16} />}
          style={{ fontSize: "16px" }}
        >
          Continue
        </Button>
      </form>
    </Container>
  );
}
