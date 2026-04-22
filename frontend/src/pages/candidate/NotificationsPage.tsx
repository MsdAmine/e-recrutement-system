import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { notificationService } from "@/services/notificationService";
import { queryKeys } from "@/lib/queryKeys";
import { timeAgo } from "@/lib/utils";
import {
  PageHeader,
  EmptyState,
  Skeleton,
  ErrorDisplay,
} from "@/components/shared/SharedComponents";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { BellIcon, CheckCheckIcon, BriefcaseIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PAGE_SIZE = 10;

function NotificationIcon({ type }: { type: NotificationType }) {
  return type === "NEW_APPLICATION" ? (
    <UserIcon className="h-4 w-4" />
  ) : (
    <BriefcaseIcon className="h-4 w-4" />
  );
}

export function NotificationsPage() {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(0);
  }, [filter]);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey:
      filter === "all"
        ? queryKeys.notifications(page, PAGE_SIZE)
        : queryKeys.unreadNotifications(page, PAGE_SIZE),
    queryFn: () =>
      filter === "all"
        ? notificationService.getAll(page, PAGE_SIZE)
        : notificationService.getUnread(page, PAGE_SIZE),
  });

  const markAllMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });

  const markOneMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });

  const hasUnread =
    filter === "all"
      ? data?.content.some((n) => !n.read)
      : (data?.totalElements ?? 0) > 0;

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <PageHeader
        title="Notifications"
        description={data ? `${data.totalElements} total` : ""}
        action={
          hasUnread ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAllMutation.mutate()}
              loading={markAllMutation.isPending}
            >
              <CheckCheckIcon className="h-4 w-4" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as "all" | "unread")}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <ErrorDisplay
          title="Failed to load notifications"
          message="Please refresh or try again in a moment."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && data && (
        <>
          {data.content.length === 0 ? (
            <EmptyState
              icon={<BellIcon className="h-12 w-12" />}
              title={filter === "unread" ? "No unread notifications" : "No notifications"}
              description={
                filter === "unread"
                  ? "You're all caught up."
                  : "Notifications will appear here."
              }
            />
          ) : (
            <div className="space-y-2">
              {data.content.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 transition-colors",
                    notif.read
                      ? "border-border bg-card"
                      : "border-primary/20 bg-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5",
                      notif.read
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/15 text-primary"
                    )}
                  >
                    <NotificationIcon type={notif.type} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm leading-relaxed", !notif.read && "font-medium")}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>

                  {!notif.read && (
                    <button
                      onClick={() => markOneMutation.mutate(notif.id)}
                      disabled={markOneMutation.isPending}
                      className="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Mark as read"
                    >
                      <CheckCheckIcon className="h-4 w-4" />
                    </button>
                  )}
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
