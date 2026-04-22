import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { recruiterService } from "@/services/recruiterService";
import { queryKeys } from "@/lib/queryKeys";
import { useAuth } from "@/store/authStore";
import { StatCard, PageHeader, Skeleton } from "@/components/shared/SharedComponents";
import { Button } from "@/components/ui/button";
import {
  BriefcaseIcon,
  CheckCircleIcon,
  FileTextIcon,
  ClockIcon,
  EyeIcon,
  XCircleIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  UsersIcon,
} from "lucide-react";

export function RecruiterDashboardPage() {
  const { user } = useAuth();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: queryKeys.recruiterDashboard,
    queryFn: recruiterService.getDashboard,
  });

  return (
    <div className="max-w-5xl mx-auto animate-in">
      <PageHeader
        title={`Welcome, ${user?.firstName} 👋`}
        description="Your recruitment pipeline at a glance."
        action={
          <Button asChild size="sm">
            <Link to="/recruiter/job-offers/new">
              <PlusCircleIcon className="h-4 w-4" />
              Post a Job
            </Link>
          </Button>
        }
      />

      {/* Job Offer Stats */}
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Job Offers
        </p>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : dashboard ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="Total Offers"
              value={dashboard.totalJobOffers}
              icon={<BriefcaseIcon className="h-5 w-5" />}
              colorClass="bg-primary/10 text-primary"
            />
            <StatCard
              label="Active"
              value={dashboard.activeJobOffers}
              icon={<CheckCircleIcon className="h-5 w-5" />}
              colorClass="bg-success/10 text-success"
            />
            <StatCard
              label="Inactive"
              value={dashboard.inactiveJobOffers}
              icon={<XCircleIcon className="h-5 w-5" />}
              colorClass="bg-muted text-muted-foreground"
            />
          </div>
        ) : null}
      </div>

      {/* Application Stats */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Applications Received
        </p>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : dashboard ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Total"
              value={dashboard.totalApplicationsReceived}
              icon={<FileTextIcon className="h-5 w-5" />}
              colorClass="bg-primary/10 text-primary"
            />
            <StatCard
              label="Pending"
              value={dashboard.pendingApplications}
              icon={<ClockIcon className="h-5 w-5" />}
              colorClass="bg-warning/10 text-warning"
            />
            <StatCard
              label="In Review"
              value={dashboard.inReviewApplications}
              icon={<EyeIcon className="h-5 w-5" />}
              colorClass="bg-blue-500/10 text-blue-500"
            />
            <StatCard
              label="Accepted"
              value={dashboard.acceptedApplications}
              icon={<CheckCircleIcon className="h-5 w-5" />}
              colorClass="bg-success/10 text-success"
            />
          </div>
        ) : null}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <h2 className="font-semibold text-sm mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Post a Job",
              description: "Create a new job offer",
              href: "/recruiter/job-offers/new",
              icon: <PlusCircleIcon className="h-5 w-5" />,
            },
            {
              label: "View Applications",
              description: "Review incoming candidates",
              href: "/recruiter/applications",
              icon: <UsersIcon className="h-5 w-5" />,
            },
            {
              label: "My Job Offers",
              description: "Manage your active listings",
              href: "/recruiter/job-offers",
              icon: <BriefcaseIcon className="h-5 w-5" />,
            },
          ].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 p-3.5 rounded-lg border border-border hover:border-primary/40 hover:bg-accent/50 transition-all group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium group-hover:text-primary transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <ArrowRightIcon className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
