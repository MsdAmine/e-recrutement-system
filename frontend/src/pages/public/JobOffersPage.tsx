import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { jobOfferService } from "@/services/jobOfferService";
import { queryKeys } from "@/lib/queryKeys";
import { useAuth } from "@/store/authStore";
import { getJobDetailPath } from "@/lib/auth";
import { formatDate, formatSalary, getContractTypeLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState, Skeleton } from "@/components/shared/SharedComponents";
import {
  MapPinIcon,
  BriefcaseIcon,
  BanknoteIcon,
  CalendarIcon,
  SearchIcon,
  BuildingIcon,
  SparklesIcon,
  ArrowUpRightIcon,
} from "lucide-react";

const PAGE_SIZE = 9;

export function JobOffersPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.jobOffers(page, PAGE_SIZE),
    queryFn: () => jobOfferService.getPublicOffers(page, PAGE_SIZE),
  });

  const filtered = data?.content.filter(
    (offer) =>
      search.trim() === "" ||
      offer.title.toLowerCase().includes(search.toLowerCase()) ||
      offer.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
          <SparklesIcon className="h-3.5 w-3.5" />
          Curated Opportunities
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Browse Opportunities
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover {data?.totalElements ?? "-"} active job offers from top companies.
        </p>
      </div>

      <div className="relative max-w-xl mx-auto mb-10">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          id="jobs-search"
          type="text"
          placeholder="Search by title or location..."
          className="pl-10 h-11 rounded-xl bg-card/90 border-border/80 shadow-sm focus-visible:ring-primary/40"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-24 mt-2" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-20 text-muted-foreground">
          Failed to load job offers. Please try again.
        </div>
      )}

      {!isLoading && filtered !== undefined && (
        <>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<BriefcaseIcon className="h-12 w-12" />}
              title="No jobs found"
              description="Try adjusting your search or check back later."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((offer, i) => (
                <motion.article
                  key={offer.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  className="surface-card surface-card-hover group relative overflow-hidden p-5 flex flex-col"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                  <div className="relative flex items-start gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                      <BuildingIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors">
                        {offer.title}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {offer.recruiterEmail}
                      </p>
                    </div>
                  </div>

                  <p className="relative text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
                    {offer.description}
                  </p>

                  <div className="relative flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="gap-1">
                      <MapPinIcon className="h-3 w-3" />
                      {offer.location}
                    </Badge>
                    <Badge variant="outline">
                      {getContractTypeLabel(offer.contractType)}
                    </Badge>
                    {offer.salary && (
                      <Badge variant="outline" className="gap-1">
                        <BanknoteIcon className="h-3 w-3" />
                        {formatSalary(offer.salary)}
                      </Badge>
                    )}
                  </div>

                  <div className="relative flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {formatDate(offer.createdAt)}
                    </span>
                    <Button size="sm" variant="outline" asChild className="group/btn">
                      <Link to={getJobDetailPath(user?.role, offer.id)}>
                        View Details
                        <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </Link>
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {!search && (
            <Pagination
              currentPage={page}
              totalPages={data?.totalPages ?? 1}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  );
}

