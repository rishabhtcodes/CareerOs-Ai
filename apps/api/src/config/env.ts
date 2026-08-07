import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(24),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:8081"),

  // ── AI Providers ──────────────────────────────────────────────────────────────
  /** Google Gemini (default, free tier available) — https://aistudio.google.com */
  GEMINI_API_KEY: z.string().optional(),

  /** Groq — ultra-fast Llama inference (free tier) — https://console.groq.com */
  GROQ_API_KEY: z.string().optional(),

  /** OpenAI GPT-4o mini — https://platform.openai.com */
  OPENAI_API_KEY: z.string().optional(),

  /** Anthropic Claude Haiku — https://console.anthropic.com */
  ANTHROPIC_API_KEY: z.string().optional(),

  /** Mistral AI — https://console.mistral.ai */
  MISTRAL_API_KEY: z.string().optional(),

  /** Ollama local URL — defaults to http://localhost:11434 */
  OLLAMA_BASE_URL: z.string().url().optional(),

  /** Ollama model name — defaults to llama3.2 */
  OLLAMA_MODEL: z.string().optional(),
});

export const env = envSchema.parse(process.env);
