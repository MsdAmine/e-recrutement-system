import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { jobOfferService } from "@/services/jobOfferService";
import { queryKeys } from "@/lib/queryKeys";
import { formatDate, formatSalary, getContractTypeLabel } from "@/lib/utils";
import {
  PageHeader,
  EmptyState,
  Skeleton,
  ErrorDisplay,
} from "@/components/shared/SharedComponents";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircleIcon,
  MapPinIcon,
  BriefcaseIcon,
  BanknoteIcon,
  EditIcon,
  Trash2Icon,
  UsersIcon,
  CalendarIcon,
} from "lucide-react";
import { AxiosError } from "axios";
import { ApiError } from "@/types";

const PAGE_SIZE = 10;

export function RecruiterJobOffersPage() {
  const [page, setPage] = useState(0);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.myJobOffers(page, PAGE_SIZE),
    queryFn: () => jobOfferService.getMyOffers(page, PAGE_SIZE),
  });

  const deleteMutation = useMutation({
    mutationFn: jobOfferService.deleteOffer,
    onSuccess: () => {
      setDeleteError(null);
      queryClient.invalidateQueries({ queryKey: ["myJobOffers"] });
      queryClient.invalidateQueries({ queryKey: ["jobOffers"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const data = error.response?.data as ApiError;
        setDeleteError(
          data?.detail ||
            data?.error ||
            "Failed to delete this job offer. Please try again."
        );
        return;
      }
      setDeleteError("Failed to delete this job offer. Please try again.");
    },
  });

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      setDeleteError(null);
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in">
      <PageHeader
        title="My Job Offers"
        description={data ? `${data.totalElements} offer${data.totalElements !== 1 ? "s" : ""}` : ""}
        action={
          <Button size="sm" asChild>
            <Link to="/recruiter/job-offers/new">
              <PlusCircleIcon className="h-4 w-4" />
              Post a Job
            </Link>
          </Button>
        }
      />

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <ErrorDisplay
          title="Failed to load your job offers"
          message="Please try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && data && (
        <>
          {deleteError && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive">
              {deleteError}
            </div>
          )}

          {data.content.length === 0 ? (
            <EmptyState
              icon={<BriefcaseIcon className="h-12 w-12" />}
              title="No job offers yet"
              description="Post your first job offer to start receiving applications."
              action={
                <Button size="sm" asChild>
                  <Link to="/recruiter/job-offers/new">Post a Job</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {data.content.map((offer, i) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{offer.title}</h3>
                        <Badge variant={offer.active ? "success" : "secondary"}>
                          {offer.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          {offer.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <BriefcaseIcon className="h-3 w-3" />
                          {getContractTypeLabel(offer.contractType)}
                        </span>
                        {offer.salary && (
                          <span className="flex items-center gap-1">
                            <BanknoteIcon className="h-3 w-3" />
                            {formatSalary(offer.salary)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {formatDate(offer.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/recruiter/applications/job-offers/${offer.id}`}>
                          <UsersIcon className="h-3.5 w-3.5" />
                          Applications
                        </Link>
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                        <Link to={`/recruiter/job-offers/${offer.id}/edit`} aria-label="Edit">
                          <EditIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(offer.id, offer.title)}
                        disabled={deleteMutation.isPending}
                        aria-label="Delete"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
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
