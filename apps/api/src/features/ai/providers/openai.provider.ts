import type { LLMOptions, LLMProvider, ProviderName } from "./types";
import { env } from "../../../config/env";

export class OpenAIProvider implements LLMProvider {
  readonly name: ProviderName = "openai";
  readonly displayName = "OpenAI GPT-4o mini";
  readonly model = "gpt-4o-mini";

  isAvailable() {
    return !!env.OPENAI_API_KEY;
  }

  async call(prompt: string, options: LLMOptions = {}): Promise<string | null> {
    if (!env.OPENAI_API_KEY) return null;
    const { maxTokens = 600, temperature = 0.7, systemPrompt } = options;

    const messages: { role: string; content: string }[] = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
      });
      if (!response.ok) {
        console.error(`[OpenAI] HTTP ${response.status}`);
        return null;
      }
      const data = await response.json();
      return data?.choices?.[0]?.message?.content ?? null;
    } catch (error) {
      console.error("[OpenAI] call failed:", (error as Error).message);
      return null;
    }
  }
}
