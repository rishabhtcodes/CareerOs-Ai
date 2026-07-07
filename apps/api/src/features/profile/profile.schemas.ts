import { z } from "zod";

export const profileSchema = z.object({
  headline: z.string().max(120).optional(),
  location: z.string().max(120).optional(),
  bio: z.string().max(1000).optional(),
  targetRole: z.string().max(80).optional(),
  skills: z.array(z.string().min(1)).default([])
});
