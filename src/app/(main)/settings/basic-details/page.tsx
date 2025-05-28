"use client";
import { useState } from "react";
import { Button, Divider, Switch } from "@mantine/core";
import { axiosClient } from "@/lib/axiosClient";
import CustomTextInput from "@/components/Utils/CustomTextInput";
import Image from "next/image";

export default function BasicDetailsPage() {
  const [form, setForm] = useState({
    campaignName: "",
    companyWebsite: "",
    employeeCount: "",
    industry: "",
    pitch: "",
    hiringNotes: "",
    weeklyEmailReports: false,
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    await axiosClient.patch("/api/campaign/settings/basic", form);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Basic Details</h1>
      <Divider />
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Share basic details</h2>
        <p className="text-gray-600 mb-6">Tell us about your account so we can determine if we are a good fit</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium">Campaign name</label>
            <CustomTextInput
              placeholder="Name Here"
              value={form.campaignName}
              onChange={(e) => handleChange("campaignName", e.target.value)}
              height={20}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Campaign website URL</label>
            <CustomTextInput
              placeholder="www.abcd.com"
              value={form.companyWebsite}
              onChange={(e) => handleChange("companyWebsite", e.target.value)}
              height={20}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium">Total employee count</label>
            <CustomTextInput
              placeholder="e.g. 100"
              value={form.employeeCount}
              onChange={(e) => handleChange("employeeCount", e.target.value)}
              height={20}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Which industry best describes your company?</label>
            <CustomTextInput
              placeholder="Select industry"
              value={form.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
              height={20}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium">Please provide an elevator pitch of your campaign</label>
            <CustomTextInput
              placeholder="Type Here..."
              value={form.pitch}
              onChange={(e) => handleChange("pitch", e.target.value)}
              multiline={true}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Full time hiring</label>
            <CustomTextInput
              placeholder="Type Here..."
              value={form.hiringNotes}
              onChange={(e) => handleChange("hiringNotes", e.target.value)}
              multiline={true}
            />
            <div className="text-sm text-gray-500 mt-1">This is how your campaign will be displayed to cold callers</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center">
            <Switch
              checked={form.weeklyEmailReports}
              onChange={(e) => handleChange("weeklyEmailReports", e.currentTarget.checked)}
              color="#6D57FC"
              classNames={{
                root: "mr-3"
              }}
            />
            <div>
              <div className="font-medium">Weekly email reports</div>
              <div className="text-sm text-gray-500">Receive an overview of trends on a weekly basis via email</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium">Campaign logo (optional)</label>
            <div className="rounded-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50"
            style={{
                border: "1px solid #E7E7E9"
            }}
            >
              <div className="text-center">
                <Image
                src="/icons/upload.svg"
                width={20}
                height={20}
              alt="upload icon"
              />

                <div className="text-sm font-medium text-[#6D57FC]">Add Image</div>
                </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">File must be a maximum of 1MB</div>
            
          </div>
          <div>
            <label className="block mb-2 font-medium">Link a Full-time SDR or Sales Job Description Here</label>
            <div className="rounded-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50"
            style={{
                border: "1px solid #E7E7E9"
            }}
            >
              <div className="text-center">
                <Image
                src="/icons/upload.svg"
                width={20}
                height={20}
              alt="upload icon"
              />
              <div className="text-sm font-medium text-[#6D57FC]">Add PDF</div>
              </div>
              
            </div>
            <div className="text-xs text-gray-500 mt-1">Did you know you can hire full-time sales reps from anyone in our network who is crushing your campaign? Post a job description here to attract even more talent.</div>
             
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="bg-[#6D57FC] hover:bg-[#5A48D6] text-white px-8 py-2 rounded-md transition-colors"
      >
        Save
      </Button>
    </div>
  );
}