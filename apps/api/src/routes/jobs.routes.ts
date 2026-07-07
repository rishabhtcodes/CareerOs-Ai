import { Router } from "express";
import { analyzeJob, listJobs } from "../features/jobs/jobs.controller";
import { requireAuth } from "../middleware/auth";

export const jobsRouter = Router();

jobsRouter.get("/", requireAuth, listJobs);
jobsRouter.post("/analyze", requireAuth, analyzeJob);
