"use client";

import { useForm } from "@mantine/form";
import { Button, Container, Title, Text } from "@mantine/core";
import { auth } from "@/lib/firebase";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import CustomTextInput from "@/components/Utils/CustomTextInput";
import { IconArrowRight } from "@tabler/icons-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import CustomCheckbox from "@/components/Utils/CustomCheckbox";
import { zodResolver } from "@mantine/form";
import { step1Schema, Step1FormValues } from "@/schemas/step1Schema";
import { updateStep } from "@/store/businessSlice";
import { useCreateBusinessProfile } from "@/hooks/Onboarding/useCreateBusinessProfile";
import { useState } from "react";
import { useBusiness } from "@/hooks/Business/useBusiness";

export default function Step1() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { createProfile } = useCreateBusinessProfile();
  const user = useAppSelector((state) => state.auth.user);
  const businessId = user?.businessId;
  const { updateStep: updateBusinessStep } = useBusiness();

  const form = useForm<Step1FormValues>({
    validate: zodResolver(step1Schema),
    initialValues: {
      companySize: "",
      referralSource: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const user = auth.currentUser;
    if (!user || !businessId) return;

    try {
      setIsSubmitting(true);
      await createProfile({
        businessId,
        companySize: values.companySize,
        referralSource: values.referralSource,
      });

      await dispatch(updateStep(1));
      toast.success("Profile saved");
      updateBusinessStep(businessId, 1);
      router.push("/onboarding/hub");
    } catch {
      toast.error("Error saving profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title mb="md" style={{ fontWeight: "700", fontSize: "32px", color: "#0C0A1C" }}>
        Tell us about your company
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How big is your company?
          </label>
          <div className="space-y-2">
            {["0 - 50", "50 - 200", "200 - 1000", "1000+"].map((size) => (
              <CustomCheckbox
                key={size}
                label={size}
                checked={form.values.companySize === size}
                onChange={() => form.setFieldValue("companySize", size)}
              />
            ))}
          </div>
          {form.errors.companySize && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.companySize}
            </Text>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How did you hear about us?
          </label>
          <CustomTextInput
            {...form.getInputProps("referralSource")}
            className="h-[50px]"
            placeholder="Write here"
          />
          {form.errors.referralSource && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.referralSource}
            </Text>
          )}
        </div>
        <Button
          type="submit"
          mt="xl"
          radius="md"
          size="lg"
          loading={isSubmitting}
          rightSection={!isSubmitting && <IconArrowRight size={16} />}
          style={{ fontSize: "16px" }}
        >
          {isSubmitting ? "Setting up..." : "Continue"}
        </Button>
      </form>
    </Container>
  );
}
