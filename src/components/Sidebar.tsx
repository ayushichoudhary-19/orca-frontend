"use client";

import {
  IconLayoutDashboard,
  IconCalendar,
  IconSchool,
  IconUserSearch,
  IconUsers,
  IconChevronDown,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
  label: string;
  icon?: React.ComponentType<{ size: number; stroke: number }>;
  path: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: IconLayoutDashboard,
    path: "/dashboard",
    children: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "AI Call Learnings", path: "/dashboard/ai-call-learnings" },
      { label: "Analytics", path: "/dashboard/analytics" },
    ],
  },
  {
    label: "Meetings",
    icon: IconCalendar,
    path: "/meetings",
  },
  {
    label: "Knowledge",
    icon: IconSchool,
    path: "/knowledge",
    children: [
      { label: "Your Trainings", path: "/knowledge/trainings" },
      { label: "Dialer context", path: "/knowledge/dialer-context" },
    ],
  },
  {
    label: "Sales Representative",
    icon: IconUserSearch,
    path: "/sales-rep",
    children: [
      { label: "Active Representative", path: "/sales-rep/active" },
      { label: "Pending Representative", path: "/sales-rep/pending" },
      { label: "Blocked Representative", path: "/sales-rep/blocked" },
    ],
  },
  {
    label: "Leads",
    icon: IconUsers,
    path: "/leads",
    children: [
      { label: "Leads & Ingestions", path: "/leads/ingestions" },
      { label: "Suppression lists", path: "/leads/suppression-lists" },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    const path = window.location.pathname;
    const parentItem = navItems.find((item) => item.children?.some((child) => child.path === path));
    if (parentItem) {
      setExpandedItems([parentItem.label]);
      const currentChild = parentItem.children?.find((child) => child.path === path);
      if (currentChild) {
        setActiveItem(currentChild.label);
      }
    }
  }, []);

  const handleNavigate = (path: string, label: string) => {
    setActiveItem(label);
    router.push(path);
  };

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="w-[280px] h-screen bg-white border-r border-none shadow-[4px_0_34px_rgba(0,0,0,0.05)] flex flex-col"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-lighter h-[60px] text-primary font-bold text-[28px] px-6 py-4 tracking-wide flex items-center"
      >
        ORCA
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-tinteddark5 tracking-wide px-6 mt-7 my-4 font-semibold"
        >
          MAIN MENU
        </motion.div>
        <div className="flex flex-col mb-4">
          {navItems.map((item) => {
            const isActive = activeItem === item.label;
            const isExpanded = expandedItems.includes(item.label);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item.label}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (hasChildren) {
                      toggleExpand(item.label);
                    } else {
                      handleNavigate(item.path, item.label);
                    }
                  }}
                  className={`flex items-center bg-white p-5 justify-between w-full text-sm font-medium transition-all ${
                    isActive || isExpanded
                      ? "text-primary border-l-2 border-l-primary border-y-0 border-r-0"
                      : "text-tinteddark7 border-none hover:cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && (
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <item.icon size={18} stroke={1.5} />
                      </motion.div>
                    )}
                    <span>{item.label}</span>
                  </div>
                  {hasChildren && (
                    <motion.span
                      animate={{ rotate: isExpanded ? 0 : -90 }}
                      className={isExpanded ? "text-primary" : "text-tinteddark7"}
                    >
                      <IconChevronDown size={18} stroke={1.5} />
                    </motion.span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {isExpanded && hasChildren && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      {item.children?.map((child) => {
                        const isChildActive = activeItem === child.label;

                        return (
                          <motion.button
                            key={child.label}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleNavigate(child.path, child.label)}
                            className={`w-full text-left pr-5 py-2 pl-12 my-2 text-sm border-none font-semibold ${
                              isChildActive
                                ? "bg-lighter text-primary"
                                : "text-tinteddark7 bg-white hover:cursor-pointer transition-all"
                            }`}
                          >
                            {child.label}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
}
