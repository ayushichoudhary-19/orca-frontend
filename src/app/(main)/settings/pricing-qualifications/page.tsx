"use client";
import { useState } from "react";
import { Button, Divider, Table } from "@mantine/core";
import { axiosClient } from "@/lib/axiosClient";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import toast from "react-hot-toast";

export default function PricingQualificationsPage() {
  const [price, setPrice] = useState(0);
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);

  const handleSave = async () => {
    try {
      await axiosClient.patch(`/api/campaign/${campaignId}/settings/qualification`, { price });
      toast.success("Price saved");
    } catch (error) {
      toast.error("Error saving price");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Pricing & qualifications</h1>
      <Divider />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-medium mb-4">Current price per qualified lead</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-xl font-medium">
              $
            </div>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value) || 0)}
              className="w-full pl-10 bg-transparent pr-4 py-4 text-3xl font-medium rounded-md"
              style={{
                border: "1px solid #E7E7E9",
                borderRadius: "0.5rem",
              }}
              placeholder="0"
            />
          </div>
          <div className="mt-2 text-sm">
            Use <span className="text-[#6D57FC]">this pricing calculator</span> to help estimate the
            price
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">What defines a qualified meeting for you?</h2>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <Table>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Criteria type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Input</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Payout</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm">Company Size</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Not Specified</td>
                  <td className="px-4 py-3 text-sm font-medium" rowSpan={4}>
                    ${price}
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm">Prospect Title</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Not Specified</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm">Company Industry</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Not Specified</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm">Problem / Pain</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Not Specified</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="mt-4 text-sm">
            Want to update your qualification criteria?{" "}
            <span className="text-[#6D57FC]">Contact us</span>
          </div>
        </div>
        <Button onClick={handleSave} className="mt-4 rounded-md h-[50px]">
          Save
        </Button>
      </div>
    </div>
  );
}
