"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@mantine/core";
import { RootState } from "@/store/store";
import { axiosClient } from "@/lib/axiosClient";
import { toast } from "@/lib/toast";

const CalendlyLinkInput = () => {
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);
  const [calendlyConnected, setCalendlyConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const connected = urlParams.get("connected");

    if (connected === "calendly") {
      toast.success("Calendly connected successfully!");
    } else if (connected === "calendly_no_webhook") {
      toast.warn("Calendly connected, but auto-tracking meetings needs a Standard plan.");
    }
  }, []);

  useEffect(() => {
    const fetchCalendlyLink = async () => {
      try {
        const res = await axiosClient.get(`/api/campaign/${campaignId}/calendly-link`);
        if (res.data?.calendlyLink) {
          setCalendlyConnected(true);
        }
      } catch (err) {
        console.error("Failed to fetch Calendly link", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendlyLink();
  }, [campaignId]);

  const handleConnectCalendly = () => {
    if (!campaignId) return;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/calendly/oauth/start?campaignId=${campaignId}`;
    window.location.href = url;
  };

  if (loading || calendlyConnected) return null;

  return (
    <div className="bg-white p-6 mb-6 ">
      <h2 className="text-3xl font-semibold mb-2">Connect Your Calendly</h2>
      <p className="text-gray-500 mb-4">
        {
          "You haven't connected Calendly yet. Click below to authorize and let reps schedule meetings through your link."
        }
      </p>
      <Button onClick={handleConnectCalendly} className="py-2 px-4 rounded-md">
        Connect Calendly
      </Button>
    </div>
  );
};

export default CalendlyLinkInput;
