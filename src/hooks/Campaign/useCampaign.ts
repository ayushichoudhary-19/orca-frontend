import { useState } from "react";
import { axiosClient } from "@/lib/axiosClient";
import { Campaign } from "@/types/campaign";
import { toast } from "@/lib/toast";
import { seedDefaultTrainings } from "../Training/useTraining";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useCampaign = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user?.uid);

  const createCampaign = async (payload: Partial<Campaign>) => {
    try {
      setLoading(true);
      const res = await axiosClient.post("/api/campaign", payload);
      return res.data as Campaign;
    } catch (err) {
      console.error("Failed to create campaign", err);
      toast.error("Could not create campaign");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      const res = await axiosClient.get(`/api/campaign/${id}`);
      return res.data as Campaign;
    } catch (err) {
      console.error(`Failed to fetch campaign ${id}`, err);
      throw err;
    }
  };

  const getByBusiness = async (businessId: string) => {
    try {
      const res = await axiosClient.get(`/api/campaign/business/${businessId}`);
      return res.data as Campaign[];
    } catch (err) {
      console.error(`Failed to fetch campaigns for business ${businessId}`, err);
      throw err;
    }
  };

  const signCampaign = async (
    id: string,
    payload: {
      signatoryName: string;
      signatoryTitle: string;
      signatureBase64: string;
    }
  ) => {
    try {
      const res = await axiosClient.patch(`/api/campaign/${id}/sign`, payload);
      if(res.status === 200){
        seedDefaultTrainings(id, user as string);
      }
      return res.data;
    } catch (err) {
      console.error(`Failed to sign campaign ${id}`, err);
      toast.error("Could not sign campaign");
      throw err;
    }
  };

  const updateCampaignContacts = async (
    campaignId: string,
    contacts: string,
    uploadedCsvFileName: string
  ) => {
    try {
      const res = await axiosClient.put(`/api/campaign/${campaignId}/contacts`, {
        contacts,
        uploadedCsvFileName,
      });
      return res.data;
    } catch (err) {
      console.error(`Failed to update contacts for campaign ${campaignId}`, err);
      toast.error("Could not update contacts");
      throw err;
    }
  };

  const addContactsToCampaign = async (
    campaignId: string,
    contacts: string,
    uploadedCsvFileName: string
  ) => {
    try {
      const res = await axiosClient.post(`/api/campaign/${campaignId}/contacts`, {
        contacts,
        uploadedCsvFileName,
      });
      return res.data;
    } catch (err) {
      console.error(`Failed to add contacts to campaign ${campaignId}`, err);
      toast.error("Could not add contacts");
      throw err;
    }
  };

  const addIdealCustomerDetails = async (
    campaignId: string,
    details: {
      revenueTarget: { min: number; max: number };
      titles: string[];
      companyLocation: string[];
      employeeLocation: string[];
      industry: string[];
      keywords: string[];
      allowAutoLeads: boolean;
      companySize: string;
    }
  ) => {
    try {
      const res = await axiosClient.post(`/api/campaign/${campaignId}/details`, details);
      return res.data;
    } catch (err) {
      console.error(`Failed to add ICP details for campaign ${campaignId}`, err);
      toast.error("Could not save ideal customer details");
      throw err;
    }
  };

  const getCampaignStatus = async (campaignId: string) => {
    try {
      const res = await axiosClient.get(`/api/campaign/${campaignId}/status`);
      return res.data.status as "DRAFT" | "ACTIVE" | "COMPLETED";
    } catch (err) {
      console.error(`Failed to fetch status for campaign ${campaignId}`, err);
      throw err;
    }
  };

  const getApprovedActiveCampaignsForSdr = async () => {
    try {
      const res = await axiosClient.get(`/api/campaign/sales-rep-campaigns/${user}?type=approved`);
      return (res.data as Campaign[]).filter((c) => c.status === "ACTIVE");
    } catch (err) {
      console.error("Failed to fetch SDR campaigns", err);
      throw err;
    }
  };
  

  return {
    createCampaign,
    getById,
    getByBusiness,
    signCampaign,
    updateCampaignContacts,
    addContactsToCampaign,
    addIdealCustomerDetails,
    getCampaignStatus,
    getApprovedActiveCampaignsForSdr,
    loading,
  };
};
