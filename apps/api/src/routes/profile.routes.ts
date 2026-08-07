import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  getProfile,
  upsertProfile,
  addExperience, editExperience, removeExperience,
  addEducation, editEducation, removeEducation,
  addProject, editProject, removeProject,
  updateSkills,
  addAchievement, editAchievement, removeAchievement,
  addCertificate, removeCertificate,
  addSocialLink, removeSocialLink
} from "../features/profile/profile.controller";

export const profileRouter = Router();

// Core profile
profileRouter.get("/", requireAuth, getProfile);
profileRouter.put("/", requireAuth, upsertProfile);

// Experience
profileRouter.post("/experience", requireAuth, addExperience);
profileRouter.put("/experience/:id", requireAuth, editExperience);
profileRouter.delete("/experience/:id", requireAuth, removeExperience);

// Education
profileRouter.post("/education", requireAuth, addEducation);
profileRouter.put("/education/:id", requireAuth, editEducation);
profileRouter.delete("/education/:id", requireAuth, removeEducation);

// Projects
profileRouter.post("/projects", requireAuth, addProject);
profileRouter.put("/projects/:id", requireAuth, editProject);
profileRouter.delete("/projects/:id", requireAuth, removeProject);

// Skills (bulk replace)
profileRouter.put("/skills", requireAuth, updateSkills);

// Achievements
profileRouter.post("/achievements", requireAuth, addAchievement);
profileRouter.put("/achievements/:id", requireAuth, editAchievement);
profileRouter.delete("/achievements/:id", requireAuth, removeAchievement);

// Certificates
profileRouter.post("/certificates", requireAuth, addCertificate);
profileRouter.delete("/certificates/:id", requireAuth, removeCertificate);

// Social Links
profileRouter.post("/social-links", requireAuth, addSocialLink);
profileRouter.delete("/social-links/:id", requireAuth, removeSocialLink);
