import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApplicationStatus, ContractType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export function formatSalary(salary: number | null): string {
  if (!salary) return "Salary not specified";
  return new Intl.NumberFormat("en-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(salary);
}

export function getApplicationStatusLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    PENDING: "Pending",
    IN_REVIEW: "In Review",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
  };
  return labels[status];
}

export function getApplicationStatusColor(
  status: ApplicationStatus
): "default" | "secondary" | "success" | "destructive" | "warning" {
  const colors: Record<
    ApplicationStatus,
    "default" | "secondary" | "success" | "destructive" | "warning"
  > = {
    PENDING: "secondary",
    IN_REVIEW: "default",
    ACCEPTED: "success",
    REJECTED: "destructive",
  };
  return colors[status];
}

export function getContractTypeLabel(type: ContractType): string {
  const labels: Record<ContractType, string> = {
    CDI: "Permanent (CDI)",
    CDD: "Fixed-term (CDD)",
    STAGE: "Internship",
    FREELANCE: "Freelance",
    INTERIM: "Temporary",
  };
  return labels[type];
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return formatDate(dateString);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "Just now";
}
