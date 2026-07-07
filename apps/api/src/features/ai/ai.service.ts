import { prisma } from "../../config/prisma";

export async function createCoachResponse(userId: string, message: string) {
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    include: { skills: true, projects: true, experience: true }
  });

  const response = [
    `Based on your current profile, focus on ${profile?.targetRole ?? "your target role"} positioning.`,
    "Build one proof-heavy project, update your resume with metrics, and apply to roles where your core skills repeat in the job description.",
    "Next action: create a 7-day roadmap with one portfolio improvement, one resume pass, and five targeted applications."
  ].join(" ");

  await prisma.aIHistory.create({
    data: {
      userId,
      prompt: message,
      response,
      provider: "local-rules"
    }
  });

  return { response };
}
