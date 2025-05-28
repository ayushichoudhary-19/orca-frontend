import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosClient } from "@/lib/axiosClient";
import type { RootState } from "@/store/store";

export const useCalendly = () => {
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);
  const [calendlyLink, setCalendlyLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendlyLink = async () => {
      if (!campaignId) return;
      try {
        const res = await axiosClient.get(`/api/campaign/${campaignId}/calendly-link`);
        setCalendlyLink(res.data?.calendlyLink || null);
      } catch (error) {
        console.error("Failed to fetch Calendly link:", error);
        setCalendlyLink(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendlyLink();
  }, [campaignId]);

  return { calendlyLink, loading };
};
