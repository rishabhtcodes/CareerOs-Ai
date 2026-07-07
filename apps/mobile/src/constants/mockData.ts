import type { AiSuggestion, CareerMetric, JobMatch } from "@careeros/shared";

export const metrics: CareerMetric[] = [
  { id: "profile", label: "Profile", value: "86%", delta: "+12%", tone: "violet" },
  { id: "resume", label: "Resume score", value: "92", delta: "+8 pts", tone: "emerald" },
  { id: "skills", label: "Skills", value: "47", delta: "+5", tone: "cyan" },
  { id: "apps", label: "Applications", value: "23", delta: "8 active", tone: "amber" }
];

export const jobMatches: JobMatch[] = [
  {
    id: "job-1",
    title: "Frontend Developer",
    company: "Vercel",
    location: "Remote",
    salaryRange: "$70K - $110K",
    matchScore: 93,
    role: "frontend",
    status: "saved"
  },
  {
    id: "job-2",
    title: "Full Stack Engineer",
    company: "Linear",
    location: "Bengaluru",
    salaryRange: "₹24L - ₹42L",
    matchScore: 88,
    role: "fullstack",
    status: "applied"
  },
  {
    id: "job-3",
    title: "AI Product Engineer",
    company: "Perplexity",
    location: "Remote",
    salaryRange: "$120K - $180K",
    matchScore: 81,
    role: "ai",
    status: "interview"
  }
];

export const aiSuggestions: AiSuggestion[] = [
  {
    id: "ai-1",
    title: "Strengthen system design proof",
    body: "Add one case study that explains tradeoffs, data model, and metrics from a shipped project.",
    priority: "high"
  },
  {
    id: "ai-2",
    title: "Target full stack roles",
    body: "Your React and API experience scores well. Add PostgreSQL and deployment keywords for stronger matches.",
    priority: "medium"
  }
];
