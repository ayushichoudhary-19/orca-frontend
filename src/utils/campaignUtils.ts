export const getDraftCampaignId = () => localStorage.getItem("draftCampaign");
export const setDraftCampaignId = (id: string) => localStorage.setItem("draftCampaign", id);
export const clearDraftCampaignId = () => localStorage.removeItem("draftCampaign");

export const isCampaignCreateRoute = (pathname: string) =>
  pathname.includes("/campaign/create");

import { Campaign } from "@/types/campaign";

export const getStepFromDraft = (campaign: Campaign): number => {
  if (!campaign) return 0;

  // Step 1: campaign name and website filled
  const hasStep1 = Boolean(campaign.campaignName && campaign.companyWebsite);

  // Step 2: either contacts uploaded or ideal customer info filled
  const hasStep2 = Boolean(
    campaign.uploadedCsvFilename ||
    campaign.allowAutoLeads ||
    campaign.titles?.length ||
    campaign.companyLocation?.length ||
    campaign.employeeLocation?.length ||
    campaign.industry?.length ||
    campaign.keywords?.length
  );

  // Step 3: signature done
  const hasStep3 = Boolean(
    campaign.signatoryName &&
    campaign.signatoryTitle &&
    campaign.signatureBase64 &&
    campaign.status === "SIGNED"
  );

  if (!hasStep1) return 1;
  if (!hasStep2) return 2;
  if (!hasStep3) return 3;
  return 4;
};
