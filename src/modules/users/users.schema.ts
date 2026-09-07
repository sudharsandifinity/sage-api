import { z } from 'zod';

export const userIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const createUserBodySchema = z.object({
  name: z.string().trim().min(1).max(50),
  email: z.email().max(50),
  status: z.string().trim().min(1).max(20).default('active'),
});

export const updateUserBodySchema = z.object({
  name: z.string().trim().min(1).max(50),
  email: z.email().max(50),
  status: z.string().trim().min(1).max(20).optional(),
});

export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type CreateUserBody = z.infer<typeof createUserBodySchema>;
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
