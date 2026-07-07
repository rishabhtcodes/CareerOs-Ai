import type { RequestHandler } from "express";
import { createAccount, loginAccount } from "./auth.service";
import { loginSchema, signupSchema } from "./auth.schemas";

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const payload = signupSchema.parse(req.body);
    const result = await createAccount(payload);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await loginAccount(payload);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
