import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getInitials, cn } from "@/lib/utils";
import {
  BriefcaseIcon,
  LayoutDashboardIcon,
  UserIcon,
  FileTextIcon,
  BellIcon,
  PlusCircleIcon,
  LogOutIcon,
  ChevronRightIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const candidateNav: NavItem[] = [
  { label: "Dashboard", href: "/candidate/dashboard", icon: <LayoutDashboardIcon className="h-4 w-4" /> },
  { label: "Browse Jobs", href: "/candidate/jobs", icon: <BriefcaseIcon className="h-4 w-4" /> },
  { label: "My Applications", href: "/candidate/applications", icon: <FileTextIcon className="h-4 w-4" /> },
  { label: "Profile", href: "/candidate/profile", icon: <UserIcon className="h-4 w-4" /> },
  { label: "Notifications", href: "/candidate/notifications", icon: <BellIcon className="h-4 w-4" /> },
];

const recruiterNav: NavItem[] = [
  { label: "Dashboard", href: "/recruiter/dashboard", icon: <LayoutDashboardIcon className="h-4 w-4" /> },
  { label: "My Job Offers", href: "/recruiter/job-offers", icon: <BriefcaseIcon className="h-4 w-4" /> },
  { label: "Post a Job", href: "/recruiter/job-offers/new", icon: <PlusCircleIcon className="h-4 w-4" /> },
  { label: "Applications", href: "/recruiter/applications", icon: <FileTextIcon className="h-4 w-4" /> },
  { label: "Profile", href: "/recruiter/profile", icon: <UserIcon className="h-4 w-4" /> },
  { label: "Notifications", href: "/recruiter/notifications", icon: <BellIcon className="h-4 w-4" /> },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboardIcon className="h-4 w-4" /> },
  { label: "Manage Users", href: "/admin/users", icon: <UserIcon className="h-4 w-4" /> },
  { label: "Supervise Jobs", href: "/admin/jobs", icon: <BriefcaseIcon className="h-4 w-4" /> },
  { label: "Edit Profile", href: "/admin/profile", icon: <UserIcon className="h-4 w-4" /> },
];

interface AppSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isRecruiter = user?.role === "ROLE_RECRUITER";
  const isAdmin = user?.role === "ROLE_ADMIN";

  const navItems = isAdmin ? adminNav : (isRecruiter ? recruiterNav : candidateNav);

  const handleLogout = () => {
    logout();
    onNavigate?.();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "h-screen w-64 shrink-0 flex-col border-r border-border/80 bg-card/95 shadow-[1px_0_0_hsl(var(--border)/0.45),8px_0_28px_hsl(222_38%_9%/0.035)]",
        className ?? "hidden lg:flex sticky top-0"
      )}
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-border/80 px-5">
        <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm shadow-primary/20">
            <BriefcaseIcon className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">TalentBridge</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isExact = location.pathname === item.href;
          let isActive = isExact;

          if (!isExact && location.pathname.startsWith(`${item.href}/`)) {
            if (item.href === "/recruiter/job-offers" && location.pathname === "/recruiter/job-offers/new") {
              isActive = false;
            } else {
              isActive = true;
            }
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_1px_2px_hsl(var(--primary)/0.25),0_8px_18px_hsl(var(--primary)/0.14)]"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRightIcon className="h-3 w-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="p-3">
        <Link
          to={isAdmin ? "/admin/dashboard" : (isRecruiter ? "/recruiter/profile" : "/candidate/profile")}
          onClick={onNavigate}
          className="group flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent"
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {user ? getInitials(user.firstName, user.lastName) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOutIcon className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
