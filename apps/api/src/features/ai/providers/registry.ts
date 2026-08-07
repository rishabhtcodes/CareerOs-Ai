import type { LLMProvider, ProviderInfo, ProviderName } from "./types";
import { GeminiProvider } from "./gemini.provider";
import { GroqProvider } from "./groq.provider";
import { OpenAIProvider } from "./openai.provider";
import { AnthropicProvider } from "./anthropic.provider";
import { MistralProvider } from "./mistral.provider";
import { OllamaProvider } from "./ollama.provider";

// ── Singleton instances ────────────────────────────────────────────────────────

const PROVIDERS: Record<ProviderName, LLMProvider | null> = {
  gemini:    new GeminiProvider(),
  groq:      new GroqProvider(),
  openai:    new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
  mistral:   new MistralProvider(),
  ollama:    new OllamaProvider(),
  local:     null, // virtual fallback — not a real provider
};

/** Default fallback order when user preference is not set or unavailable */
const DEFAULT_FALLBACK_ORDER: ProviderName[] = [
  "gemini",
  "groq",
  "openai",
  "anthropic",
  "mistral",
  "ollama",
];

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Return a single provider by name.
 * Throws if the name is unknown.
 */
export function getProvider(name: ProviderName): LLMProvider | null {
  if (name === "local") return null;
  return PROVIDERS[name] ?? null;
}

/**
 * Build an ordered list of providers to try.
 * @param preferred  - the user's preferred provider (from Settings)
 * @returns ordered array of available LLMProvider instances
 */
export function buildFallbackChain(preferred: string | null): LLMProvider[] {
  const ordered: ProviderName[] = [];

  // Put preferred first (if it's a valid, available name)
  if (preferred && preferred !== "local" && preferred in PROVIDERS) {
    ordered.push(preferred as ProviderName);
  }

  // Append the rest in default order, skipping the preferred one
  for (const name of DEFAULT_FALLBACK_ORDER) {
    if (!ordered.includes(name)) ordered.push(name);
  }

  // Filter to only those that are available (key configured, etc.)
  return ordered
    .map((name) => PROVIDERS[name])
    .filter((p): p is LLMProvider => p !== null && p.isAvailable());
}

/**
 * Try each provider in the fallback chain until one succeeds.
 * Returns { text, providerName } or null if all fail.
 */
export async function callWithFallback(
  prompt: string,
  options: {
    preferred?: string | null;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  } = {}
): Promise<{ text: string; providerName: ProviderName } | null> {
  const chain = buildFallbackChain(options.preferred ?? null);

  for (const provider of chain) {
    const text = await provider.call(prompt, {
      maxTokens: options.maxTokens,
      temperature: options.temperature,
      systemPrompt: options.systemPrompt,
    });
    if (text) return { text, providerName: provider.name };
  }

  return null; // all providers failed
}

/**
 * Return metadata about all providers and their availability.
 * Used by GET /api/ai/providers.
 */
export function getAllProviderInfo(): ProviderInfo[] {
  const META: Record<ProviderName, Omit<ProviderInfo, "name" | "available">> = {
    gemini: {
      displayName: "Google Gemini",
      model: "gemini-2.0-flash",
      description: "Google's latest multimodal model. Fast, accurate, and great for structured output.",
      speed: "fast",
      quality: "excellent",
      free: true,
    },
    groq: {
      displayName: "Groq (Llama 3.3)",
      model: "llama-3.3-70b-versatile",
      description: "Ultra-fast inference via Groq hardware. Best for low-latency responses.",
      speed: "fast",
      quality: "good",
      free: true,
    },
    openai: {
      displayName: "OpenAI GPT-4o mini",
      model: "gpt-4o-mini",
      description: "OpenAI's cost-efficient model. Excellent reasoning and instruction following.",
      speed: "medium",
      quality: "excellent",
      free: false,
    },
    anthropic: {
      displayName: "Anthropic Claude",
      model: "claude-3-5-haiku-20241022",
      description: "Claude Haiku — very fast, great for analysis, safe and reliable.",
      speed: "fast",
      quality: "excellent",
      free: false,
    },
    mistral: {
      displayName: "Mistral AI",
      model: "mistral-small-latest",
      description: "EU-hosted, GDPR-friendly. Efficient and strong at structured tasks.",
      speed: "fast",
      quality: "good",
      free: false,
    },
    ollama: {
      displayName: "Ollama (Local)",
      model: "llama3.2",
      description: "Fully local inference. No API cost, complete privacy. Requires Ollama installed.",
      speed: "slow",
      quality: "standard",
      free: true,
    },
    local: {
      displayName: "Built-in Fallback",
      model: "rule-based",
      description: "Offline rule-based fallback. Always available, no AI.",
      speed: "fast",
      quality: "standard",
      free: true,
    },
  };

  return (Object.keys(META) as ProviderName[]).map((name) => ({
    name,
    available: name === "local" ? true : (PROVIDERS[name]?.isAvailable() ?? false),
    ...META[name],
  }));
}
