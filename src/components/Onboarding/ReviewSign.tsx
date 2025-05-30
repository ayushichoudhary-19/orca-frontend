"use client";

import { useForm } from "@mantine/form";
import { Button, Container, Title, Text, Checkbox, Box, Paper } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import SignatureCanvas from "react-signature-canvas";
import { useEffect, useRef, useState } from "react";
import { useCampaign } from "@/hooks/Campaign/useCampaign";
import CustomTextInput from "@/components/Utils/CustomTextInput";
import { Campaign } from "@/types/campaign";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { clearDraftCampaignId, getDraftCampaignId } from "@/utils/campaignUtils";
import { zodResolver } from "@mantine/form";
import { reviewSignSchema, ReviewSignFormValues } from "@/schemas/reviewSignSchema";
import { updateStep } from "@/store/businessSlice";
import { useBusiness } from "@/hooks/Business/useBusiness";

export default function ReviewSign() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [existingCampaign, setExistingCampaign] = useState<Campaign | null>(null);
  const { signCampaign, getByBusiness, getById } = useCampaign();
  const user = useSelector((state: RootState) => state.auth.user);
  const businessId = user?.businessId;
  const pathname = usePathname();
  const isCreateFlow = pathname.includes("/campaign/create");
  const { updateStep: updateBusinessStep } = useBusiness();

  useEffect(() => {
    const fetchCampaign = async () => {
      const campaignId = isCreateFlow ? getDraftCampaignId() : null;

      if (campaignId) {
        const campaign = await getById(campaignId);
        setExistingCampaign(campaign);
        form.setFieldValue("campaignName", campaign.campaignName);
      }
    };
    fetchCampaign();
  }, []);

  useEffect(() => {
    const fetchExistingCampaign = async () => {
      if (!businessId) return;
      try {
        const campaigns = await getByBusiness(businessId);
        if (campaigns && campaigns.length == 1) {
          setExistingCampaign(campaigns[0]);
        }
      } catch (error) {
        console.error("Error fetching existing campaign:", error);
      }
    };
    fetchExistingCampaign();
  }, [businessId]);

  const sigRef = useRef<SignatureCanvas>(null);

  const form = useForm<ReviewSignFormValues>({
    validate: zodResolver(reviewSignSchema),
    initialValues: {
      companyLegalName: "",
      signatoryName: "",
      signatoryTitle: "",
      agreed: true,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!businessId) return;

    const base64Signature = sigRef.current?.getTrimmedCanvas().toDataURL("image/png");

    if (!base64Signature) {
      toast.error("Please sign before submitting");
      return;
    }

    try {
      if (!existingCampaign) {
        toast.error("No campaign found");
        return;
      }
      await signCampaign(existingCampaign._id, {
        signatoryName: values.signatoryName,
        signatoryTitle: values.signatoryTitle,
        signatureBase64: base64Signature,
      });

      if (isCreateFlow) {
        clearDraftCampaignId();
        router.push("/dashboard");
      } else {
        dispatch(updateStep(4));
        updateBusinessStep(businessId, 4);
        router.push("/dashboard");
      }
      toast.success("Signed successfully 🎉");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Error submitting signature");
    }
  };

  return (
    <Container size="sm" className="py-10">
      <Title order={2} className="text-[28px] font-bold mb-2 text-[#0C0A1C]">
        Review & sign
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        To launch your campaign, review and sign your Order Form.
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Legal Name</label>
          <CustomTextInput
            placeholder="Enter legal name"
            className="h-[50px]"
            {...form.getInputProps("companyLegalName")}
          />
          {form.errors.companyLegalName && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.companyLegalName}
            </Text>
          )}
        </div>

        <Paper withBorder p="md" radius="md" className="bg-[#F8F5FF] border-[#D6CCFC]">
          <Title order={4} className="text-primary font-semibold mb-2">
            Order Form for {form.values.companyLegalName || "..."}
          </Title>
          <Text size="sm" className="text-[#0C0A1C] leading-[1.6]">
            This {`"Order Form"`} is executed, effective as of [03/26/2025] by and between ORCA,
            Inc. ({`"ORCA"`}) and {form.values.companyLegalName || "Customer"} ({`"Customer"`}). By
            executing this Order Form, Customer agrees to use the Service described in this Order
            Form...
            <br />
            <br />
            <b className="text-[#0C0A1C]">Please read our terms of service at:</b>{" "}
            <a
              href="https://www.ORCA.com/legal/msa"
              target="_blank"
              className="text-primary underline"
            >
              https://www.ORCA.com/legal/msa
            </a>
            <br />
            <br />
            <b className="text-[#0C0A1C]">Special Terms: Marketing Logo Rights.</b> Customer grants
            ORCA the right to use
            {`Customer's`} name and logo on promotional materials including, but not limited to,
            ORCA website and case studies.
          </Text>
        </Paper>

        <div className="grid gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adjustable Qualification Criteria
            </label>
            <CustomTextInput
              value="Specified by the OPS team."
              disabled
              className="h-[50px]"
              style={{ backgroundColor: "#e7e7e9" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Qualified Meeting
            </label>
            <CustomTextInput
              value="Specified by the OPS team."
              disabled
              className="h-[50px]"
              style={{ backgroundColor: "#e7e7e9" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Platform Fee
            </label>
            <CustomTextInput
              value="Separate addendum to be shared."
              disabled
              className="h-[50px]"
              style={{ backgroundColor: "#e7e7e9" }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Signatory Name</label>
          <CustomTextInput
            required
            placeholder="Enter full name"
            className="h-[50px]"
            {...form.getInputProps("signatoryName")}
          />
          {form.errors.signatoryName && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.signatoryName}
            </Text>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Signatory Title</label>
          <CustomTextInput
            required
            placeholder="Enter title"
            className="h-[50px]"
            {...form.getInputProps("signatoryTitle")}
          />
          {form.errors.signatoryTitle && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.signatoryTitle}
            </Text>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Please sign with your cursor in the box below
          </label>
          <Box
            className="rounded-md overflow-hidden bg-white"
            style={{ border: "1px solid #E7E7E9" }}
          >
            <SignatureCanvas
              penColor="black"
              ref={sigRef}
              canvasProps={{ width: "500", height: 120, className: "sigCanvas" }}
            />
          </Box>
          <Text size="xs" c="dimmed" mt={2}>
            Signing on 3/26/2025
          </Text>
        </div>
        <div>
          <Checkbox
            checked={form.values.agreed}
            onChange={(e) => form.setFieldValue("agreed", e.currentTarget.checked)}
            label={
              <Text size="sm">
                I agree and intend for my electronic signature here to be as valid as if I signed
                the document by hand, to the full extent allowed by applicable law.
              </Text>
            }
            required
          />
          {form.errors.agreed && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.agreed}
            </Text>
          )}
        </div>

        <div className="flex justify-between pt-4">
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
          <Button type="submit" size="md" radius="md" variant="filled">
            Accept & Launch Campaign →
          </Button>
        </div>
      </form>
    </Container>
  );
}
