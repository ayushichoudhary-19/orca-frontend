import { z } from "zod";

export const contactFormSchema = z
  .object({
    allowAutoLeads: z.boolean().default(false),
    companySize: z.string().trim().min(1, "Company size is required"),
    
    // Change to numbers with validation
    revenueTargetMin: z
      .number({ required_error: "Minimum revenue is required" })
      .min(1, "Revenue must be at least 1"),
    revenueTargetMax: z
      .number({ required_error: "Maximum revenue is required" })
      .min(1, "Revenue must be at least 1"),
    
    // Change to array of strings for tag inputs
    titles: z.array(z.string()).min(1, "At least one title is required"),
    companyLocation: z.array(z.string()).min(1, "At least one company location is required"),
    employeeLocation: z.array(z.string()).min(1, "At least one employee location is required"),
    industry: z.array(z.string()).min(1, "At least one industry is required"),
    keywords: z.array(z.string()).min(1, "At least one keyword is required"),
  })
  .refine((data) => data.revenueTargetMax > data.revenueTargetMin, {
    message: "Maximum revenue must be greater than minimum revenue",
    path: ["revenueTargetMax"],
  });

export type ContactFormValues = z.infer<typeof contactFormSchema>;