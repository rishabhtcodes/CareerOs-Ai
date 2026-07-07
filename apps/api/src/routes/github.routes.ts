import { Router } from "express";
import { connectGitHub, disconnectGitHub, getGitHub } from "../features/github/github.controller";
import { requireAuth } from "../middleware/auth";

export const githubRouter = Router();

githubRouter.get("/", requireAuth, getGitHub);
githubRouter.post("/connect", requireAuth, connectGitHub);
githubRouter.delete("/disconnect", requireAuth, disconnectGitHub);
