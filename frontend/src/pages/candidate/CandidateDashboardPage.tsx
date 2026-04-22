import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { candidateService } from "@/services/candidateService";
import { queryKeys } from "@/lib/queryKeys";
import { useAuth } from "@/store/authStore";
import { StatCard, PageHeader, Skeleton } from "@/components/shared/SharedComponents";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileTextIcon,
  ClockIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  BriefcaseIcon,
  UserIcon,
  ArrowRightIcon,
} from "lucide-react";

export function CandidateDashboardPage() {
  const { user } = useAuth();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: queryKeys.candidateDashboard,
    queryFn: candidateService.getDashboard,
  });

  const { data: profile } = useQuery({
    queryKey: queryKeys.candidateProfile,
    queryFn: candidateService.getProfile,
  });

  const profileCompleteness = profile
    ? [
        profile.phone,
        profile.address,
        profile.headline,
        profile.summary,
        profile.cvUrl,
      ].filter(Boolean).length * 20
    : 0;

  return (
    <div className="max-w-5xl mx-auto animate-in">
      <PageHeader
        title={`Welcome back, ${user?.firstName} 👋`}
        description="Here's a summary of your recruitment activity."
        action={
          <Button asChild size="sm">
            <Link to="/jobs">
              <BriefcaseIcon className="h-4 w-4" />
              Browse Jobs
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : dashboard ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Total Applied"
            value={dashboard.totalApplications}
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
          <StatCard
            label="Rejected"
            value={dashboard.rejectedApplications}
            icon={<XCircleIcon className="h-5 w-5" />}
            colorClass="bg-destructive/10 text-destructive"
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile completeness */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">Profile Completeness</h2>
          </div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold">{profileCompleteness}%</span>
            <span className="text-xs text-muted-foreground">of 5 fields</span>
          </div>
          <Progress value={profileCompleteness} className="mb-4" />
          <p className="text-xs text-muted-foreground mb-4">
            {profileCompleteness < 100
              ? "Complete your profile to stand out to recruiters."
              : "Your profile is complete!"}
          </p>
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link to="/candidate/profile/edit">
              Edit Profile
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-5"
        >
          <h2 className="font-semibold text-sm mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                label: "My Applications",
                description: "Track all your submissions",
                href: "/candidate/applications",
                icon: <FileTextIcon className="h-5 w-5" />,
              },
              {
                label: "Browse Jobs",
                description: "Find new opportunities",
                href: "/jobs",
                icon: <BriefcaseIcon className="h-5 w-5" />,
              },
              {
                label: "Edit Profile",
                description: "Update your information",
                href: "/candidate/profile/edit",
                icon: <UserIcon className="h-5 w-5" />,
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
                <div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
