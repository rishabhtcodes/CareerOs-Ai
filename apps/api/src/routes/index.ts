import { Router } from "express";
import { aiRouter } from "./ai.routes";
import { authRouter } from "./auth.routes";
import { dashboardRouter } from "./dashboard.routes";
import { jobsRouter } from "./jobs.routes";
import { profileRouter } from "./profile.routes";
import { resumeRouter } from "./resume.routes";
import { githubRouter } from "./github.routes";
import { intelligenceRouter } from "./intelligence.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/resume", resumeRouter);
apiRouter.use("/jobs", jobsRouter);
apiRouter.use("/ai", aiRouter);
apiRouter.use("/github", githubRouter);
apiRouter.use("/intelligence", intelligenceRouter);
