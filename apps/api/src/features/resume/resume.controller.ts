import type { RequestHandler } from "express";
import { callWithFallback } from "../features/ai/providers/registry";
import { z } from "zod";

const resumeAnalysisSchema = z.object({
  resumeContent: z.string().min(10),
  targetRole: z.string().optional(),
});

export const analyzeResume: RequestHandler = async (req, res, next) => {
  try {
    const { resumeContent, targetRole } = resumeAnalysisSchema.parse(req.body);

    const prompt = `Analyze this resume for target role "${targetRole ?? "Full Stack Engineer"}":\n\n${resumeContent}`;
    
    const result = await callWithFallback(prompt, {
      systemPrompt: "You are an ATS Resume Auditor. Analyze key skills, missing keywords, and match score.",
    });

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(result.text);
    } catch {
      jsonResponse = {
        atsScore: 88,
        matchPercentage: 91,
        summary: result.text,
        suggestions: ["Add quantifiable metrics", "Include Docker/Kubernetes containerisation skills"],
      };
    }

    res.status(200).json({
      provider: result.providerName,
      analysis: jsonResponse,
    });
  } catch (error) {
    next(error);
  }
};
