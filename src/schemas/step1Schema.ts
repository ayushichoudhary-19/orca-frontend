import { z } from 'zod';

export const step1Schema = z.object({
  companySize: z
    .string()
    .min(1, 'Please select your company size'),
  referralSource: z
    .string()
    .min(1, 'Please tell us how you heard about us')
    .max(200, 'Response too long, please keep it under 200 characters'),
});

export type Step1FormValues = z.infer<typeof step1Schema>;