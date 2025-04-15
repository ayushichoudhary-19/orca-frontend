"use client";

import { useEffect, useState } from "react";
import { Campaign } from "@/types/campaign";
import { useCampaign } from "@/hooks/Campaign/useCampaign";

const DRAFT_KEY = "draftCampaign";

export const useDraftCampaignManager = () => {
  const { getById } = useCampaign();
  const [draftCampaign, setDraftCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDraft = async () => {
    const campaignId = localStorage.getItem(DRAFT_KEY);
    if (!campaignId) return setLoading(false);

    try {
      const campaign = await getById(campaignId);
      if (campaign.status === "DRAFT") {
        setDraftCampaign(campaign);
      } else {
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch (err) {
      console.error("Failed to fetch draft campaign", err);
      localStorage.removeItem(DRAFT_KEY);
    } finally {
      setLoading(false);
    }
  };

  const setDraft = (id: string) => {
    localStorage.setItem(DRAFT_KEY, id);
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraftCampaign(null);
  };

  useEffect(() => {
    loadDraft();
  }, []);

  return {
    draftCampaign,
    loading,
    setDraft,
    clearDraft,
  };
};