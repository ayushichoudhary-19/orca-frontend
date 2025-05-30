"use client";
import { useState } from "react";
import { Switch, Button, Divider } from "@mantine/core";
import { axiosClient } from "@/lib/axiosClient";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import toast from "react-hot-toast";

const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

export default function CampaignControlsPage() {
  const [controls, setControls] = useState({
    selfSourced: false,
    dialerAllowed: false,
    marketplaceVisible: true,
    callbacksAllowed: false,
  });
  const [hours, setHours] = useState<Record<string, boolean>>({
    SUNDAY: false,
    MONDAY: false,
    TUESDAY: false,
    WEDNESDAY: false,
    THURSDAY: false,
    FRIDAY: false,
    SATURDAY: false,
  });

  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);

  const handleToggle = (key: string) => {
    setControls((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const toggleDay = (day: string) => {
    setHours((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const saveControls = async () => {
    try {
      await axiosClient.patch(`/api/campaign/${campaignId}/settings/controls`, { controls, hours });
      toast.success("Controls saved");
    } catch (error) {
      toast.error("Error saving controls");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold mb-0">Campaign Controls</h1>
        <Divider />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Self Sourced</h3>
              <p className="text-sm text-gray-500">
                Allow callers to add their own self sourced leads to your campaign
              </p>
            </div>
            <Switch
              checked={controls.selfSourced}
              onChange={() => handleToggle("selfSourced")}
              color="#6D57FC"
              size="lg"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Dialer Allowed</h3>
              <p className="text-sm text-gray-500">
                Control when callers can access and use the dialer to make calls
              </p>
            </div>
            <Switch
              checked={controls.dialerAllowed}
              onChange={() => handleToggle("dialerAllowed")}
              color="#6D57FC"
              size="lg"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Callbacks, Booked Meetings (Direct Calls) Allowed</h3>
              <p className="text-sm text-gray-500">
                Control if callers are able to see existing callbacks & booked meetings
              </p>
            </div>
            <Switch
              checked={controls.callbacksAllowed}
              onChange={() => handleToggle("callbacksAllowed")}
              color="#6D57FC"
              size="lg"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Campaign Visible On Marketplace</h3>
              <p className="text-sm text-gray-500">
                Control when your campaign displays in the ORCA marketplace
              </p>
            </div>
            <Switch
              checked={controls.marketplaceVisible}
              onChange={() => handleToggle("marketplaceVisible")}
              color="#6D57FC"
              size="lg"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-medium mb-6">Calling hours</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {days.map((day) => (
            <motion.button
              key={day}
              onClick={() => toggleDay(day)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-3 rounded-md border 
                hover:bg-lighter hover:cursor-pointer border-none
                ${hours[day] ? "border-2 border-primary bg-lighter" : "border-gray-200 bg-white"}`}
            >
              <div className="text-center">
                <div className="font-medium">{day.charAt(0) + day.slice(1).toLowerCase()}</div>
                <div className="text-sm text-gray-500">{hours[day] ? "Open" : "Closed"}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Button onClick={saveControls} size="md">
        Save
      </Button>
    </div>
  );
}
