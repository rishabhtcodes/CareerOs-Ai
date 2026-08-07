import type { RequestHandler } from "express";
import { readResumes, readResumeById, createResumeDraft } from "./resume.service";
import { z } from "zod";
import { ApiError } from "../../middleware/errorHandler";

const generateSchema = z.object({
  type: z.enum(["frontend", "fullstack", "python", "ai", "custom"]),
  targetJobDescription: z.string().max(3000).optional()
});

export const listResumes: RequestHandler = async (req, res, next) => {
  try {
    const resumes = await readResumes(req.user!.sub);
    res.status(200).json(resumes);
  } catch (error) {
    next(error);
  }
};

export const getResume: RequestHandler = async (req, res, next) => {
  try {
    const resume = await readResumeById(req.user!.sub, req.params.id);
    if (!resume) return next(new ApiError(404, "Resume not found"));
    res.status(200).json(resume);
  } catch (error) {
    next(error);
  }
};

export const generateResume: RequestHandler = async (req, res, next) => {
  try {
    const payload = generateSchema.parse(req.body);
    const resume = await createResumeDraft(req.user!.sub, payload);
    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
};
