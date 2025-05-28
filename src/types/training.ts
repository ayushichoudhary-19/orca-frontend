export type TrainingType =
  | "company_overview"
  | "product_overview"
  | "buyer_persona"
  | "competition"
  | "qualification_criteria"
  | "objection_handling";

export interface Section {
  title: string;
  content: string;
}

export interface Training {
  _id: string;
  campaignId: string;
  type?: TrainingType;
  title: string;
  description: string;
  sections: Section[];
  isVisible: boolean;
  isPublished: boolean;
  sortOrder: number;
  lastSavedAt: string;
  lastEditedBy: string;
}
