import type { RequestHandler } from "express";
import { ApiError } from "../../middleware/errorHandler";
import {
  profileSchema,
  experienceSchema,
  educationSchema,
  projectSchema,
  skillsBulkSchema,
  certificateSchema,
  achievementSchema,
  socialLinkSchema
} from "./profile.schemas";
import {
  readProfile,
  saveProfile,
  createExperience, updateExperience, deleteExperience,
  createEducation, updateEducation, deleteEducation,
  createProject, updateProject, deleteProject,
  replaceSkills,
  createAchievement, updateAchievement, deleteAchievement,
  createCertificate, deleteCertificate,
  createSocialLink, deleteSocialLink
} from "./profile.service";

function formatProfile(profile: any) {
  if (!profile) return profile;
  return {
    ...profile,
    experience: profile.experience?.map((exp: any) => ({
      ...exp,
      highlights: typeof exp.highlights === "string" ? JSON.parse(exp.highlights || "[]") : exp.highlights
    })),
    projects: profile.projects?.map((proj: any) => ({
      ...proj,
      techStack: typeof proj.techStack === "string" ? JSON.parse(proj.techStack || "[]") : proj.techStack
    }))
  };
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const profile = await readProfile(req.user!.sub);
    res.status(200).json(formatProfile(profile));
  } catch (error) {
    next(error);
  }
};

export const upsertProfile: RequestHandler = async (req, res, next) => {
  try {
    const payload = profileSchema.parse(req.body);
    const profile = await saveProfile(req.user!.sub, payload);
    res.status(200).json(formatProfile(profile));
  } catch (error) {
    next(error);
  }
};

// ─── Experience ───────────────────────────────────────────────────────────────

export const addExperience: RequestHandler = async (req, res, next) => {
  try {
    const payload = experienceSchema.parse(req.body);
    const result = await createExperience(req.user!.sub, payload);
    res.status(201).json({ ...result, highlights: JSON.parse(result.highlights || "[]") });
  } catch (error) {
    next(error);
  }
};

export const editExperience: RequestHandler = async (req, res, next) => {
  try {
    const payload = experienceSchema.partial().parse(req.body);
    const result = await updateExperience(req.user!.sub, req.params.id, payload);
    res.status(200).json({ ...result, highlights: JSON.parse(result.highlights || "[]") });
  } catch (error) {
    if ((error as Error).message === "Not found") return next(new ApiError(404, "Experience not found"));
    next(error);
  }
};

export const removeExperience: RequestHandler = async (req, res, next) => {
  try {
    await deleteExperience(req.user!.sub, req.params.id);
    res.status(204).send();
  } catch (error) {
    if ((error as Error).message === "Not found") return next(new ApiError(404, "Experience not found"));
    next(error);
  }
};

// ─── Education ────────────────────────────────────────────────────────────────

export const addEducation: RequestHandler = async (req, res, next) => {
  try {
    const payload = educationSchema.parse(req.body);
    const result = await createEducation(req.user!.sub, payload);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const editEducation: RequestHandler = async (req, res, next) => {
  try {
    const payload = educationSchema.partial().parse(req.body);
    const result = await updateEducation(req.user!.sub, req.params.id, payload);
    res.status(200).json(result);
  } catch (error) {
    if ((error as Error).message === "Not found") return next(new ApiError(404, "Education not found"));
    next(error);
  }
};

export const removeEducation: RequestHandler = async (req, res, next) => {
  try {
    await deleteEducation(req.user!.sub, req.params.id);
    res.status(204).send();
  } catch (error) {
    if ((error as Error).message === "Not found") return next(new ApiError(404, "Education not found"));
    next(error);
  }
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const addProject: RequestHandler = async (req, res, next) => {
  try {
    const payload = projectSchema.parse(req.body);
    const result = await createProject(req.user!.sub, payload);
    res.status(201).json({ ...result, techStack: JSON.parse(result.techStack || "[]") });
  } catch (error) {
    next(error);
  }
};

export const editProject: RequestHandler = async (req, res, next) => {
  try {
    const payload = projectSchema.partial().parse(req.body);
    const result = await updateProject(req.user!.sub, req.params.id, payload);
    res.status(200).json({ ...result, techStack: JSON.parse(result.techStack || "[]") });
  } catch (error) {
    if ((error as Error).message === "Not found") return next(new ApiError(404, "Project not found"));
    next(error);
  }
};

export const removeProject: RequestHandler = async (req, res, next) => {
  try {
    await deleteProject(req.user!.sub, req.params.id);
    res.status(204).send();
  } catch (error) {
    if ((error as Error).message === "Not found") return next(new ApiError(404, "Project not found"));
    next(error);
  }
};

// ─── Skills ───────────────────────────────────────────────────────────────────

export const updateSkills: RequestHandler = async (req, res, next) => {
  try {
    const { skills } = skillsBulkSchema.parse(req.body);
    await replaceSkills(req.user!.sub, skills);
    res.status(200).json({ message: "Skills updated", count: skills.length });
  } catch (error) {
    next(error);
  }
};

// ─── Achievements ─────────────────────────────────────────────────────────────

export const addAchievement: RequestHandler = async (req, res, next) => {
  try {
    const payload = achievementSchema.parse(req.body);
    const result = await createAchievement(req.user!.sub, payload);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const editAchievement: RequestHandler = async (req, res, next) => {
  try {
    const payload = achievementSchema.partial().parse(req.body);
    const result = await updateAchievement(req.user!.sub, req.params.id, payload);
    res.status(200).json(result);
  } catch (error) {
    if ((error as Error).message === "Not found") return next(new ApiError(404, "Achievement not found"));
    next(error);
  }
};

export const removeAchievement: RequestHandler = async (req, res, next) => {
  try {
    await deleteAchievement(req.user!.sub, req.params.id);
    res.status(204).send();
  } catch (error) {
    if ((error as Error).message === "Not found") return next(new ApiError(404, "Achievement not found"));
    next(error);
  }
};

// ─── Certificates ─────────────────────────────────────────────────────────────

export const addCertificate: RequestHandler = async (req, res, next) => {
  try {
    const payload = certificateSchema.parse(req.body);
    const result = await createCertificate(req.user!.sub, payload);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const removeCertificate: RequestHandler = async (req, res, next) => {
  try {
    await deleteCertificate(req.user!.sub, req.params.id);
    res.status(204).send();
  } catch (error) {
    if ((error as Error).message === "Not found") return next(new ApiError(404, "Certificate not found"));
    next(error);
  }
};

// ─── Social Links ─────────────────────────────────────────────────────────────

export const addSocialLink: RequestHandler = async (req, res, next) => {
  try {
    const payload = socialLinkSchema.parse(req.body);
    const result = await createSocialLink(req.user!.sub, payload);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const removeSocialLink: RequestHandler = async (req, res, next) => {
  try {
    await deleteSocialLink(req.user!.sub, req.params.id);
    res.status(204).send();
  } catch (error) {
    if ((error as Error).message === "Not found") return next(new ApiError(404, "Social link not found"));
    next(error);
  }
};
