import type { RequestHandler } from "express";
import { connectGitHubProfile, disconnectGitHubProfile, fetchGitHubProfile } from "./github.service";
import { z } from "zod";

function mapProfile(p: any) {
  if (!p) return null;
  return {
    id: p.id,
    username: p.username,
    avatarUrl: p.profileUrl,
    repoCount: p.repositories ? JSON.parse(p.repositories) : 0,
    totalStars: p.stars || 0,
    totalCommits: p.contributions ? JSON.parse(p.contributions) : 0,
    topLanguages: p.languages ? JSON.parse(p.languages) : [],
    syncedAt: p.lastSyncedAt || p.updatedAt,
  };
}

export const getGitHub: RequestHandler = async (req, res, next) => {
  try {
    const profile = await fetchGitHubProfile(req.user!.sub);
    res.json(mapProfile(profile));
  } catch (error) {
    next(error);
  }
};

const connectSchema = z.object({ username: z.string().min(1) });

export const connectGitHub: RequestHandler = async (req, res, next) => {
  try {
    const { username } = connectSchema.parse(req.body);
    const profile = await connectGitHubProfile(req.user!.sub, username);
    res.status(201).json(mapProfile(profile));
  } catch (error) {
    next(error);
  }
};

export const disconnectGitHub: RequestHandler = async (req, res, next) => {
  try {
    await disconnectGitHubProfile(req.user!.sub);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
