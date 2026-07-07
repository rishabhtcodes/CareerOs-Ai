import type { RequestHandler } from "express";
import { profileSchema } from "./profile.schemas";
import { readProfile, saveProfile } from "./profile.service";

export const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const profile = await readProfile(req.user!.sub);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const upsertProfile: RequestHandler = async (req, res, next) => {
  try {
    const payload = profileSchema.parse(req.body);
    const profile = await saveProfile(req.user!.sub, payload);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};
