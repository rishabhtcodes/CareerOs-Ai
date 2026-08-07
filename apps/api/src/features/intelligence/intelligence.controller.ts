import type { RequestHandler } from "express";
import {
  runIntelligenceCycle,
  getLatestReport,
  getPersonalizedInsights,
  isIntelligenceStale,
} from "../../intelligence/intelligence.service";

export const getIntelligence: RequestHandler = async (req, res, next) => {
  try {
    const [report, personalized] = await Promise.all([
      getLatestReport(),
      getPersonalizedInsights(req.user!.sub),
    ]);

    res.status(200).json({
      report,
      personalized: {
        gapSkills: personalized.gapSkills,
        marketMatchedSkills: personalized.marketMatchedSkills,
        suggestion: personalized.suggestion,
      },
      meta: {
        isStale: isIntelligenceStale(),
        hasData: !!report,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshIntelligence: RequestHandler = async (req, res, next) => {
  try {
    // Kick off a refresh in the background — don't wait for it to finish
    // so the client gets a quick acknowledgement
    runIntelligenceCycle(true).catch((err) =>
      console.error("[Intelligence API] Manual refresh error:", err)
    );

    res.status(202).json({
      message: "Intelligence refresh started. Check back in 30-60 seconds.",
      startedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
