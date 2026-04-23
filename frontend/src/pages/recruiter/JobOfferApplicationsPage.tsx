import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { applicationService } from "@/services/applicationService";
import { jobOfferService } from "@/services/jobOfferService";
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
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, UsersIcon, MailIcon, CalendarIcon } from "lucide-react";

const PAGE_SIZE = 10;

export function JobOfferApplicationsPage() {
  const { jobOfferId } = useParams<{ jobOfferId: string }>();
  const offerId = Number(jobOfferId);
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data: offer } = useQuery({
    queryKey: queryKeys.jobOffer(offerId),
    queryFn: () => jobOfferService.getOfferById(offerId),
    enabled: !!offerId,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.jobOfferApplications(offerId, page, PAGE_SIZE),
    queryFn: () =>
      applicationService.getJobOfferApplications(offerId, page, PAGE_SIZE),
    enabled: !!offerId,
  });

  const statusMutation = useMutation({
    mutationFn: ({ appId, status }: { appId: number; status: ApplicationStatus }) =>
      applicationService.updateStatus(appId, { status }),
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
        { queryKey: ["jobOfferApplications"] },
        patchStatus
      );
      queryClient.setQueriesData<Page<Application>>(
        { queryKey: ["recruiterApplications"] },
        patchStatus
      );

      queryClient.invalidateQueries({ queryKey: ["jobOfferApplications"] });
      queryClient.invalidateQueries({ queryKey: ["recruiterApplications"] });
    },
  });

  return (
    <div className="max-w-4xl mx-auto animate-in">
      <Button variant="ghost" size="sm" className="mb-5 -ml-2" asChild>
        <Link to="/recruiter/job-offers">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Job Offers
        </Link>
      </Button>

      <PageHeader
        title={offer?.title ?? "Applications"}
        description={
          data
            ? `${data.totalElements} candidate${data.totalElements !== 1 ? "s" : ""} applied`
            : "Loading..."
        }
      />

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
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
              title="No applications yet"
              description="Share this job offer to attract candidates."
            />
          ) : (
            <div className="space-y-3">
              {data.content.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-border bg-card p-5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MailIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{app.candidateEmail}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        Applied {formatDate(app.appliedAt)}
                      </div>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </div>

                  {/* Cover letter preview */}
                  <div className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Cover Letter</p>
                    <p className="text-sm leading-relaxed line-clamp-3 text-foreground/80">
                      {app.coverLetter}
                    </p>
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

