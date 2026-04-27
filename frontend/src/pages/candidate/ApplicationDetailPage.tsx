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

/**
 * ApplicationDetailPage Component
 * 
 * Displays the full details of a specific job application submitted by a candidate.
 * Includes job title, current status, application date, and the submitted cover letter.
 */
export function ApplicationDetailPage() {
  // Extract application ID from the URL path parameters
  const { applicationId } = useParams<{ applicationId: string }>();
  const appId = Number(applicationId);
  const isValidAppId = Number.isInteger(appId) && appId > 0;

  // React Query hook for fetching application details by ID
  const { data: app, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.myApplication(appId),
    queryFn: () => applicationService.getMyApplicationById(appId),
    enabled: isValidAppId, // Only fetch if we have a valid ID
  });

  // Loading state: Display skeleton loaders while fetching data
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 animate-in">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
    );
  }

  // Validation state: Handle case where ID in URL is non-numeric or non-positive
  if (!isValidAppId) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center animate-in">
        <p className="text-muted-foreground">Invalid application URL.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/candidate/applications">Back to Applications</Link>
        </Button>
      </div>
    );
  }

  // Error state: Display descriptive error messages if the API call fails
  if (isError) {
    const loadErrorMessage =
      error instanceof AxiosError
        ? (error.response?.data as ApiError | undefined)?.detail ??
          (error.response?.data as ApiError | undefined)?.error ??
          "Failed to load application details."
        : "Failed to load application details.";

    return (
      <div className="mx-auto max-w-4xl animate-in">
        <ErrorDisplay
          title="Unable to load application"
          message={loadErrorMessage}
          onRetry={refetch}
        />
      </div>
    );
  }

  // Empty state: Handle case where application ID is valid but no data returned
  if (!app) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center animate-in">
        <p className="text-muted-foreground">Application not found.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/candidate/applications">Back to Applications</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-in">
      {/* Navigation: Back link */}
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
        {/* Main Application Card: Job Info & Status */}
        <div className="surface-card p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2>{app.jobOfferTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Job Offer #{app.jobOfferId}</p>
            </div>
            <ApplicationStatusBadge status={app.status} />
          </div>

          <Separator className="mb-4" />

          {/* Quick details grid (Date & Status label) */}
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <div>
                <p className="text-xs">Applied at</p>
                <p className="font-medium text-foreground">{formatDateTime(app.appliedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BriefcaseIcon className="h-4 w-4" />
              <div>
                <p className="text-xs">Status</p>
                <p className="font-medium capitalize text-foreground">{app.status.replace("_", " ")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section: Cover Letter Display */}
        <div className="surface-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <AlignLeftIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Your Cover Letter</h3>
          </div>
          <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {app.coverLetter}
          </p>
        </div>

        {/* Footer Actions: Jump to original Job Posting */}
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

