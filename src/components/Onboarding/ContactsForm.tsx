"use client";

import { useForm } from "@mantine/form";
import { Button, Container, Title, Group, Select, Text } from "@mantine/core";
import CustomTextInput from "@/components/Utils/CustomTextInput";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { useUpdateOnboardingStep } from "@/hooks/Onboarding/useUpdateOnboardingStep";
import { useCampaign } from "@/hooks/Campaign/useCampaign";
import { useState, useEffect } from "react";
import UploadCsvModal from "./UploadCsvModal";
import { Campaign } from "@/types/campaign";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ContactsForm() {
  const router = useRouter();
  const { updateStep } = useUpdateOnboardingStep();
  const {
    createCampaign,
    getByBusiness,
    addIdealCustomerDetails,
    updateCampaignContacts,
    loading: campaignLoading,
  } = useCampaign();

  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvContent, setCsvContent] = useState<string>("");
  const [csvFilename, setCsvFilename] = useState<string>("");
  const [existingCampaign, setExistingCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const businessId = useSelector((state: RootState) => state.membership.businessId);
  const membershipId = useSelector((state: RootState) => state.membership.membershipId);

  useEffect(() => {
    const fetchExistingCampaign = async () => {
      if (!membershipId || !businessId) return;

      try {
        setIsLoading(true);
        const campaigns = await getByBusiness(membershipId);

        if (campaigns && campaigns.length > 0) {
          setExistingCampaign(campaigns[0]);

          form.setFieldValue("campaignName", campaigns[0].campaignName || "");
        }
      } catch (error) {
        console.error("Error fetching existing campaign:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingCampaign();
  }, [membershipId, businessId]);

  const form = useForm({
    initialValues: {
      campaignName: "",
      allowAutoLeads: false,
      companySize: "",
      revenueTargetMin: "",
      revenueTargetMax: "",
      titles: "",
      companyLocation: "",
      employeeLocation: "",
      industry: "",
      keywords: "",
    },
  });

  const handleFileRead = (content: string, filename: string) => {
    setCsvContent(content);
    setCsvFilename(filename);
    toast.success(`File "${filename}" uploaded successfully`);
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!membershipId || !businessId) return;

    try {
      let campaignId;

      if (existingCampaign) {
        campaignId = existingCampaign._id;
      } else {
        const newCampaign = await createCampaign({
          businessId: businessId,
          campaignName: values.campaignName || "Default Campaign",
          status: "DRAFT",
        });
        campaignId = newCampaign._id;
      }

      const detailsPayload = {
        revenueTarget: {
          min: values.revenueTargetMin ? Number(values.revenueTargetMin) : undefined,
          max: values.revenueTargetMax ? Number(values.revenueTargetMax) : undefined,
        },
        titles: values.titles ? values.titles.split(",").map((item) => item.trim()) : [],
        companyLocation: values.companyLocation
          ? values.companyLocation.split(",").map((item) => item.trim())
          : [],
        employeeLocation: values.employeeLocation
          ? values.employeeLocation.split(",").map((item) => item.trim())
          : [],
        industry: values.industry ? [values.industry] : [],
        keywords: values.keywords ? values.keywords.split(",").map((item) => item.trim()) : [],
        allowAutoLeads: Boolean(values.allowAutoLeads),
      };

      await addIdealCustomerDetails(campaignId, detailsPayload);

      if (csvContent && csvFilename) {
        await updateCampaignContacts(campaignId, csvContent, csvFilename);
      }

      await updateStep(membershipId, 3);

      toast.success("Contact criteria saved");
      router.push("/onboarding/hub");
    } catch (error) {
      console.error(error);
      toast.error("Error saving contacts");
    }
  };

  return (
    <Container>
      <Title mb="xs" order={2}>
        Define your Ideal Customer
      </Title>
      <p className="text-sm text-gray-500 mb-6">
        Have a list for our users to call? Great! Upload it below.
      </p>

      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
        {/* Campaign Name */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Campaign Name</label>
          <CustomTextInput
            placeholder="Enter campaign name"
            className="h-[50px]"
            {...form.getInputProps("campaignName")}
            disabled={existingCampaign !== null}
          />
          {existingCampaign && (
            <Text size="xs" c="dimmed" mt={4}>
              {"You're "}adding contacts to {existingCampaign.campaignName} campaign
            </Text>
          )}
        </div>

        {/* Upload File */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Upload CSV</label>
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setCsvModalOpen(true)}
              className="bg-primary text-white"
              size="sm"
            >
              Choose File
            </Button>
            <Text size="sm" color={csvFilename ? "black" : "dimmed"}>
              {csvFilename || "No file selected"}
            </Text>
          </div>
        </div>

        {/* Auto Leads */}
        <div>
          <label className="text-sm font-medium text-gray-900 block">
            Want ORCA to pull leads for you?
          </label>
          <p className="text-sm text-gray-500 mb-2">Awesome. Share their details below.</p>
          <Select
            data={[{ value: "true", label: "Allow Glencoco to pull leads for your campaign" }]}
            placeholder="Allow Glencoco to pull leads for your campaign"
            className="h-[50px]"
            onChange={(value) => form.setFieldValue("allowAutoLeads", value === "true")}
          />
        </div>

        {/* Company Size */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Company Size</label>
          <Select
            data={["1-10", "11-50", "51-200", "201+"]}
            placeholder="Select Here"
            className="h-[50px]"
            {...form.getInputProps("companySize")}
          />
        </div>

        {/* Revenue Target */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Revenue Target</label>
          <Group grow>
            <CustomTextInput
              placeholder="Min amount"
              className="h-[50px]"
              {...form.getInputProps("revenueTargetMin")}
            />
            <CustomTextInput
              placeholder="Max amount"
              className="h-[50px]"
              {...form.getInputProps("revenueTargetMax")}
            />
          </Group>
        </div>

        {/* Other Filters */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Titles</label>
          <CustomTextInput
            placeholder="Enter desired prospect titles separated by comma"
            className="h-[50px]"
            {...form.getInputProps("titles")}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Company Location</label>
          <CustomTextInput
            placeholder="Enter desired prospect locations separated by comma"
            className="h-[50px]"
            {...form.getInputProps("companyLocation")}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Employee Location</label>
          <CustomTextInput
            placeholder="Enter desired prospect location separated by comma"
            className="h-[50px]"
            {...form.getInputProps("employeeLocation")}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Industry</label>
          <Select
            placeholder="Select all that apply"
            data={["Tech", "Finance", "Retail"]}
            className="h-[50px]"
            {...form.getInputProps("industry")}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Keywords</label>
          <CustomTextInput
            placeholder="Enter desired prospect keywords separated by comma"
            className="h-[50px]"
            {...form.getInputProps("keywords")}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-6">
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
            className="bg-primary text-white px-6"
            loading={campaignLoading || isLoading}
            disabled={!membershipId || isLoading}
          >
            Save
          </Button>
        </div>
      </form>

      {/* CSV Upload Modal */}
      <UploadCsvModal
        opened={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onFileRead={handleFileRead}
      />
    </Container>
  );
}
