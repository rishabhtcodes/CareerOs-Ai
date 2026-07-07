import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { ApiError } from "../../middleware/errorHandler";

export async function createAccount(input: { name: string; email: string; password: string }) {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      settings: { create: {} }
    },
    select: { id: true, name: true, email: true }
  });

  return { user, token: signToken(user.id, user.email) };
}

export async function loginAccount(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token: signToken(user.id, user.email)
  };
}

function signToken(userId: string, email: string) {
  return jwt.sign({ sub: userId, email }, env.JWT_SECRET, { expiresIn: "7d" });
}
