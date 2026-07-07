import { prisma } from "../../config/prisma";

export async function readApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
}

export async function analyzeJobDescription(
  userId: string,
  input: { sourceUrl?: string; description?: string }
) {
  const skills = await prisma.skill.findMany({ where: { userId } });
  const description = input.description ?? "";
  const matchedSkills = skills
    .map((skill) => skill.name)
    .filter((skill) => description.toLowerCase().includes(skill.toLowerCase()));

  const matchScore = Math.min(95, 45 + matchedSkills.length * 8);
  const missingSkills = ["System design", "Testing", "Deployment"].filter(
    (skill) => !matchedSkills.some((matched) => matched.toLowerCase().includes(skill.toLowerCase()))
  );

  return prisma.jobAnalysis.create({
    data: {
      userId,
      sourceUrl: input.sourceUrl,
      description,
      matchScore,
      extractedSkills: matchedSkills,
      missingSkills,
      suggestions: [
        "Mirror the job title and top keywords in the resume headline.",
        "Add project bullets that show business impact and technical ownership."
      ]
    }
  });
}
