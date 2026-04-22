import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { applicationService } from "@/services/applicationService";
import { queryKeys } from "@/lib/queryKeys";
import { formatDate } from "@/lib/utils";
import { ApplicationStatusBadge } from "@/components/shared/ApplicationStatusBadge";
import { Pagination } from "@/components/shared/Pagination";
import { PageHeader, EmptyState, Skeleton } from "@/components/shared/SharedComponents";
import { Button } from "@/components/ui/button";
import { FileTextIcon, CalendarIcon, BriefcaseIcon, ArrowRightIcon } from "lucide-react";

const PAGE_SIZE = 10;

export function CandidateApplicationsPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.myApplications(page, PAGE_SIZE),
    queryFn: () => applicationService.getMyApplications(page, PAGE_SIZE),
  });

  return (
    <div className="max-w-3xl mx-auto animate-in">
      <PageHeader
        title="My Applications"
        description={data ? `${data.totalElements} application${data.totalElements !== 1 ? "s" : ""} total` : ""}
        action={
          <Button size="sm" asChild>
            <Link to="/jobs">
              <BriefcaseIcon className="h-4 w-4" />
              Find Jobs
            </Link>
          </Button>
        }
      />

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-muted-foreground">
          Failed to load applications.
        </div>
      )}

      {!isLoading && data && (
        <>
          {data.content.length === 0 ? (
            <EmptyState
              icon={<FileTextIcon className="h-12 w-12" />}
              title="No applications yet"
              description="Start applying to jobs and your submissions will appear here."
              action={
                <Button asChild size="sm">
                  <Link to="/jobs">Browse Jobs</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {data.content.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {app.jobOfferTitle}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          Applied {formatDate(app.appliedAt)}
                        </span>
                        <ApplicationStatusBadge status={app.status} />
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" asChild className="shrink-0">
                      <Link to={`/candidate/applications/${app.id}`}>
                        <ArrowRightIcon className="h-4 w-4" />
                      </Link>
                    </Button>
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
