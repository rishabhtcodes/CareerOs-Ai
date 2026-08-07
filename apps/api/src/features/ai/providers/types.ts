/**
 * Unified LLM Provider Interface
 * Every AI provider implements this contract so the rest of the app
 * is completely decoupled from any specific model or vendor.
 */

export interface LLMOptions {
  /** Maximum tokens to generate (default: 600) */
  maxTokens?: number;
  /** Sampling temperature 0-1 (default: 0.7) */
  temperature?: number;
  /** System prompt to prepend (for models that support it separately) */
  systemPrompt?: string;
}

export interface LLMResponse {
  text: string;
  provider: ProviderName;
  model: string;
  /** Approximate tokens used, if reported by the API */
  tokensUsed?: number;
}

export type ProviderName =
  | "gemini"
  | "groq"
  | "openai"
  | "anthropic"
  | "mistral"
  | "ollama"
  | "local";

export interface LLMProvider {
  readonly name: ProviderName;
  readonly displayName: string;
  readonly model: string;
  /** True if the provider is properly configured (API key present, etc.) */
  isAvailable(): boolean;
  /**
   * Send a prompt and return the text response.
   * Returns null on error — never throws.
   */
  call(prompt: string, options?: LLMOptions): Promise<string | null>;
}

export interface ProviderInfo {
  name: ProviderName;
  displayName: string;
  model: string;
  available: boolean;
  description: string;
  speed: "fast" | "medium" | "slow";
  quality: "standard" | "good" | "excellent";
  free: boolean;
}
