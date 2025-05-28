export interface Membership {
  _id: string;
  userId: string;
  businessId?: {
    _id: string;
    name: string;
    companyWebsite: string;
  };
  roleId: {
    _id: string;
    name: string;
    featureIds: { _id: string; name: string; label: string }[];
  };
  onboardingStep: number;
  createdAt: string;
}
