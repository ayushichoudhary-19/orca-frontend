"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Container } from "@mantine/core";
import ContextEditorPanel from "@/components/Context/ContextEditor";

export default function ContextPage() {
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);

  return (
    <Container size="xl" className="pt-8 pb-16">
      {campaignId ? <ContextEditorPanel campaignId={campaignId} /> : null}
    </Container>
  );
}
