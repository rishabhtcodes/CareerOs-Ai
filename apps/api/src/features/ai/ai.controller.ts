import type { RequestHandler } from "express";
import { z } from "zod";
import { createCoachResponse } from "./ai.service";

const coachSchema = z.object({
  message: z.string().min(2).max(2000)
});

export const coach: RequestHandler = async (req, res, next) => {
  try {
    const payload = coachSchema.parse(req.body);
    const response = await createCoachResponse(req.user!.sub, payload.message);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
