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
    <div className="mx-auto max-w-4xl space-y-6 animate-in">
      <PageHeader
        title="My Applications"
        description={data ? `${data.totalElements} application${data.totalElements !== 1 ? "s" : ""} total` : ""}
        action={
          <Button size="sm" asChild>
            <Link to="/candidate/jobs">
              <BriefcaseIcon className="h-4 w-4" />
              Find Jobs
            </Link>
          </Button>
        }
      />

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
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
                  <Link to="/candidate/jobs">Browse Jobs</Link>
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
                  className="group rounded-lg border border-border/80 bg-card/95 p-4 shadow-[0_1px_2px_hsl(222_38%_9%/0.04),0_8px_22px_hsl(222_38%_9%/0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_2px_4px_hsl(222_38%_9%/0.055),0_14px_34px_hsl(222_38%_9%/0.075)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate font-semibold transition-colors group-hover:text-primary">
                        {app.jobOfferTitle}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
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
