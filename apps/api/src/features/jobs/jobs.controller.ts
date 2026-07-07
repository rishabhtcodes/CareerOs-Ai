import type { RequestHandler } from "express";
import { z } from "zod";
import { analyzeJobDescription, readApplications } from "./jobs.service";

const analyzeJobSchema = z.object({
  sourceUrl: z.string().url().optional(),
  description: z.string().min(40).optional()
}).refine((value) => value.sourceUrl || value.description, {
  message: "Provide a job URL or job description"
});

export const listJobs: RequestHandler = async (req, res, next) => {
  try {
    const applications = await readApplications(req.user!.sub);
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

export const analyzeJob: RequestHandler = async (req, res, next) => {
  try {
    const payload = analyzeJobSchema.parse(req.body);
    const analysis = await analyzeJobDescription(req.user!.sub, payload);
    res.status(201).json(analysis);
  } catch (error) {
    next(error);
  }
};
