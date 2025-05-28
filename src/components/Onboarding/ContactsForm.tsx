"use client";

import { useForm } from "@mantine/form";
import { Button, Container, Title, Group, Text, MultiSelect, TagsInput, NumberInput } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { useUpdateOnboardingStep } from "@/hooks/Onboarding/useUpdateOnboardingStep";
import { useCampaign } from "@/hooks/Campaign/useCampaign";
import { useState, useEffect } from "react";
import UploadCsvModal from "./UploadCsvModal";
import { Campaign } from "@/types/campaign";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getDraftCampaignId } from "@/utils/campaignUtils";
import CustomSelect from "../Utils/CustomSelect";
import CustomCheckbox from "../Utils/CustomCheckbox";
import { zodResolver } from '@mantine/form';
import { contactFormSchema, ContactFormValues } from '@/schemas/contactFormSchema';

const commonInputStyles = {
  input: {
    width: '100%',
    backgroundColor: 'white',
    height: '50px',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#2C2C35',
    border: '1px solid #E7E7E9',
    borderRadius: '6px',
    '&:focus': {
      outline: 'none',
      border: '1px solid #E7E7E9'
    }
  }
};

export default function ContactsForm() {
  const router = useRouter();
  const { updateStep } = useUpdateOnboardingStep();
  const {
    getByBusiness,
    getById,
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

  const pathname = usePathname();
  const isCreateFlow = pathname.includes("/campaign/create");

  const form = useForm<ContactFormValues>({
    validate: zodResolver(contactFormSchema),
    initialValues: {
      allowAutoLeads: false,
      companySize: "",
      revenueTargetMin: 0,
      revenueTargetMax: 100,
      titles: [],
      companyLocation: [],
      employeeLocation: [],
      industry: [],
      keywords: [],
    },
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      const campaignId = isCreateFlow ? getDraftCampaignId() : null;

      if (campaignId) {
        const campaign = await getById(campaignId);
        setExistingCampaign(campaign);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    fetchCampaign();
  }, []);

  useEffect(() => {
    console.log("existingCampaign", existingCampaign);
    const fetchExistingCampaign = async () => {
      if (!membershipId || !businessId || isCreateFlow){
        return;
      }

      try {
        setIsLoading(true);
        const campaigns = await getByBusiness(businessId);
        console.log("campaigns", campaigns);
        if (campaigns && campaigns.length > 0) {
          const campaign = campaigns[0];
          setExistingCampaign(campaign);
          }
      } catch (error) {
        console.error("Error fetching existing campaign:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingCampaign();
  }, [membershipId, businessId]);

  const handleFileRead = (content: string, filename: string) => {
    setCsvContent(content);
    setCsvFilename(filename);
    toast.success(`File "${filename}" uploaded successfully`);
  };

  const handleSubmit = async (values: ContactFormValues) => {
    if (!membershipId || !businessId) {
      console.error('Membership or business not found');
      return;
    }

    // Check if CSV is uploaded
    if (!csvContent || !csvFilename) {
      toast.error("Please upload a CSV file");
      return;
    }

    try {
      const campaignId = existingCampaign?._id;
      if (!campaignId) {
        toast.error("No campaign found to add contacts to");
        return;
      }

      const detailsPayload = {
        revenueTarget: {
          min: values.revenueTargetMin,
          max: values.revenueTargetMax,
        },
        titles: values.titles,
        companyLocation: values.companyLocation,
        employeeLocation: values.employeeLocation,
        industry: values.industry,
        keywords: values.keywords,
        allowAutoLeads: values.allowAutoLeads,
        companySize: values.companySize,
      };

      await addIdealCustomerDetails(campaignId, detailsPayload);
      await updateCampaignContacts(campaignId, csvContent, csvFilename);

      toast.success("Contact criteria saved");
      if (isCreateFlow) {
        router.push("/campaign/create?step=hub");
      } else {
        await updateStep(membershipId, 3);
        router.push("/onboarding/hub");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving contacts");
    }
  };

  // Industries list for dropdown
  const industriesList = [
    "Tech",
    "Finance",
    "Retail",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Hospitality",
    "Construction",
    "Legal",
    "Logistics",
  ];

  return (
    <Container>
      <Title mb="xs" order={2}>
        Define your Ideal Customer
      </Title>
      <p className="text-sm text-gray-500 mb-6">
        Have a list for our users to call? Great! Upload it below.
      </p>

      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
        {/* CSV Upload Section */}
        <div>
          <label className="text-md font-medium text-tinteddark7 block mb-1">
            Upload lead list
          </label>

          <div
            className="relative h-[125px] flex flex-col items-center justify-center rounded-xl p-6 w-full cursor-pointer hover:border-primary transition-all"
            style={{
              border: "1px solid #E7E7E9",
            }}
            onClick={() => setCsvModalOpen(true)}
          >
            <div className="flex flex-col items-center justify-center">
              <button
                type="button"
                className="text-sm hover:cursor-pointer font-normal text-tinteddark8 bg-white p-3 rounded-md"
                style={{
                  border: "1px solid #E7E7E9",
                }}
              >
                Choose files to upload
              </button>
            </div>
          </div>
          <p className="text-xs text-tinteddark6 mt-2 font-normal">Supports csv</p>

          {csvFilename ? (
            <Text size="sm" c="black" mt="xs">
              {csvFilename}
            </Text>
          ) : (
            <Text size="sm" c="red" mt="xs">
              CSV file is required
            </Text>
          )}
        </div>

        {/* Auto Leads Option */}
        <div>
          <label className="text-sm font-bold text-[#0C0A1C] block mt-5">
            Want ORCA to pull leads for you?
          </label>
          <p className="text-md text-tinteddark7 mb-2 mt-0 font-normal">
            Awesome. Share their details below.
          </p>
          <CustomCheckbox
            label="Allow Orca to pull leads for your campaign"
            checked={form.values.allowAutoLeads}
            {...form.getInputProps("allowAutoLeads")}
            onChange={(event) => form.setFieldValue("allowAutoLeads", event.currentTarget.checked)}
          />
        </div>

        {/* Company Size */}
        <div>
          <label className="text-md font-medium text-tinteddark7 block mb-1">Company Size</label>
          <CustomSelect
            data={["1-10", "11-50", "51-200", "201+"]}
            placeholder="Select Here"
            value={form.values.companySize}
            onChange={(value) => form.setFieldValue("companySize", value || "")}
          />
          {form.errors.companySize && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.companySize}
            </Text>
          )}
        </div>

        {/* Revenue Target */}
        <div>
          <label className="text-md font-medium text-tinteddark7 block mb-1">Revenue Target</label>
          <Group grow>
            <div style={{ flex: 1 }}>
              <NumberInput
                placeholder="Enter minimum revenue"
                min={1}
                {...form.getInputProps("revenueTargetMin")}
                styles={commonInputStyles}
              />
              {form.errors.revenueTargetMin && (
                <Text size="xs" c="red" mt={5}>
                  {form.errors.revenueTargetMin}
                </Text>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <NumberInput
                placeholder="Enter maximum revenue"
                min={1}
                {...form.getInputProps("revenueTargetMax")}
                styles={commonInputStyles}
              />
              {form.errors.revenueTargetMax && (
                <Text size="xs" c="red" mt={5}>
                  {form.errors.revenueTargetMax}
                </Text>
              )}
            </div>
          </Group>
          {form.values.revenueTargetMax <= form.values.revenueTargetMin && (
            <Text size="xs" c="red" mt={5}>
              Maximum revenue must be greater than minimum revenue
            </Text>
          )}
        </div>

        {/* Titles */}
        <div>
          <label className="text-md font-medium text-tinteddark7 block mb-1">Titles</label>
          <TagsInput
            placeholder="Enter desired prospect titles separated by comma"
            value={form.values.titles}
            onChange={(value) => form.setFieldValue("titles", value)}
            clearable
            styles={commonInputStyles}
          />
          {form.errors.titles && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.titles}
            </Text>
          )}
        </div>

        {/* Company Location */}
        <div>
          <label className="text-md font-medium text-tinteddark7 block mb-1">Company Location</label>
          <TagsInput
            placeholder="Enter company locations separated by comma"
            value={form.values.companyLocation}
            onChange={(value) => form.setFieldValue("companyLocation", value)}
            clearable
            styles={commonInputStyles}
          />
          {form.errors.companyLocation && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.companyLocation}
            </Text>
          )}
        </div>

        {/* Employee Location */}
        <div>
          <label className="text-md font-medium text-tinteddark7 block mb-1">Employee Location</label>
          <TagsInput
            placeholder="Enter employee locations separated by comma"
            value={form.values.employeeLocation}
            onChange={(value) => form.setFieldValue("employeeLocation", value)}
            clearable
            styles={commonInputStyles}
          />
          {form.errors.employeeLocation && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.employeeLocation}
            </Text>
          )}
        </div>

        {/* Industry */}
        <div>
          <label className="text-md font-medium text-tinteddark7 block mb-1">Industry</label>
          <MultiSelect
            placeholder="Select target industries"
            data={industriesList}
            clearable
            value={form.values.industry}
            onChange={(value) => form.setFieldValue("industry", value)}
            styles={commonInputStyles}
          />
          {form.errors.industry && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.industry}
            </Text>
          )}
        </div>

        {/* Keywords */}
        <div>
          <label className="text-md font-medium text-tinteddark7 block mb-1">Keywords</label>
          <TagsInput
            placeholder="Enter keywords separated by comma"
            value={form.values.keywords}
            onChange={(value) => form.setFieldValue("keywords", value)}
            clearable
            styles={commonInputStyles}
          />
          {form.errors.keywords && (
            <Text size="xs" c="red" mt={5}>
              {form.errors.keywords}
            </Text>
          )}
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-between pt-6">
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
            className="bg-primary text-white px-6"
            loading={campaignLoading || isLoading}
            disabled={!membershipId || isLoading}
          >
            Save
          </Button>
        </div>
      </form>

      <UploadCsvModal
        opened={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onFileRead={handleFileRead}
      />
    </Container>
  );
}