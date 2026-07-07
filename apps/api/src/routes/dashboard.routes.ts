import { Router } from "express";
import { getDashboard } from "../features/dashboard/dashboard.controller";
import { requireAuth } from "../middleware/auth";

export const dashboardRouter = Router();

dashboardRouter.get("/", requireAuth, getDashboard);
