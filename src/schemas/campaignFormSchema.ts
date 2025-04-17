import { z } from 'zod';

export const campaignFormSchema = z.object({
  companyWebsite: z
    .string()
    .min(1, 'Company website is required')
    .url('Please enter a valid URL')
    .refine((url) => !url.includes('www.websitename.com'), {
      message: 'Please enter your actual website URL',
    }),
  campaignName: z
    .string()
    .min(1, 'Campaign name is required')
    .min(3, 'Campaign name must be at least 3 characters')
    .max(50, 'Campaign name must be less than 50 characters'),
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;