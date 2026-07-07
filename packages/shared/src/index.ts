export type CareerRole =
  | "frontend"
  | "backend"
  | "fullstack"
  | "mobile"
  | "ai"
  | "data"
  | "design"
  | "product";

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected";

export type ResumeType = "frontend" | "fullstack" | "python" | "ai" | "custom";

export interface CareerMetric {
  id: string;
  label: string;
  value: string;
  delta?: string;
  tone: "violet" | "cyan" | "emerald" | "amber" | "rose";
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  matchScore: number;
  role: CareerRole;
  status: ApplicationStatus;
}

export interface AiSuggestion {
  id: string;
  title: string;
  body: string;
  priority: "low" | "medium" | "high";
}
