import { Router } from "express";
import { coach } from "../features/ai/ai.controller";
import { requireAuth } from "../middleware/auth";

export const aiRouter = Router();

aiRouter.post("/coach", requireAuth, coach);
