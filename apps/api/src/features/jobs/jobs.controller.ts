import type { RequestHandler } from "express";
import { z } from "zod";
import { ApiError } from "../../middleware/errorHandler";
import {
  analyzeJobDescription,
  readApplications,
  createApplication,
  updateApplication,
  deleteApplication
} from "./jobs.service";

const analyzeJobSchema = z.object({
  sourceUrl: z.string().url().optional(),
  description: z.string().min(40).optional()
}).refine((value) => value.sourceUrl || value.description, {
  message: "Provide a job URL or job description"
});

const createApplicationSchema = z.object({
  company: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  sourceUrl: z.string().url().optional().nullable(),
  status: z.enum(["SAVED", "APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED"]).optional(),
  matchScore: z.number().int().min(0).max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  appliedAt: z.string().datetime().optional().nullable()
});

const updateApplicationSchema = z.object({
  status: z.enum(["SAVED", "APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED"]).optional(),
  notes: z.string().max(2000).optional().nullable(),
  matchScore: z.number().int().min(0).max(100).optional().nullable(),
  appliedAt: z.string().datetime().optional().nullable()
});

export const listJobs: RequestHandler = async (req, res, next) => {
  try {
    const applications = await readApplications(req.user!.sub);
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

export const addJob: RequestHandler = async (req, res, next) => {
  try {
    const payload = createApplicationSchema.parse(req.body);
    const application = await createApplication(req.user!.sub, payload);
    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const editJob: RequestHandler = async (req, res, next) => {
  try {
    const payload = updateApplicationSchema.parse(req.body);
    const application = await updateApplication(req.user!.sub, req.params.id, payload);
    res.status(200).json(application);
  } catch (error) {
    if ((error as Error).message === "Not found") return next(new ApiError(404, "Application not found"));
    next(error);
  }
};

export const removeJob: RequestHandler = async (req, res, next) => {
  try {
    await deleteApplication(req.user!.sub, req.params.id);
    res.status(204).send();
  } catch (error) {
    if ((error as Error).message === "Not found") return next(new ApiError(404, "Application not found"));
    next(error);
  }
};

export const analyzeJob: RequestHandler = async (req, res, next) => {
  try {
    const payload = analyzeJobSchema.parse(req.body);
    const analysis = await analyzeJobDescription(req.user!.sub, payload);
    res.status(201).json({
      ...analysis,
      extractedSkills: JSON.parse(analysis.extractedSkills),
      missingSkills: JSON.parse(analysis.missingSkills),
      suggestions: JSON.parse(analysis.suggestions)
    });
  } catch (error) {
    next(error);
  }
};
