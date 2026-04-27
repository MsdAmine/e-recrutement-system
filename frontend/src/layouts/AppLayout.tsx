import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/store/authStore";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { BellIcon, MenuIcon, LogOutIcon, BriefcaseIcon } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isRecruiter = user?.role === "ROLE_RECRUITER";
  const isAdmin = user?.role === "ROLE_ADMIN";
  const notificationsHref = isRecruiter
    ? "/recruiter/notifications"
    : (isAdmin ? "/admin/dashboard" : "/candidate/notifications");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <AppSidebar />

      {/* Mobile sidebar drawer */}
      <AppSidebar
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 transform transition-transform duration-200 lg:hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        onNavigate={() => setMobileSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar (mobile only) */}
        <header className="flex h-14 items-center justify-between border-b border-border/80 bg-card/95 px-4 shadow-sm shadow-slate-950/[0.03] backdrop-blur lg:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BriefcaseIcon className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">TalentBridge</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild>
              <Link to={notificationsHref} onClick={() => setMobileSidebarOpen(false)}>
                <BellIcon className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOutIcon className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden h-14 items-center justify-end border-b border-border/80 bg-card/85 px-6 shadow-sm shadow-slate-950/[0.03] backdrop-blur lg:flex">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild>
              <Link to={notificationsHref} aria-label="Notifications">
                <BellIcon className="h-4 w-4" />
              </Link>
            </Button>
            <Link
              to={isAdmin ? "/admin/dashboard" : (isRecruiter ? "/recruiter/profile" : "/candidate/profile")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {user ? getInitials(user.firstName, user.lastName) : "?"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.firstName}</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className={cn("flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
