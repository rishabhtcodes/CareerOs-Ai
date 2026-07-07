import type { RequestHandler } from "express";
import { getDashboardSummary } from "./dashboard.service";

export const getDashboard: RequestHandler = async (req, res, next) => {
  try {
    const summary = await getDashboardSummary(req.user!.sub);
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
};
