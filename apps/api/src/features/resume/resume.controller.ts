import type { RequestHandler } from "express";
import { z } from "zod";
import { createResumeDraft, readResumes } from "./resume.service";

const generateResumeSchema = z.object({
  type: z.enum(["frontend", "fullstack", "python", "ai", "custom"]),
  targetJobDescription: z.string().optional()
});

export const listResumes: RequestHandler = async (req, res, next) => {
  try {
    const resumes = await readResumes(req.user!.sub);
    res.status(200).json(resumes);
  } catch (error) {
    next(error);
  }
};

export const generateResume: RequestHandler = async (req, res, next) => {
  try {
    const payload = generateResumeSchema.parse(req.body);
    const resume = await createResumeDraft(req.user!.sub, payload);
    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
};
