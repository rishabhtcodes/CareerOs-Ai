import { Router } from "express";
import { generateResume, listResumes } from "../features/resume/resume.controller";
import { requireAuth } from "../middleware/auth";

export const resumeRouter = Router();

resumeRouter.get("/", requireAuth, listResumes);
resumeRouter.post("/generate", requireAuth, generateResume);
