import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('A valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>['body'];
