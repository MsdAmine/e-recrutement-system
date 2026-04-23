import { Role } from "@/types";

export function getDashboardPath(role: Role | null | undefined): string {
  if (role === "ROLE_RECRUITER") return "/recruiter/dashboard";
  if (role === "ROLE_CANDIDATE") return "/candidate/dashboard";
  return "/";
}

export function getJobsPath(role: Role | null | undefined): string {
  if (role === "ROLE_RECRUITER") return "/recruiter/jobs";
  if (role === "ROLE_CANDIDATE") return "/candidate/jobs";
  return "/jobs";
}

export function getJobDetailPath(
  role: Role | null | undefined,
  jobId: number
): string {
  return `${getJobsPath(role)}/${jobId}`;
}
