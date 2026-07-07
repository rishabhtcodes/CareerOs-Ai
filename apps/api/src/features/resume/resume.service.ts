import { prisma } from "../../config/prisma";

export async function readResumes(userId: string) {
  return prisma.generatedResume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
}

export async function createResumeDraft(
  userId: string,
  input: { type: "frontend" | "fullstack" | "python" | "ai" | "custom"; targetJobDescription?: string }
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { skills: true, projects: true, experience: true, education: true }
  });

  const content = {
    summary: `${user?.name ?? "Candidate"} is preparing a ${input.type} resume.`,
    targetJobDescription: input.targetJobDescription ?? null,
    sections: {
      skills: user?.skills.map((skill) => skill.name) ?? [],
      projects: user?.projects ?? [],
      experience: user?.experience ?? [],
      education: user?.education ?? []
    }
  };

  return prisma.generatedResume.create({
    data: {
      userId,
      title: `${capitalize(input.type)} Resume`,
      type: input.type,
      atsScore: 78,
      content
    }
  });
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
