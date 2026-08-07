import { Router } from "express";
import { analyzeResume } from "../features/resume/resume.controller";

export const resumeRouter = Router();

// Public / Auth free resume analysis endpoint
resumeRouter.post("/analyze", analyzeResume);
