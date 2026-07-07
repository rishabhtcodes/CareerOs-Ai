import { prisma } from "../../config/prisma";

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
