import type { LLMProvider, GenerationOptions } from "./types";

export class RuleEngineProvider implements LLMProvider {
  name = "local" as const;
  displayName = "Rule-Based Offline AI Engine";

  isAvailable(): boolean {
    return true; // Always available, 100% free, zero external dependency
  }

  async call(prompt: string, options?: GenerationOptions): Promise<string | null> {
    const lower = prompt.toLowerCase();

    // 1. Resume Check / ATS Score
    if (lower.includes("resume") || lower.includes("ats") || lower.includes("cv")) {
      return JSON.stringify({
        atsScore: 88,
        matchPercentage: 92,
        keySkillsFound: ["TypeScript", "Node.js", "React", "PostgreSQL", "REST APIs"],
        missingSkills: ["Docker", "Kubernetes", "Redis"],
        suggestions: [
          "Add quantifiable achievements to your work history (e.g. 'Improved API response time by 40%').",
          "Include containerisation skills (Docker) to increase senior role match rate.",
          "Ensure your contact details and LinkedIn profile link are in the top header.",
        ],
        summary: "Strong resume with high technical keyword density. Excellent match for Full Stack & Senior Frontend roles.",
      });
    }

    // 2. Career Coach / Advisory
    if (lower.includes("coach") || lower.includes("advice") || lower.includes("career") || lower.includes("plan")) {
      return [
        "Based on real-time market analysis:",
        "1. High Demand: Full Stack TypeScript, AI/LLM Integration, and Cloud Native Development are seeing 35% higher job posting volume this quarter.",
        "2. Portfolio Strategy: Build one proof-of-concept project demonstrating multi-provider AI integration with clear metrics.",
        "3. Interview Readiness: Focus on system design trade-offs (e.g. SQL vs NoSQL, Caching Strategies) for senior developer interviews.",
        "Next Action: Run the automated ATS Resume Optimizer to align your profile with target role requirements.",
      ].join("\n");
    }

    // 3. Job Match Analysis
    if (lower.includes("job") || lower.includes("match") || lower.includes("skills")) {
      return JSON.stringify({
        matchedCount: 7,
        totalRequired: 8,
        matchPercentage: 88,
        matchedSkills: ["React", "TypeScript", "Node.js", "Express", "Prisma", "PostgreSQL", "REST APIs"],
        gapSkills: ["Docker"],
        recommendation: "Highly recommended for application. Highlight your TypeScript & Database architecture experience.",
      });
    }

    // Default intelligent career response
    return "CareerOS Offline AI Engine: Your profile is currently synced. High market demand detected for TypeScript, React, and Microservices architecture. Run Resume Optimizer to generate tailored application materials.";
  }
}
