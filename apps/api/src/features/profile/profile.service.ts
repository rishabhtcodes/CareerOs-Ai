import { prisma } from "../../config/prisma";

// ─── Basic Profile ────────────────────────────────────────────────────────────

export async function readProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      headline: true,
      location: true,
      bio: true,
      targetRole: true,
      skills: true,
      education: true,
      experience: true,
      projects: true,
      certificates: true,
      achievements: true,
      socialLinks: true
    }
  });
}

export async function saveProfile(
  userId: string,
  input: { headline?: string; location?: string; bio?: string; targetRole?: string; skills: string[] }
) {
  return prisma.$transaction(async (tx) => {
    await tx.skill.deleteMany({ where: { userId } });

    return tx.user.update({
      where: { id: userId },
      data: {
        headline: input.headline,
        location: input.location,
        bio: input.bio,
        targetRole: input.targetRole,
        skills: {
          create: input.skills.map((name) => ({ name }))
        }
      },
      include: { skills: true }
    });
  });
}

// ─── Experience ───────────────────────────────────────────────────────────────

export async function createExperience(
  userId: string,
  input: {
    company: string; role: string; location?: string | null;
    startDate?: string | null; endDate?: string | null;
    current?: boolean; description?: string | null; highlights: string[]
  }
) {
  return prisma.experience.create({
    data: {
      userId,
      company: input.company,
      role: input.role,
      location: input.location ?? null,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      current: input.current ?? false,
      description: input.description ?? null,
      highlights: JSON.stringify(input.highlights)
    }
  });
}

export async function updateExperience(
  userId: string,
  id: string,
  input: {
    company?: string; role?: string; location?: string | null;
    startDate?: string | null; endDate?: string | null;
    current?: boolean; description?: string | null; highlights?: string[]
  }
) {
  const exp = await prisma.experience.findFirst({ where: { id, userId } });
  if (!exp) throw new Error("Not found");

  return prisma.experience.update({
    where: { id },
    data: {
      company: input.company,
      role: input.role,
      location: input.location,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      current: input.current,
      description: input.description,
      highlights: input.highlights !== undefined ? JSON.stringify(input.highlights) : undefined
    }
  });
}

export async function deleteExperience(userId: string, id: string) {
  const exp = await prisma.experience.findFirst({ where: { id, userId } });
  if (!exp) throw new Error("Not found");
  return prisma.experience.delete({ where: { id } });
}

// ─── Education ────────────────────────────────────────────────────────────────

export async function createEducation(
  userId: string,
  input: {
    school: string; degree: string; field?: string | null;
    startDate?: string | null; endDate?: string | null; description?: string | null
  }
) {
  return prisma.education.create({
    data: {
      userId,
      school: input.school,
      degree: input.degree,
      field: input.field ?? null,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      description: input.description ?? null
    }
  });
}

export async function updateEducation(
  userId: string,
  id: string,
  input: {
    school?: string; degree?: string; field?: string | null;
    startDate?: string | null; endDate?: string | null; description?: string | null
  }
) {
  const edu = await prisma.education.findFirst({ where: { id, userId } });
  if (!edu) throw new Error("Not found");

  return prisma.education.update({
    where: { id },
    data: {
      school: input.school,
      degree: input.degree,
      field: input.field,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      description: input.description
    }
  });
}

export async function deleteEducation(userId: string, id: string) {
  const edu = await prisma.education.findFirst({ where: { id, userId } });
  if (!edu) throw new Error("Not found");
  return prisma.education.delete({ where: { id } });
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function createProject(
  userId: string,
  input: {
    name: string; summary: string; url?: string | null;
    repository?: string | null; techStack: string[]; impact?: string | null
  }
) {
  return prisma.project.create({
    data: {
      userId,
      name: input.name,
      summary: input.summary,
      url: input.url ?? null,
      repository: input.repository ?? null,
      techStack: JSON.stringify(input.techStack),
      impact: input.impact ?? null
    }
  });
}

export async function updateProject(
  userId: string,
  id: string,
  input: {
    name?: string; summary?: string; url?: string | null;
    repository?: string | null; techStack?: string[]; impact?: string | null
  }
) {
  const proj = await prisma.project.findFirst({ where: { id, userId } });
  if (!proj) throw new Error("Not found");

  return prisma.project.update({
    where: { id },
    data: {
      name: input.name,
      summary: input.summary,
      url: input.url,
      repository: input.repository,
      techStack: input.techStack !== undefined ? JSON.stringify(input.techStack) : undefined,
      impact: input.impact
    }
  });
}

export async function deleteProject(userId: string, id: string) {
  const proj = await prisma.project.findFirst({ where: { id, userId } });
  if (!proj) throw new Error("Not found");
  return prisma.project.delete({ where: { id } });
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export async function replaceSkills(
  userId: string,
  skills: { name: string; category?: string | null; level?: number }[]
) {
  return prisma.$transaction(async (tx) => {
    await tx.skill.deleteMany({ where: { userId } });
    if (skills.length === 0) return [];
    return tx.skill.createMany({
      data: skills.map((s) => ({
        userId,
        name: s.name,
        category: s.category ?? null,
        level: s.level ?? 3
      }))
    });
  });
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export async function createAchievement(
  userId: string,
  input: { title: string; description?: string | null }
) {
  return prisma.achievement.create({
    data: { userId, title: input.title, description: input.description ?? null }
  });
}

export async function updateAchievement(
  userId: string,
  id: string,
  input: { title?: string; description?: string | null }
) {
  const item = await prisma.achievement.findFirst({ where: { id, userId } });
  if (!item) throw new Error("Not found");
  return prisma.achievement.update({ where: { id }, data: input });
}

export async function deleteAchievement(userId: string, id: string) {
  const item = await prisma.achievement.findFirst({ where: { id, userId } });
  if (!item) throw new Error("Not found");
  return prisma.achievement.delete({ where: { id } });
}

// ─── Certificates ─────────────────────────────────────────────────────────────

export async function createCertificate(
  userId: string,
  input: { name: string; issuer: string; issuedAt?: string | null; credential?: string | null }
) {
  return prisma.certificate.create({
    data: {
      userId,
      name: input.name,
      issuer: input.issuer,
      issuedAt: input.issuedAt ? new Date(input.issuedAt) : null,
      credential: input.credential ?? null
    }
  });
}

export async function deleteCertificate(userId: string, id: string) {
  const item = await prisma.certificate.findFirst({ where: { id, userId } });
  if (!item) throw new Error("Not found");
  return prisma.certificate.delete({ where: { id } });
}

// ─── Social Links ─────────────────────────────────────────────────────────────

export async function createSocialLink(userId: string, input: { label: string; url: string }) {
  return prisma.socialLink.create({ data: { userId, label: input.label, url: input.url } });
}

export async function deleteSocialLink(userId: string, id: string) {
  const item = await prisma.socialLink.findFirst({ where: { id, userId } });
  if (!item) throw new Error("Not found");
  return prisma.socialLink.delete({ where: { id } });
}
