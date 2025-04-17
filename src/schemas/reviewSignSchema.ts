import { z } from 'zod';

export const reviewSignSchema = z.object({
  companyLegalName: z
    .string()
    .min(1, 'Company legal name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  signatoryName: z
    .string()
    .min(1, 'Signatory name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  signatoryTitle: z
    .string()
    .min(1, 'Signatory title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(50, 'Title must be less than 50 characters'),
  agreed: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to the terms',
    }),
});

export type ReviewSignFormValues = z.infer<typeof reviewSignSchema>;