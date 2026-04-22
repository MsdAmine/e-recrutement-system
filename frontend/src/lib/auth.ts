import { Role } from "@/types";

export function getDashboardPath(role: Role | null | undefined): string {
  if (role === "ROLE_RECRUITER") return "/recruiter/dashboard";
  if (role === "ROLE_CANDIDATE") return "/candidate/dashboard";
  return "/";
}
