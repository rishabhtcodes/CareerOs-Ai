import type { LLMOptions, LLMProvider, ProviderName } from "./types";
import { env } from "../../../config/env";

/**
 * Ollama — local LLM inference, zero API cost, fully private.
 * Requires Ollama installed and running: https://ollama.ai
 * Defaults to http://localhost:11434 and model llama3.2
 * Configure via OLLAMA_BASE_URL and OLLAMA_MODEL env vars.
 */
export class OllamaProvider implements LLMProvider {
  readonly name: ProviderName = "ollama";
  readonly displayName = "Ollama (Local)";
  readonly model: string;
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = env.OLLAMA_BASE_URL ?? "http://localhost:11434";
    this.model = env.OLLAMA_MODEL ?? "llama3.2";
  }

  isAvailable() {
    // Always "configured" — runtime availability depends on Ollama running
    return true;
  }

  async call(prompt: string, options: LLMOptions = {}): Promise<string | null> {
    const { maxTokens = 600, temperature = 0.7, systemPrompt } = options;

    const messages: { role: string; content: string }[] = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: false,
          options: {
            temperature,
            num_predict: maxTokens,
          },
        }),
        // Ollama can be slow — allow up to 60 seconds
        signal: AbortSignal.timeout(60_000),
      });
      if (!response.ok) {
        console.error(`[Ollama] HTTP ${response.status}`);
        return null;
      }
      const data = await response.json();
      return data?.message?.content ?? null;
    } catch (error) {
      if ((error as Error).name === "TimeoutError") {
        console.error("[Ollama] request timed out after 60s");
      } else {
        console.error("[Ollama] call failed:", (error as Error).message);
      }
      return null;
    }
  }
}
