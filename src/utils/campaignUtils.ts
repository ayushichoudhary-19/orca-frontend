export const getDraftCampaignId = () => localStorage.getItem("draftCampaign");
export const setDraftCampaignId = (id: string) => localStorage.setItem("draftCampaign", id);
export const clearDraftCampaignId = () => localStorage.removeItem("draftCampaign");

export const isCampaignCreateRoute = (pathname: string) =>
  pathname.includes("/campaign/create");
