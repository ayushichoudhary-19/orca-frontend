"use client";
import React, { useEffect, useState } from "react";
import CalendlyEmbed from "@/components/Meetings/CalendlyEmbed";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { axiosClient } from "@/lib/axiosClient";

const RepSchedulePage = () => {
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);
  const repId = useSelector((state: RootState) => state.auth.user?.uid);

  const [rawLink, setRawLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCalendlyLink = async () => {
      try {
        const response = await axiosClient.get(`/api/campaign/${campaignId}`);
        const { calendlyLink } = response.data;
        setRawLink(calendlyLink);
      } catch (err) {
        setError("Failed to fetch Calendly link.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendlyLink();
  }, [campaignId]);

  const finalLink = rawLink
    .replace("{{campaignId}}", campaignId || '')
    .replace("{{salesRepId}}", repId || "default-rep");
if(finalLink){
    console.log(finalLink);
}

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Schedule a Meeting</h1>
      <CalendlyEmbed link={finalLink} />
    </div>
  );
};

export default RepSchedulePage;
