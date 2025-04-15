export interface Campaign {
    _id: string;
    businessId: string;
    campaignName: string;
    companyWebsite?: string;
    uploadedContacts?: string;
    uploadedCsvFilename?: string;
    allowAutoLeads: boolean;
    companySize?: string;
    revenueTarget?: { min?: number; max?: number };
    titles?: string[];
    companyLocation?: string[];
    employeeLocation?: string[];
    industry?: string[];
    keywords?: string[];
    status: string;
    signatoryName?: string;
    signatoryTitle?: string;
    signatureBase64?: string;
    signedAt?: string;
    createdAt: string;
  }
  