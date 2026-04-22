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
import { BuildingIcon, GlobeIcon, EditIcon, AlignLeftIcon, BriefcaseIcon } from "lucide-react";

function ProfileRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || "—"}</p>
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

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        {/* Identity */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4 mb-5">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {profile ? getInitials(profile.firstName, profile.lastName) : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-muted-foreground text-sm">{profile?.email}</p>
              {profile?.companyName && (
                <p className="text-sm font-medium mt-0.5 flex items-center gap-1">
                  <BuildingIcon className="h-3.5 w-3.5" />
                  {profile.companyName}
                </p>
              )}
            </div>
          </div>

          <Separator className="mb-5" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProfileRow
              icon={<BuildingIcon className="h-4 w-4" />}
              label="Company"
              value={profile?.companyName ?? null}
            />
            <ProfileRow
              icon={<GlobeIcon className="h-4 w-4" />}
              label="Website"
              value={profile?.companyWebsite ?? null}
            />
            <ProfileRow
              icon={<BriefcaseIcon className="h-4 w-4" />}
              label="Sector"
              value={profile?.companySector ?? null}
            />
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlignLeftIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Company Description</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {profile?.companyDescription || "No description added yet."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
