import { z } from "zod";

export const profileSchema = z.object({
  headline: z.string().max(120).optional(),
  location: z.string().max(120).optional(),
  bio: z.string().max(1000).optional(),
  targetRole: z.string().max(80).optional(),
  skills: z.array(z.string().min(1)).default([])
});

// Experience
export const experienceSchema = z.object({
  company: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  location: z.string().max(120).optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().max(2000).optional().nullable(),
  highlights: z.array(z.string()).default([])
});

// Education
export const educationSchema = z.object({
  school: z.string().min(1).max(160),
  degree: z.string().min(1).max(120),
  field: z.string().max(120).optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  description: z.string().max(2000).optional().nullable()
});

// Project
export const projectSchema = z.object({
  name: z.string().min(1).max(120),
  summary: z.string().min(1).max(2000),
  url: z.string().url().optional().nullable(),
  repository: z.string().url().optional().nullable(),
  techStack: z.array(z.string()).default([]),
  impact: z.string().max(500).optional().nullable()
});

// Skill
export const skillSchema = z.object({
  name: z.string().min(1).max(60),
  category: z.string().max(60).optional().nullable(),
  level: z.number().int().min(1).max(5).default(3)
});

export const skillsBulkSchema = z.object({
  skills: z.array(skillSchema)
});

// Certificate
export const certificateSchema = z.object({
  name: z.string().min(1).max(160),
  issuer: z.string().min(1).max(120),
  issuedAt: z.string().datetime().optional().nullable(),
  credential: z.string().max(200).optional().nullable()
});

// Achievement
export const achievementSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().max(1000).optional().nullable()
});

// Social Link
export const socialLinkSchema = z.object({
  label: z.string().min(1).max(60),
  url: z.string().url()
});
