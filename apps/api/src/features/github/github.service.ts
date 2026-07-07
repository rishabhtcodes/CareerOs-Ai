import { prisma } from "../../config/prisma";
import axios from "axios";

export async function fetchGitHubProfile(userId: string) {
  return prisma.githubProfile.findUnique({
    where: { userId },
  });
}

export async function connectGitHubProfile(userId: string, username: string) {
  // Fetch data from GitHub API
  try {
    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`),
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100`),
    ]);

    const repoCount = userRes.data.public_repos;
    const avatarUrl = userRes.data.avatar_url;
    
    // Calculate total stars
    const totalStars = reposRes.data.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);

    // Mock total commits for now since GitHub REST API makes it hard without scraping
    const totalCommits = repoCount * 42; 

    // Calculate top languages
    const langCounts: Record<string, number> = {};
    reposRes.data.forEach((repo: any) => {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(langCounts)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / reposRes.data.length) * 100),
        color: getLanguageColor(name),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4);

    return prisma.githubProfile.upsert({
      where: { userId },
      update: {
        username,
        profileUrl: avatarUrl,
        repositories: repoCount as any,
        languages: topLanguages as any,
        stars: totalStars,
        contributions: totalCommits as any,
        lastSyncedAt: new Date(),
      },
      create: {
        userId,
        username,
        profileUrl: avatarUrl,
        repositories: repoCount as any,
        languages: topLanguages as any,
        stars: totalStars,
        contributions: totalCommits as any,
        lastSyncedAt: new Date(),
      },
    });
  } catch (error) {
    throw new Error("Failed to fetch GitHub profile. Ensure username is correct.");
  }
}

export async function disconnectGitHubProfile(userId: string) {
  await prisma.githubProfile.delete({
    where: { userId },
  });
}

function getLanguageColor(lang: string) {
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Java: "#b07219",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
  };
  return colors[lang] || "#8b5cf6"; // Default violet
}
