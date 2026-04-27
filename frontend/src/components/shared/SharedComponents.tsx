import * as React from "react";
import { AlertTriangleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  description,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="text-sm font-medium leading-none text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs leading-5 text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs leading-5 text-destructive">{error}</p>}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
  colorClass?: string;
}

export function StatCard({ label, value, icon, className, colorClass }: StatCardProps) {
  return (
    <div
      className={cn(
        "surface-emphasized group p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/35",
        className
      )}
    >
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[1.75rem] font-semibold leading-none tracking-tight text-foreground">{value}</p>
          <p className="mt-2 text-sm font-medium leading-5 text-muted-foreground">{label}</p>
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-md shadow-sm ring-1 ring-inset ring-border/70 transition-transform duration-150 group-hover:scale-105",
              colorClass ?? "bg-primary/10 text-primary"
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border/80 pb-7 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        <h1>{title}</h1>
        {description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border/90 bg-card/75 px-8 py-14 text-center shadow-inner shadow-slate-950/[0.025]",
        className
      )}
    >
      {icon && <div className="mb-4 text-muted-foreground/60">{icon}</div>}
      <h3 className="mb-1 text-base font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton h-4 rounded-md", className)} />;
}

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/25 bg-destructive/5 px-6 py-12 text-center shadow-sm shadow-destructive/5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-destructive/10 text-destructive">
        <AlertTriangleIcon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-destructive">{title}</h3>
      <p className="mb-4 mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
