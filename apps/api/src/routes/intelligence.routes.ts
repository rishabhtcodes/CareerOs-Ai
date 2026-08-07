import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getIntelligence, refreshIntelligence } from "../features/intelligence/intelligence.controller";

export const intelligenceRouter = Router();

// GET /api/intelligence — fetch latest market report + personalized insights
intelligenceRouter.get("/", requireAuth, getIntelligence);

// POST /api/intelligence/refresh — manually trigger a new intelligence cycle
intelligenceRouter.post("/refresh", requireAuth, refreshIntelligence);
