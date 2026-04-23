import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { recruiterService } from "@/services/recruiterService";
import { queryKeys } from "@/lib/queryKeys";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton, PageHeader } from "@/components/shared/SharedComponents";
import { getInitials } from "@/lib/utils";
import {
  BuildingIcon,
  GlobeIcon,
  EditIcon,
  AlignLeftIcon,
  BriefcaseIcon,
  SparklesIcon,
  ExternalLinkIcon,
} from "lucide-react";

function ProfileRow({
  icon,
  label,
  value,
  isLink,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {isLink && value ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Visit website
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </a>
        ) : (
          <p className="text-sm font-medium break-all">{value || "—"}</p>
        )}
      </div>
    </div>
  );
}

export function RecruiterProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: queryKeys.recruiterProfile,
    queryFn: recruiterService.getProfile,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <PageHeader
        title="Company Profile"
        description="Your recruiter profile"
        action={
          <Button size="sm" asChild>
            <Link to="/recruiter/profile/edit">
              <EditIcon className="h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="surface-card relative overflow-hidden p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
          <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                <AvatarFallback className="text-lg bg-primary/15 text-primary">
                  {profile ? getInitials(profile.firstName, profile.lastName) : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold leading-tight">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">{profile?.email}</p>
                {profile?.companyName && (
                  <p className="text-sm font-medium mt-1.5 flex items-center gap-1.5 text-foreground/90">
                    <BuildingIcon className="h-3.5 w-3.5 text-primary" />
                    {profile.companyName}
                  </p>
                )}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <SparklesIcon className="h-3.5 w-3.5" />
              Recruiter Profile
            </div>
          </div>

          <Separator className="mb-5" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <ProfileRow
              icon={<BuildingIcon className="h-4 w-4" />}
              label="Company"
              value={profile?.companyName ?? null}
            />
            <ProfileRow
              icon={<GlobeIcon className="h-4 w-4" />}
              label="Website"
              value={profile?.companyWebsite ?? null}
              isLink
            />
            <ProfileRow
              icon={<BriefcaseIcon className="h-4 w-4" />}
              label="Sector"
              value={profile?.companySector ?? null}
            />
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlignLeftIcon className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm tracking-wide uppercase text-muted-foreground">
              Company Description
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {profile?.companyDescription || "No description added yet."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
