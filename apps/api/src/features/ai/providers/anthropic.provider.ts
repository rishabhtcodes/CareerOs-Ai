import type { LLMOptions, LLMProvider, ProviderName } from "./types";
import { env } from "../../../config/env";

export class AnthropicProvider implements LLMProvider {
  readonly name: ProviderName = "anthropic";
  readonly displayName = "Anthropic Claude";
  readonly model = "claude-3-5-haiku-20241022";

  isAvailable() {
    return !!env.ANTHROPIC_API_KEY;
  }

  async call(prompt: string, options: LLMOptions = {}): Promise<string | null> {
    if (!env.ANTHROPIC_API_KEY) return null;
    const { maxTokens = 600, temperature = 0.7, systemPrompt } = options;

    try {
      const body: Record<string, unknown> = {
        model: this.model,
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: "user", content: prompt }],
      };
      if (systemPrompt) body.system = systemPrompt;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error(`[Anthropic] HTTP ${response.status}`);
        return null;
      }
      const data = await response.json();
      return data?.content?.[0]?.text ?? null;
    } catch (error) {
      console.error("[Anthropic] call failed:", (error as Error).message);
      return null;
    }
  }
}
