"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCampaignId } from "@/store/campaignSlice";
import { markAsRead } from "@/store/notificationSlice";
import { useCampaign } from "@/hooks/Campaign/useCampaign";
import { useLogout } from "@/hooks/Auth/useLogout";
import { RootState } from "@/store/store";
import { Select, Button, Container, Group, ActionIcon, Menu } from "@mantine/core";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import Image from "next/image";
import { IconUser } from "@tabler/icons-react";

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const logout = useLogout();

  const notifications = useSelector((state: RootState) => state.notification.list);
  const hasUnreadPosts = notifications.some((n) => n.type === "post" && !n.read);
  const hasUnreadMessages = notifications.some((n) => n.type === "message" && !n.read);

  const user = useSelector((state: RootState) => state.auth.user);
  const businessId = user?.role === "admin" ? user.businessId : null;
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);
  const isSdr = user?.role === "sdr";

  const [campaigns, setCampaigns] = useState<{ label: string; value: string; status: string }[]>(
    []
  );
  const [hasFetchedCampaigns, setHasFetchedCampaigns] = useState(false);
  const [selected, setSelected] = useState<string | null>(campaignId);

  const { getByBusiness } = useCampaign();

  const isOnboarding = pathname.includes("onboarding");
  const isCampaignCreation = pathname.includes("/campaign/create");

  const isActive = (path: string) => pathname?.startsWith(path);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!businessId || hasFetchedCampaigns) return;
  
      try {
        const all = await getByBusiness(businessId);
        const mapped = all.map((c) => ({
          label: c.campaignName,
          value: c._id,
          status: c.status,
        }));
  
        if (isCampaignCreation) {
          const draftId = localStorage.getItem("draftCampaign");
          const currentDraft = mapped.find((c) => c.value === draftId);
          if (currentDraft) setSelected(currentDraft.value);
        }
  
        setCampaigns([{ label: "+ Add New", value: "new", status: "NEW" }, ...mapped]);
        setHasFetchedCampaigns(true);
  
        if (!campaignId && !isOnboarding && !isCampaignCreation) {
          const firstLaunched = mapped.find((c) => c.status === "LAUNCHED");
          if (firstLaunched) {
            setSelected(firstLaunched.value);
            dispatch(setCampaignId(firstLaunched.value));
          }
        }
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      }
    };
  
    if (!isSdr && !isOnboarding) fetchCampaigns();
  }, [businessId, isOnboarding, isCampaignCreation, campaignId, isSdr, hasFetchedCampaigns]);  

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
        isOnboarding || isCampaignCreation
          ? "w-full px-5 py-2.5"
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

          {!isOnboarding && !isSdr && (
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

        {isOnboarding || isCampaignCreation ? (
          <Button
            variant="filled"
            radius="md"
            size="md"
            style={{ boxShadow: "0px 3px 12px #4A3AFF2E" }}
            onClick={logout}
          >
            Logout
          </Button>
        ) : isSdr ? (
          <Group>
            <ActionIcon
              className={`relative ${
                isActive("/sales-floor")
                  ? "bg-primary text-white"
                  : "bg-white border-tinteddark1 text-tinteddark7 hover:bg-lighter"
              } rounded-md`}
              onClick={() => {
                if (hasUnreadPosts) dispatch(markAsRead("post"));
                router.push("/sales-floor");
              }}
              size={40}
            >
              <Image
                src={isActive("/sales-floor") ? "/icons/globewhite.svg" : "/icons/globeblack.svg"}
                height={20}
                width={20}
                alt="sales-floor"
              />
              {hasUnreadPosts && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </ActionIcon>

            <ActionIcon
              className={`relative ${
                isActive("/messages")
                  ? "bg-primary text-white"
                  : "bg-white border-tinteddark1 text-tinteddark7 hover:bg-lighter"
              } rounded-md`}
              onClick={() => {
                if (hasUnreadMessages) dispatch(markAsRead("message"));
                router.push("/messages");
              }}
              size={40}
            >
              <Image
                src={isActive("/messages") ? "/icons/msgwhite.svg" : "/icons/msgblack.svg"}
                height={20}
                width={20}
                alt="messages"
              />
              {hasUnreadMessages && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </ActionIcon>

            <Menu position="bottom-end" shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon
                  className={`${
                    isActive("/profile")
                      ? "bg-primary text-white"
                      : "bg-white border-tinteddark1 text-tinteddark7 hover:bg-lighter"
                  } rounded-md`}
                  size={40}
                >
                   <IconUser size={20} stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => router.push("/profile")}>Profile</Menu.Item>
                <Menu.Item onClick={logout} color="red">
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        ) : (
          <Group>
            <ActionIcon
              className={`relative ${
                isActive("/sales-floor")
                  ? "bg-primary text-white"
                  : "bg-white border-tinteddark1 text-tinteddark7 hover:bg-lighter"
              } rounded-md`}
              onClick={() => {
                if (hasUnreadPosts) dispatch(markAsRead("post"));
                router.push("/sales-floor");
              }}
              size={40}
            >
              <Image
                src={isActive("/sales-floor") ? "/icons/globewhite.svg" : "/icons/globeblack.svg"}
                height={20}
                width={20}
                alt="sales-floor"
              />
              {hasUnreadPosts && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </ActionIcon>

            <ActionIcon
              className={`relative ${
                isActive("/messages")
                  ? "bg-primary text-white"
                  : "bg-white border-tinteddark1 text-tinteddark7 hover:bg-lighter"
              } rounded-md`}
              onClick={() => {
                if (hasUnreadMessages) dispatch(markAsRead("message"));
                router.push("/messages");
              }}
              size={40}
            >
              <Image
                src={isActive("/messages") ? "/icons/msgwhite.svg" : "/icons/msgblack.svg"}
                height={20}
                width={20}
                alt="messages"
              />
              {hasUnreadMessages && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </ActionIcon>

            <ActionIcon
              className={`${
                isActive("/settings")
                  ? "bg-primary text-white"
                  : "bg-white border-tinteddark1 text-tinteddark7 hover:bg-lighter"
              } rounded-md`}
              onClick={() => router.push("/settings")}
              size={40}
            >
              <Image
                src={isActive("/settings") ? "/icons/settingwhite.svg" : "/icons/settingblack.svg"}
                height={20}
                width={20}
                alt="settings"
              />
            </ActionIcon>

            <Menu position="bottom-end" shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon
                  className={`${
                    isActive("/profile")
                      ? "bg-primary text-white"
                      : "bg-white border-tinteddark1 text-tinteddark7 hover:bg-lighter"
                  } rounded-md`}
                  size={40}
                >
                <IconUser size={20} stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => router.push("/profile")}>Profile</Menu.Item>
                <Menu.Item onClick={logout} color="red">
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        )}
      </Container>
    </motion.div>
  );
};
