import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { AxiosError } from "axios";
import { applicationService } from "@/services/applicationService";
import { queryKeys } from "@/lib/queryKeys";
import { formatDateTime } from "@/lib/utils";
import { ApiError } from "@/types";
import { ApplicationStatusBadge } from "@/components/shared/ApplicationStatusBadge";
import { ErrorDisplay, Skeleton, PageHeader } from "@/components/shared/SharedComponents";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon, CalendarIcon, BriefcaseIcon, AlignLeftIcon } from "lucide-react";

export function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const appId = Number(applicationId);
  const isValidAppId = Number.isInteger(appId) && appId > 0;

  const { data: app, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.myApplication(appId),
    queryFn: () => applicationService.getMyApplicationById(appId),
    enabled: isValidAppId,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-in">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!isValidAppId) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-in">
        <p className="text-muted-foreground">Invalid application URL.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/candidate/applications">Back to Applications</Link>
        </Button>
      </div>
    );
  }

  if (isError) {
    const loadErrorMessage =
      error instanceof AxiosError
        ? (error.response?.data as ApiError | undefined)?.detail ??
          (error.response?.data as ApiError | undefined)?.error ??
          "Failed to load application details."
        : "Failed to load application details.";

    return (
      <div className="max-w-2xl mx-auto animate-in">
        <ErrorDisplay
          title="Unable to load application"
          message={loadErrorMessage}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-in">
        <p className="text-muted-foreground">Application not found.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/candidate/applications">Back to Applications</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <Button variant="ghost" size="sm" className="mb-5 -ml-2" asChild>
        <Link to="/candidate/applications">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Applications
        </Link>
      </Button>

      <PageHeader title="Application Detail" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Header card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold">{app.jobOfferTitle}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Job Offer #{app.jobOfferId}</p>
            </div>
            <ApplicationStatusBadge status={app.status} />
          </div>

          <Separator className="mb-4" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <div>
                <p className="text-xs">Applied at</p>
                <p className="text-foreground font-medium">{formatDateTime(app.appliedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BriefcaseIcon className="h-4 w-4" />
              <div>
                <p className="text-xs">Status</p>
                <p className="text-foreground font-medium capitalize">{app.status.replace("_", " ")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cover letter */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlignLeftIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Your Cover Letter</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {app.coverLetter}
          </p>
        </div>

        {/* View job link */}
        <Button variant="outline" size="sm" asChild>
          <Link to={`/candidate/jobs/${app.jobOfferId}`}>
            <BriefcaseIcon className="h-4 w-4" />
            View Job Offer
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
