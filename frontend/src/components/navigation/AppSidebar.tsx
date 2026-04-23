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

interface AppSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isRecruiter = user?.role === "ROLE_RECRUITER";
  const navItems = isRecruiter ? recruiterNav : candidateNav;

  const handleLogout = () => {
    logout();
    onNavigate?.();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "w-60 shrink-0 flex-col h-screen border-r border-border bg-card",
        className ?? "hidden lg:flex sticky top-0"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-border">
        <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BriefcaseIcon className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-tight">TalentBridge</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href ||
            location.pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
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

      {/* User footer */}
      <div className="p-3">
        <Link
          to={isRecruiter ? "/recruiter/profile" : "/candidate/profile"}
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {user ? getInitials(user.firstName, user.lastName) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-none truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {user?.email}
            </p>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-destructive mt-1"
          onClick={handleLogout}
        >
          <LogOutIcon className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
