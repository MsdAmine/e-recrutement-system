import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@/types";
import { getApplicationStatusLabel, getApplicationStatusColor } from "@/lib/utils";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  return (
    <Badge variant={getApplicationStatusColor(status)}>
      {getApplicationStatusLabel(status)}
    </Badge>
  );
}
