import type { LLMOptions, LLMProvider, ProviderName } from "./types";
import { env } from "../../../config/env";

export class GroqProvider implements LLMProvider {
  readonly name: ProviderName = "groq";
  readonly displayName = "Groq (Llama 3.3)";
  readonly model = "llama-3.3-70b-versatile";

  isAvailable() {
    return !!env.GROQ_API_KEY;
  }

  async call(prompt: string, options: LLMOptions = {}): Promise<string | null> {
    if (!env.GROQ_API_KEY) return null;
    const { maxTokens = 600, temperature = 0.7, systemPrompt } = options;

    const messages: { role: string; content: string }[] = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
      });
      if (!response.ok) {
        console.error(`[Groq] HTTP ${response.status}`);
        return null;
      }
      const data = await response.json();
      return data?.choices?.[0]?.message?.content ?? null;
    } catch (error) {
      console.error("[Groq] call failed:", (error as Error).message);
      return null;
    }
  }
}
