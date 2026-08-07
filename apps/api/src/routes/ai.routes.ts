import { Router } from "express";
import { coach, history } from "../features/ai/ai.controller";
import { requireAuth } from "../middleware/auth";

export const aiRouter = Router();

aiRouter.post("/coach", requireAuth, coach);
aiRouter.get("/history", requireAuth, history);
