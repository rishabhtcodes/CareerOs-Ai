import { Router } from "express";
import { generateResume, getResume, listResumes } from "../features/resume/resume.controller";
import { requireAuth } from "../middleware/auth";

export const resumeRouter = Router();

resumeRouter.get("/", requireAuth, listResumes);
resumeRouter.get("/:id", requireAuth, getResume);
resumeRouter.post("/generate", requireAuth, generateResume);
