"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconLayoutGrid, IconLayoutList, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { axiosClient } from "@/lib/axiosClient";
import { Button, Divider, Group, TextInput } from "@mantine/core";
import Image from "next/image";
import { ViewToggleButton } from "@/components/Training/ViewToggleButton";
import CustomBadge from "@/components/Leads/CustomBadge";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Campaign {
  _id: string;
  campaignName: string;
  elevatorPitch: string;
  qualifiedLeadPrice: number;
  industry: string[];
  logoImageUrl: string;
  companyLocation: string[];
  businessName: string;
  campaignTag: string;
}

export default function CampaignMarketplace() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [campaignView, setCampaignView] = useState<"my" | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [businessFilter, setBusinessFilter] = useState<string | null>(null);
  const [uniqueBusinesses, setUniqueBusinesses] = useState<string[]>([]);

  const router = useRouter();
  const salesRepId = useSelector((state: RootState) => state.auth.user?.uid);

  useEffect(() => {
    fetchCampaigns();
  }, [campaignView, salesRepId]);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      let response;

      if (campaignView === "my" && salesRepId) {
        response = await axiosClient.post("/api/campaign/my-campaigns", {
          salesRepId,
        });
      } else {
        response = await axiosClient.get("/api/campaign/public");
      }

      setCampaigns(response.data);
      setFilteredCampaigns(response.data);

      const businesses = [...new Set(response.data.map((c: Campaign) => c.businessName))];
      setUniqueBusinesses(businesses);

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = campaigns;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (campaign) =>
          campaign.campaignName.toLowerCase().includes(query) ||
          campaign.businessName.toLowerCase().includes(query) ||
          campaign.elevatorPitch.toLowerCase().includes(query) ||
          campaign.industry.some((ind) => ind.toLowerCase().includes(query))
      );
    }

    if (businessFilter) {
      result = result.filter((campaign) => campaign.businessName === businessFilter);
    }

    if (priceFilter) {
      result = result.filter((campaign) => campaign.qualifiedLeadPrice <= priceFilter);
    }

    setFilteredCampaigns(result);
  }, [searchQuery, businessFilter, priceFilter, campaigns]);

  const resetFilters = () => {
    setSearchQuery("");
    setBusinessFilter(null);
    setPriceFilter(null);
  };

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <div
          className="inline-flex rounded-md overflow-hidden h-[40px] justify-between items-center bg-white"
          style={{
            border: "1px solid #E4E4E7",
          }}
        >
          <button
            className={`px-6 py-3 border-none ${campaignView === "my" ? "bg-[#6D57FC] text-white" : "text-gray-700 hover:bg-gray-50 bg-white"}`}
            onClick={() => setCampaignView("my")}
          >
            My Campaigns
          </button>
          <button
            className={`px-6 py-3 border-none ${campaignView === "all" ? "bg-[#6D57FC] text-white" : "text-gray-700 hover:bg-gray-50 bg-white"}`}
            onClick={() => setCampaignView("all")}
          >
            All Campaigns
          </button>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold mb-4 md:mb-0 text-darker">
            Total {filteredCampaigns.length} campaign{filteredCampaigns.length > 1 ? "s" : ""}
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex gap-4">
              <TextInput
                placeholder="Search Here"
                rightSection={
                  <Image src="/icons/search.svg" alt="Search Icon" width={16} height={16} />
                }
                className="w-64"
                styles={{
                  input: {
                    borderRadius: "8px",
                    border: "1px solid #E7E7E9",
                    height: "50px",
                  },
                }}
              />
              <Button
                variant="outline"
                className="flex items-center justify-between font-normal gap-2 bg-white text-darker"
                styles={{
                  root: {
                    border: "1px solid #E7E7E9",
                    height: "50px",
                    borderRadius: "8px",
                  },
                }}
              >
                <span>Filter By</span>
                <Image
                  src="/icons/filter.svg"
                  alt="Search Icon"
                  width={16}
                  height={16}
                  className="ml-2"
                />
              </Button>
            </div>
            <Group gap="xs">
              <ViewToggleButton
                icon={<IconLayoutGrid size={22} stroke={1.5} />}
                onClick={() => setViewMode("grid")}
                active={viewMode === "grid"}
              />
              <ViewToggleButton
                icon={<IconLayoutList size={22} stroke={1.5} />}
                onClick={() => setViewMode("list")}
                active={viewMode === "list"}
              />
            </Group>
          </div>
        </div>
      </div>

      <Divider />

      {/* Filters panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-4"
        >
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Business</label>
                <select
                  className="p-2 border border-gray-200 rounded-md min-w-[200px]"
                  value={businessFilter || ""}
                  onChange={(e) => setBusinessFilter(e.target.value || null)}
                >
                  <option value="">All Businesses</option>
                  {uniqueBusinesses.map((business) => (
                    <option key={business} value={business}>
                      {business}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Max Price</label>
                <select
                  className="p-2 border border-gray-200 rounded-md min-w-[200px]"
                  value={priceFilter || ""}
                  onChange={(e) => setPriceFilter(Number(e.target.value) || null)}
                >
                  <option value="">Any Price</option>
                  <option value="200">Up to $200</option>
                  <option value="300">Up to $300</option>
                  <option value="400">Up to $400</option>
                  <option value="500">Up to $500</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="border-t border-gray-200 mb-6"></div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D57FC]"></div>
        </div>
      )}

      {!isLoading && viewMode === "grid" && (
        <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-white rounded-lg w-[360px] min-h-[300px] overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              style={{ border: "1px solid #E4E4E7" }}
              onClick={() => router.push(`/campaigns/${campaign._id}`)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="w-16 h-16 flex items-center justify-center rounded-lg"
                    style={{
                      border: "1px solid #B7B6BB",
                    }}
                  >
                    <Image
                      src="/icons/flash.svg"
                      alt={campaign.campaignName}
                      width={30}
                      height={30}
                      className="object-contain"
                    />
                  </div>
                  <CustomBadge value={campaign.campaignTag} />
                </div>
                <h3 className="text-[16px] text-darker font-bold mb-2">{campaign.campaignName}</h3>
                <p className="text-sm mb-4 line-clamp-3 text-tinteddark7">
                  {campaign.elevatorPitch}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Qualified lead:</p>
                    <p className="text-xl font-bold">${campaign.qualifiedLeadPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && viewMode === "list" && (
        <div className="px-6 space-y-4">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/campaigns/${campaign._id}`)}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-start gap-6 md:w-2/3">
                    <div
                      className="w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-lg"
                      style={{
                        border: "1px solid #B7B6BB",
                      }}
                    >
                      <Image
                        src="/icons/flash.svg"
                        alt={campaign.campaignName}
                        width={30}
                        height={30}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[16px] text-darker font-bold">
                          {campaign.campaignName}
                        </h3>
                        <div className="md:hidden">
                          <CustomBadge value={campaign.campaignTag} />
                        </div>
                      </div>
                      <p className="mb-2 line-clamp-2 text-sm text-tinteddark7">
                        {campaign.elevatorPitch}
                      </p>
                      <div className="hidden md:block">
                        <div className="flex gap-2 flex-wrap">
                          {campaign.industry.slice(0, 2).map((ind, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {ind}
                            </span>
                          ))}
                          {campaign.industry.length > 2 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              +{campaign.industry.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center md:w-1/3 mt-4 md:mt-0">
                    <div>
                      <p className="text-sm text-gray-500">Qualified lead:</p>
                      <p className="text-xl font-bold">${campaign.qualifiedLeadPrice}</p>
                    </div>
                    <Link href={`/campaigns/${campaign._id}`} className="no-underline">
                      <Button className="text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#5457e5] transition-colors">
                        View Details
                        <IconArrowRight size={16} className="ml-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredCampaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl text-gray-500 mb-4">No campaigns found</p>
          <Button onClick={resetFilters}>
                  Reset Filters
                </Button>
        </div>
      )}
    </div>
  );
}
