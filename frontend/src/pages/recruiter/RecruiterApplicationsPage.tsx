import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { applicationService } from "@/services/applicationService";
import { queryKeys } from "@/lib/queryKeys";
import { formatDate } from "@/lib/utils";
import { Application, ApplicationStatus, Page } from "@/types";
import { ApplicationStatusBadge } from "@/components/shared/ApplicationStatusBadge";
import { Pagination } from "@/components/shared/Pagination";
import {
  PageHeader,
  EmptyState,
  Skeleton,
  ErrorDisplay,
} from "@/components/shared/SharedComponents";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsersIcon, CalendarIcon, MailIcon } from "lucide-react";

const PAGE_SIZE = 10;
const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
];

export function RecruiterApplicationsPage() {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.recruiterApplications(
      page,
      PAGE_SIZE,
      statusFilter !== "ALL" ? statusFilter : undefined
    ),
    queryFn: () =>
      applicationService.getRecruiterApplications(
        page,
        PAGE_SIZE,
        statusFilter !== "ALL" ? (statusFilter as ApplicationStatus) : undefined
      ),
  });

  const statusMutation = useMutation({
    mutationFn: ({
      appId,
      status,
    }: {
      appId: number;
      status: ApplicationStatus;
    }) => applicationService.updateStatus(appId, { status }),
    onSuccess: (updatedApplication) => {
      const patchStatus = (oldPage: Page<Application> | undefined) => {
        if (!oldPage) return oldPage;
        return {
          ...oldPage,
          content: oldPage.content.map((app) =>
            app.id === updatedApplication.id
              ? { ...app, status: updatedApplication.status }
              : app
          ),
        };
      };

      queryClient.setQueriesData<Page<Application>>(
        { queryKey: ["recruiterApplications"] },
        patchStatus
      );
      queryClient.setQueriesData<Page<Application>>(
        { queryKey: ["jobOfferApplications"] },
        patchStatus
      );

      queryClient.invalidateQueries({ queryKey: ["recruiterApplications"] });
      queryClient.invalidateQueries({ queryKey: ["jobOfferApplications"] });
    },
  });

  return (
    <div className="max-w-4xl mx-auto animate-in">
      <PageHeader
        title="All Applications"
        description={data ? `${data.totalElements} application${data.totalElements !== 1 ? "s" : ""}` : ""}
        action={
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-44" id="app-filter-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <ErrorDisplay
          title="Failed to load applications"
          message="Please try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && data && (
        <>
          {data.content.length === 0 ? (
            <EmptyState
              icon={<UsersIcon className="h-12 w-12" />}
              title="No applications found"
              description="Adjust the status filter or wait for candidates to apply."
            />
          ) : (
            <div className="space-y-3">
              {data.content.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-border bg-card p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{app.jobOfferTitle}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MailIcon className="h-3 w-3" />
                          {app.candidateEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {formatDate(app.appliedAt)}
                        </span>
                      </div>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </div>

                  {/* Status update */}
                  <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">Update status:</span>
                    <Select
                      value={app.status}
                      onValueChange={(v) =>
                        statusMutation.mutate({
                          appId: app.id,
                          status: v as ApplicationStatus,
                        })
                      }
                    >
                      <SelectTrigger className="h-7 text-xs w-36" id={`status-${app.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_REVIEW">In Review</SelectItem>
                        <SelectItem value="ACCEPTED">Accepted</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    {statusMutation.isPending && (
                      <span className="text-xs text-muted-foreground">Saving...</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}

