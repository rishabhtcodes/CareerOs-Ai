import type { LLMOptions, LLMProvider, ProviderName } from "./types";
import { env } from "../../../config/env";

export class GeminiProvider implements LLMProvider {
  readonly name: ProviderName = "gemini";
  readonly displayName = "Google Gemini";
  readonly model = "gemini-2.0-flash";

  isAvailable() {
    return !!env.GEMINI_API_KEY;
  }

  async call(prompt: string, options: LLMOptions = {}): Promise<string | null> {
    if (!env.GEMINI_API_KEY) return null;
    const { maxTokens = 600, temperature = 0.7 } = options;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: maxTokens, temperature },
          }),
        }
      );
      if (!response.ok) {
        const err = await response.text();
        console.error(`[Gemini] HTTP ${response.status}:`, err.slice(0, 200));
        return null;
      }
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    } catch (error) {
      console.error("[Gemini] call failed:", (error as Error).message);
      return null;
    }
  }
}
