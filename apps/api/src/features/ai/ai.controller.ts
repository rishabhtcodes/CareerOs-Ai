import type { RequestHandler } from "express";
import { createCoachResponse, getCoachHistory } from "./ai.service";
import { z } from "zod";

const coachSchema = z.object({ message: z.string().min(1).max(1000) });

export const coach: RequestHandler = async (req, res, next) => {
  try {
    const { message } = coachSchema.parse(req.body);
    const result = await createCoachResponse(req.user!.sub, message);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const history: RequestHandler = async (req, res, next) => {
  try {
    const limit = Math.min(50, parseInt(req.query.limit as string ?? "20") || 20);
    const items = await getCoachHistory(req.user!.sub, limit);
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};
