"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCampaignId } from "@/store/campaignSlice";
import { useCampaign } from "@/hooks/Campaign/useCampaign";
import { useLogout } from "@/hooks/Auth/useLogout";
import { RootState } from "@/store/store";
import { Select, Button, Container } from "@mantine/core";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const logout = useLogout();

  const businessId = useSelector((state: RootState) => state.membership.businessId);
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);

  const [campaigns, setCampaigns] = useState<{ label: string; value: string; status: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(campaignId);

  const { getByBusiness } = useCampaign();

  const isOnboarding = pathname.includes("onboarding");
  const isCampaignCreation = pathname.includes("/campaign/create");

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!businessId) return;

      try {
        const all = await getByBusiness(businessId);
        const mapped = all.map((c) => ({ label: c.campaignName, value: c._id, status: c.status }));
        
        if (isCampaignCreation) {
          const draftId = localStorage.getItem("draftCampaign");
          const currentDraft = mapped.find(c => c.value === draftId);
          if (currentDraft) {
            setSelected(currentDraft.value);
          }
        }
        
        setCampaigns([{ label: "+ Add New", value: "new", status: "NEW" }, ...mapped]);
        
        if (!campaignId && !isOnboarding && !isCampaignCreation) {
          const firstLaunched = mapped.find(c => c.status === "LAUNCHED");
          if (firstLaunched) {
            setSelected(firstLaunched.value);
            dispatch(setCampaignId(firstLaunched.value));
          }
        }
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      }
    };

    if (!isOnboarding) fetchCampaigns();
  }, [businessId, isOnboarding, isCampaignCreation]);

  const handleChange = (value: string | null) => {
    setSelected(value);
    if (!value) return;

    if (value === "new") {
      router.push("/campaign/create");
      return;
    }

    const selectedCampaign = campaigns.find((c) => c.value === value);
    if (!selectedCampaign) return;

    if (selectedCampaign.status === "DRAFT") {
      localStorage.setItem("draftCampaign", value);
      toast.info("Resuming your saved draft campaign");
      router.push("/campaign/create?step=hub");
    } else {
      dispatch(setCampaignId(value));
      router.push("/dashboard");
    }
  };

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`bg-white ${
        (isOnboarding || isCampaignCreation)
          ? "w-full"
          : "w-[90%] mx-auto left-[323px] rounded-b-[10px] px-5 py-2.5 h-[60px]"
      }`}
      style={{
        borderBottom: "1px solid #E7E7E9",
        ...(isOnboarding ? { height: "80px" } : { boxShadow: "0px 1px 2px 0px #0C0A1C1A" }),
      }}
    >
      <Container
        size="xl"
        className={`flex items-center justify-between h-full ${isOnboarding ? "px-4" : "px-0"}`}
      >
        <div className="flex items-center gap-4">
          {(isOnboarding || isCampaignCreation) && (
            <div className="text-3xl font-extrabold tracking-wide text-primary">ORCA</div>
          )}

          {!isOnboarding && (
            <Select
              placeholder={isCampaignCreation ? "Select Draft Campaign" : "Select Campaign"}
              data={campaigns}
              value={selected}
              onChange={handleChange}
              className="w-[250px]"
              size="sm"
              radius="md"
            />
          )}
        </div>

        <Button
          variant="filled"
          radius="md"
          size="md"
          style={{ boxShadow: "0px 3px 12px #4A3AFF2E" }}
          onClick={logout}
        >
          Logout
        </Button>
      </Container>
    </motion.div>
  );
};
