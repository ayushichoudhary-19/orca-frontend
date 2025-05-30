"use client";

import { useForm } from "@mantine/form";
import { Button, Container, Title, Text } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { IconArrowRight } from "@tabler/icons-react";
import CustomTextInput from "@/components/Utils/CustomTextInput";
import { toast } from "@/lib/toast";
import { useCampaign } from "@/hooks/Campaign/useCampaign";
import { setDraftCampaignId } from "@/utils/campaignUtils";
import { zodResolver } from "@mantine/form";
import { campaignFormSchema, CampaignFormValues } from "@/schemas/campaignFormSchema";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateStep } from "@/store/businessSlice";
import { useBusiness } from "@/hooks/Business/useBusiness";

export default function CampaignForm() {
  const router = useRouter();
  const { createCampaign } = useCampaign();
  const user = useAppSelector((state) => state.auth.user);
  const businessId = user?.businessId;
  const { updateStep: updateBusinessStep } = useBusiness();
  const dispatch = useAppDispatch();

  const form = useForm<CampaignFormValues>({
    validate: zodResolver(campaignFormSchema),
    initialValues: {
      companyWebsite: "",
      campaignName: "",
    },
  });

  const pathname = usePathname();
  const isCreateFlow = pathname.includes("/campaign/create");

  const handleSubmit = async (values: typeof form.values) => {
    if (!businessId) return;
    try {
      const newCampaign = await createCampaign({
        businessId,
        campaignName: values.campaignName,
        companyWebsite: values.companyWebsite,
        status: "DRAFT",
      });

      if (isCreateFlow) {
        if (typeof window !== "undefined") {
          setDraftCampaignId(newCampaign._id);
        }
        router.push("/campaign/create?step=contacts");
      } else {
        dispatch(updateStep(2));
        updateBusinessStep(businessId,2);
        router.push("/onboarding/hub");
      }      
      toast.success("Campaign saved");
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
        {"Let’s "}get to know your product.
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company website</label>
          <CustomTextInput
            {...form.getInputProps("companyWebsite")}
            placeholder="https://www.websitename.com"
            required
            className="h-[50px]"
          />
          {form.errors.companyWebsite && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.companyWebsite}
            </Text>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign name</label>
          <CustomTextInput
            {...form.getInputProps("campaignName")}
            placeholder="Enter your campaign name"
            required
            className="h-[50px]"
          />
          {form.errors.campaignName && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.campaignName}
            </Text>
          )}
        </div>
        <div className="flex justify-between pt-6">
          <Button
            variant="light"
            size="md"
            radius="md"
            className="text-[#555461] bg-[#E7E7E7]"
            onClick={() =>
              router.push(isCreateFlow ? "/campaign/create?step=hub" : "/onboarding/hub")
            }
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
