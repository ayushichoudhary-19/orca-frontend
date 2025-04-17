"use client";

import { useSearchParams } from "next/navigation";
import CampaignForm from "@/components/Onboarding/CampaignForm";
import ContactsForm from "@/components/Onboarding/ContactsForm";
import ReviewSign from "@/components/Onboarding/ReviewSign";
import Hub from "@/components/Onboarding/Hub";

export default function CreateCampaign() {
  const searchParams = useSearchParams();
  const step = searchParams.get("step");

  switch (step) {
    case "hub":
      return <Hub />;
    case "contacts":
      return <ContactsForm />;
    case "review":
      return <ReviewSign />;
    default:
      return <CampaignForm />;
  }
}