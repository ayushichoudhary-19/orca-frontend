import { useState } from "react";
import { axiosClient } from "@/lib/axiosClient";
import { Campaign } from "@/types/campaign";

export const useCampaign = () => {
  const [loading, setLoading] = useState(false);

  const createCampaign = async (payload: Partial<Campaign>) => {
    setLoading(true);
    const res = await axiosClient.post("/api/campaign", payload);
    setLoading(false);
    return res.data as Campaign;
  };

  const getById = async (id: string) => {
    const res = await axiosClient.get(`/api/campaign/${id}`);
    return res.data as Campaign;
  };

  const getByBusiness = async (businessId: string) => {
    const res = await axiosClient.get(`/api/campaign/business/${businessId}`);
    return res.data as Campaign[];
  };

  const signCampaign = async (
    id: string,
    payload: {
      signatoryName: string;
      signatoryTitle: string;
      signatureBase64: string;
    }
  ) => {
    const res = await axiosClient.patch(`/api/campaign/${id}/sign`, payload);
    return res.data;
  };

  const updateCampaignContacts = async (
    campaignId: string,
    contacts: string,
    uploadedCsvFileName: string
  ) => {
    const res = await axiosClient.put(`/api/campaign/${campaignId}/contacts`, {
      contacts,
      uploadedCsvFileName,
    });
    return res.data;
  };

  const addContactsToCampaign = async (
    campaignId: string,
    contacts: string,
    uploadedCsvFileName: string
  ) => {
    const res = await axiosClient.post(`/api/campaign/${campaignId}/contacts`, {
      contacts,
      uploadedCsvFileName,
    });
    return res.data;
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
    const res = await axiosClient.post(`/api/campaign/${campaignId}/details`, details);
    return res.data;
  };

  const getCampaignStatus = async (campaignId: string) => {
    const res = await axiosClient.get(`/api/campaign/${campaignId}/status`);
    return res.data.status as "DRAFT" | "ACTIVE" | "COMPLETED" ;
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
    loading,
  };
};
