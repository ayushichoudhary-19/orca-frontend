"use client";

import {
  IconPhoneCall,
  IconUsers,
  IconChartBar,
  IconLogout,
  IconSettings,
  IconMessageCircle,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useState } from "react";
import { Tooltip, UnstyledButton, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/Auth/useLogout";

const navItems = [
  { label: "Dialer", icon: IconPhoneCall, path: "/call" },
  { label: "Analytics", icon: IconChartBar, path: "/analytics" },
  { label: "Contacts", icon: IconUsers, path: "/contacts" },
  { label: "Messages", icon: IconMessageCircle, path: "/messages" },
  { label: "Settings", icon: IconSettings, path: "/settings" },
  { label: "Alerts", icon: IconAlertCircle, path: "/alerts" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Dialer");
  const router = useRouter();
  const logout = useLogout();

  const handleNavigate = (item: (typeof navItems)[number]) => {
    setActive(item.label);
    router.push(item.path);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-[72px] bg-primary flex flex-col items-center py-6 overflow-hidden">

      {/* Nav Items */}
      <Stack justify="center" gap={32} className="flex-1 mt-4">
        {navItems.map((item) => {
          const isActive = active === item.label;
          return (
            <Tooltip key={item.label} label={item.label} position="right" withArrow>
              <UnstyledButton
                onClick={() => handleNavigate(item)}
                className="w-full flex flex-col items-center justify-center transition-all"
              >
                <item.icon size={22} stroke={1.5} color={isActive ? "white" : "#bfd7ff"} />
                {isActive && <div className="w-1 h-1 bg-white rounded-full mt-1" />}
              </UnstyledButton>
            </Tooltip>
          );
        })}
      </Stack>

      {/* Logout */}
      <div className="pb-4">
        <Tooltip label="Logout" position="right" withArrow>
          <UnstyledButton
            onClick={logout}
            className="w-full flex items-center justify-center transition-all"
          >
            <IconLogout size={22} stroke={1.5} color="#bfd7ff" />
          </UnstyledButton>
        </Tooltip>
      </div>
    </div>
  );
}
