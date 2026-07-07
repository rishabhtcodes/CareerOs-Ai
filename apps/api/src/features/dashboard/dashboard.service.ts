import { prisma } from "../../config/prisma";

export async function getDashboardSummary(userId: string) {
  const [skills, projects, applications, resumes] = await Promise.all([
    prisma.skill.count({ where: { userId } }),
    prisma.project.count({ where: { userId } }),
    prisma.application.count({ where: { userId } }),
    prisma.generatedResume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3
    })
  ]);

  return {
    profileStrength: calculateProfileStrength({ skills, projects, resumes: resumes.length }),
    skills,
    projects,
    applications,
    recentResumes: resumes,
    aiSuggestions: [
      "Add measurable outcomes to your top two projects.",
      "Create a full stack resume variant for backend-heavy roles.",
      "Connect GitHub to improve project credibility signals."
    ]
  };
}

function calculateProfileStrength(input: { skills: number; projects: number; resumes: number }) {
  const score = Math.min(100, input.skills * 2 + input.projects * 12 + input.resumes * 10 + 30);
  return Math.max(30, score);
}
