import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { jobOfferService } from "@/services/jobOfferService";
import { applicationService } from "@/services/applicationService";
import { queryKeys } from "@/lib/queryKeys";
import { useAuth } from "@/store/authStore";
import {
  formatDate,
  formatSalary,
  getContractTypeLabel,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ErrorDisplay, Skeleton } from "@/components/shared/SharedComponents";
import {
  MapPinIcon,
  BanknoteIcon,
  CalendarIcon,
  BuildingIcon,
  ArrowLeftIcon,
  SendIcon,
  BriefcaseIcon,
} from "lucide-react";
import { AxiosError } from "axios";
import { ApiError } from "@/types";
import { getJobsPath } from "@/lib/auth";

const applySchema = z.object({
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(2000, "Cover letter is too long"),
});
type ApplyForm = z.infer<typeof applySchema>;

export function JobOfferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const offerId = Number(id);
  const isValidOfferId = Number.isInteger(offerId) && offerId > 0;
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const jobsPath = getJobsPath(user?.role);

  const {
    data: offer,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.jobOffer(offerId),
    queryFn: () => jobOfferService.getPublicOfferById(offerId),
    enabled: isValidOfferId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyForm>({ resolver: zodResolver(applySchema) });

  const applyMutation = useMutation({
    mutationFn: (vals: ApplyForm) =>
      applicationService.apply(offerId, { coverLetter: vals.coverLetter }),
    onSuccess: () => {
      setApplied(true);
      setApplyError(null);
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const data = error.response?.data as ApiError;
        setApplyError(data?.detail || "Failed to submit application.");
      } else {
        setApplyError("Something went wrong.");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-10">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!isValidOfferId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-muted-foreground">Invalid job offer URL.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(jobsPath)}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  if (isError) {
    const loadErrorMessage =
      error instanceof AxiosError
        ? (error.response?.data as ApiError | undefined)?.detail ??
          (error.response?.data as ApiError | undefined)?.error ??
          "Failed to load this job offer."
        : "Failed to load this job offer.";

    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <ErrorDisplay
          title="Unable to load job offer"
          message={loadErrorMessage}
          onRetry={refetch}
        />
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => navigate(jobsPath)}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-center">
        <p className="text-muted-foreground">Job offer not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(jobsPath)}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  const isCandidate = isAuthenticated && user?.role === "ROLE_CANDIDATE";
  const showApplyPanel = applied || isCandidate || !isAuthenticated;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
        <Link to={isAuthenticated ? jobsPath : "/jobs"}>
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Jobs
        </Link>
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={showApplyPanel ? "grid gap-5 lg:grid-cols-[1fr_320px]" : "space-y-5"}
      >
        <div className="space-y-5">
          <div className="surface-emphasized p-6">
            <div className="flex items-start gap-4">
              <div className="icon-tile h-14 w-14">
                <BuildingIcon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h1>{offer.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{offer.recruiterEmail}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <MapPinIcon className="h-3 w-3" />
                    {offer.location}
                  </Badge>
                  <Badge variant="outline">
                    <BriefcaseIcon className="mr-1 h-3 w-3" />
                    {getContractTypeLabel(offer.contractType)}
                  </Badge>
                  {offer.salary && (
                    <Badge variant="outline" className="gap-1">
                      <BanknoteIcon className="h-3 w-3" />
                      {formatSalary(offer.salary)}
                    </Badge>
                  )}
                  <Badge variant="outline" className="gap-1 text-muted-foreground">
                    <CalendarIcon className="h-3 w-3" />
                    Posted {formatDate(offer.createdAt)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="mb-3">Job Description</h2>
            <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {offer.description}
            </p>
          </div>
        </div>

        {showApplyPanel && (
        <aside className="lg:sticky lg:top-20 lg:self-start">
          {applied ? (
          <div className="rounded-lg border border-success/30 bg-success/10 p-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-success/15 text-success">
              <SendIcon className="h-5 w-5" />
            </div>
            <h3 className="mb-1 font-semibold text-success">Application submitted</h3>
            <p className="mb-4 text-sm leading-6 text-muted-foreground">
              Your application has been sent. Track it in your applications.
            </p>
            <Button size="sm" asChild>
              <Link to="/candidate/applications">View My Applications</Link>
            </Button>
          </div>
        ) : isCandidate ? (
          <div className="surface-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base">
              <SendIcon className="h-4 w-4" />
              Apply for this position
            </h2>
            <form onSubmit={handleSubmit((v) => applyMutation.mutate(v))} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Cover Letter <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="cover-letter"
                  placeholder="Tell the recruiter why you're a great fit for this role..."
                  className="min-h-[180px]"
                  {...register("coverLetter")}
                />
                {errors.coverLetter && (
                  <p className="text-xs text-destructive">{errors.coverLetter.message}</p>
                )}
              </div>
              {applyError && (
                <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  {applyError}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                loading={applyMutation.isPending}
                id="apply-submit"
              >
                <SendIcon className="h-4 w-4" />
                Submit Application
              </Button>
            </form>
          </div>
        ) : !isAuthenticated ? (
          <div className="surface-card p-6 text-center">
            <p className="mb-4 text-sm leading-6 text-muted-foreground">
              Sign in as a candidate to apply for this position.
            </p>
            <Button asChild>
              <Link to="/login">Sign In to Apply</Link>
            </Button>
          </div>
          ) : null}
        </aside>
        )}
      </motion.div>
    </div>
  );
}

