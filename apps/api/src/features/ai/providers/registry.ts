import type { LLMProvider, ProviderInfo, ProviderName } from "./types";
import { GeminiProvider } from "./gemini.provider";
import { GroqProvider } from "./groq.provider";
import { OpenAIProvider } from "./openai.provider";
import { AnthropicProvider } from "./anthropic.provider";
import { MistralProvider } from "./mistral.provider";
import { OllamaProvider } from "./ollama.provider";
import { RuleEngineProvider } from "./ruleengine.provider";

// ── Singleton instances ────────────────────────────────────────────────────────

const ruleEngine = new RuleEngineProvider();

const PROVIDERS: Record<ProviderName, LLMProvider | null> = {
  gemini:    new GeminiProvider(),
  groq:      new GroqProvider(),
  openai:    new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
  mistral:   new MistralProvider(),
  ollama:    new OllamaProvider(),
  local:     ruleEngine,
};

/** Default fallback order when user preference is not set or unavailable */
const DEFAULT_FALLBACK_ORDER: ProviderName[] = [
  "gemini",
  "groq",
  "openai",
  "anthropic",
  "mistral",
  "ollama",
  "local", // Always available free fallback
];

// ── Public API ─────────────────────────────────────────────────────────────────

export function getProvider(name: ProviderName): LLMProvider | null {
  return PROVIDERS[name] ?? null;
}

export function buildFallbackChain(preferred: string | null): LLMProvider[] {
  const ordered: ProviderName[] = [];

  if (preferred && preferred in PROVIDERS) {
    ordered.push(preferred as ProviderName);
  }

  for (const name of DEFAULT_FALLBACK_ORDER) {
    if (!ordered.includes(name)) ordered.push(name);
  }

  const chain = ordered
    .map((name) => PROVIDERS[name])
    .filter((p): p is LLMProvider => p !== null && p.isAvailable());

  // Guarantee RuleEngineProvider is at the end of every chain so callWithFallback NEVER returns null
  if (!chain.some((p) => p.name === "local")) {
    chain.push(ruleEngine);
  }

  return chain;
}

export async function callWithFallback(
  prompt: string,
  options: {
    preferred?: string | null;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  } = {}
): Promise<{ text: string; providerName: ProviderName }> {
  const chain = buildFallbackChain(options.preferred ?? null);

  for (const provider of chain) {
    try {
      const text = await provider.call(prompt, {
        maxTokens: options.maxTokens,
        temperature: options.temperature,
        systemPrompt: options.systemPrompt,
      });
      if (text) return { text, providerName: provider.name };
    } catch {
      // Continue to next provider in fallback chain
    }
  }

  // Guaranteed rule engine response if all fail
  const fallbackText = await ruleEngine.call(prompt, options);
  return { text: fallbackText ?? "CareerOS System Ready", providerName: "local" };
}

export function getAllProviderInfo(): ProviderInfo[] {
  const META: Record<ProviderName, Omit<ProviderInfo, "name" | "available">> = {
    gemini:    { displayName: "Google Gemini", model: "gemini-2.0-flash", requiresApiKey: true, freeTierAvailable: true },
    groq:      { displayName: "Groq Llama 3", model: "llama-3.3-70b-versatile", requiresApiKey: true, freeTierAvailable: true },
    openai:    { displayName: "OpenAI GPT-4o mini", model: "gpt-4o-mini", requiresApiKey: true, freeTierAvailable: false },
    anthropic: { displayName: "Anthropic Claude", model: "claude-3-5-haiku", requiresApiKey: true, freeTierAvailable: false },
    mistral:   { displayName: "Mistral AI", model: "mistral-small-latest", requiresApiKey: true, freeTierAvailable: false },
    ollama:    { displayName: "Ollama (Local)", model: "llama3.2", requiresApiKey: false, freeTierAvailable: true },
    local:     { displayName: "Permanent Free AI Engine", model: "careeros-rule-v1", requiresApiKey: false, freeTierAvailable: true },
  };

  return (Object.keys(PROVIDERS) as ProviderName[]).map((name) => {
    const p = PROVIDERS[name];
    const meta = META[name];
    return {
      name,
      displayName: meta?.displayName ?? name,
      model: meta?.model ?? "default",
      available: p ? p.isAvailable() : true,
      requiresApiKey: meta?.requiresApiKey ?? false,
      freeTierAvailable: meta?.freeTierAvailable ?? true,
    };
  });
}
