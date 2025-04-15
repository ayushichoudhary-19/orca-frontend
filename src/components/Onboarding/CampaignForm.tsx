"use client";

import { useForm } from "@mantine/form";
import { Button, Container, Title, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconArrowRight } from "@tabler/icons-react";
import CustomTextInput from "@/components/Utils/CustomTextInput";
import { toast } from "@/lib/toast";
import { useCampaign } from "@/hooks/Campaign/useCampaign";
import { useUpdateOnboardingStep } from "@/hooks/Onboarding/useUpdateOnboardingStep";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function CampaignForm() {
  const router = useRouter();
  const { createCampaign } = useCampaign();
  const { updateStep } = useUpdateOnboardingStep();
  const businessId = useSelector((state: RootState) => state.membership.businessId);
  const membershipId = useSelector((state: RootState) => state.membership.membershipId);

  const form = useForm({
    initialValues: {
      companyWebsite: "",
      campaignName: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!membershipId || !businessId) return;

    try {
      await createCampaign({
        businessId: businessId,
        ...values,
      });

      await updateStep(membershipId, 2);
      toast.success("Campaign saved");
      router.push("/onboarding/hub");
    } catch (err) {
      console.error(err);
      toast.error("Error saving campaign");
    }
  };

  return (
    <Container className="pt-12">
      <Title order={2} className="text-[24px] font-bold text-[#0C0A1C] mb-2">
        Start your campaign
      </Title>
      <Text size="sm" c="dimmed" mb="xl">
        Let’s get to know your product.
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company website</label>
          <CustomTextInput
            {...form.getInputProps("companyWebsite")}
            placeholder="www.websitename.com"
            required
            className="h-[50px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign name</label>
          <CustomTextInput
            {...form.getInputProps("campaignName")}
            placeholder="Enter your campaign name"
            required
            className="h-[50px]"
          />
        </div>
        <div className="flex justify-between pt-6">
          <Button
            variant="light"
            size="md"
            radius="md"
            className="text-[#555461] bg-[#E7E7E7]"
            onClick={() => router.push("/onboarding/hub")}
          >
            Back
          </Button>
          <Button
            type="submit"
            size="md"
            radius="md"
            rightSection={<IconArrowRight size={16} />}
            style={{ fontSize: "16px", paddingInline: "24px" }}
          >
            Save
          </Button>
        </div>
      </form>
    </Container>
  );
}
