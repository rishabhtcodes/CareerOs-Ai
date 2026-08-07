import { Router } from "express";
import { analyzeJob, addJob, editJob, listJobs, removeJob } from "../features/jobs/jobs.controller";
import { requireAuth } from "../middleware/auth";

export const jobsRouter = Router();

jobsRouter.get("/", requireAuth, listJobs);
jobsRouter.post("/", requireAuth, addJob);
jobsRouter.put("/:id", requireAuth, editJob);
jobsRouter.delete("/:id", requireAuth, removeJob);
jobsRouter.post("/analyze", requireAuth, analyzeJob);
