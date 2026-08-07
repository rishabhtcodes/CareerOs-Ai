import type { RequestHandler } from "express";
import { prisma } from "../config/prisma";
import { hashPassword, comparePassword, generateToken } from "../utils/jwt";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name ?? email.split("@")[0],
        settings: { create: {} },
      },
    });

    const token = generateToken({ sub: user.id, email: user.email });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken({ sub: user.id, email: user.email });
    res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
};

export const getMe: RequestHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      select: { id: true, email: true, name: true, targetRole: true, headline: true },
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
