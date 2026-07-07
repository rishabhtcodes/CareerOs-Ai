import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(24),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:8081"),
  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);
