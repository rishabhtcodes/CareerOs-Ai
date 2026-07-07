import type { Request, Response } from "express";
import { createCoachResponse } from "./ai.service";

export async function coachHandler(req: Request, res: Response) {
  const userId = req.user!.sub;
  const { message } = req.body as { message: string };

  if (!message?.trim()) {
    res.status(400).json({ message: "message is required" });
    return;
  }

  const result = await createCoachResponse(userId, message.trim());
  res.json(result);
}
