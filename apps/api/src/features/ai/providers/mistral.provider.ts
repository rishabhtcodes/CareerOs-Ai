import type { LLMOptions, LLMProvider, ProviderName } from "./types";
import { env } from "../../../config/env";

export class MistralProvider implements LLMProvider {
  readonly name: ProviderName = "mistral";
  readonly displayName = "Mistral AI";
  readonly model = "mistral-small-latest";

  isAvailable() {
    return !!env.MISTRAL_API_KEY;
  }

  async call(prompt: string, options: LLMOptions = {}): Promise<string | null> {
    if (!env.MISTRAL_API_KEY) return null;
    const { maxTokens = 600, temperature = 0.7, systemPrompt } = options;

    const messages: { role: string; content: string }[] = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });

    try {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
      });
      if (!response.ok) {
        console.error(`[Mistral] HTTP ${response.status}`);
        return null;
      }
      const data = await response.json();
      return data?.choices?.[0]?.message?.content ?? null;
    } catch (error) {
      console.error("[Mistral] call failed:", (error as Error).message);
      return null;
    }
  }
}
