import { Router } from "express";
import { getProfile, upsertProfile } from "../features/profile/profile.controller";
import { requireAuth } from "../middleware/auth";

export const profileRouter = Router();

profileRouter.get("/", requireAuth, getProfile);
profileRouter.put("/", requireAuth, upsertProfile);
