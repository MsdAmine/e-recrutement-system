import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/store/themeStore";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const nextThemeLabel = isDark ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size={showLabel ? "sm" : "icon"}
      className={cn(showLabel && "justify-start gap-2.5", className)}
      onClick={toggleTheme}
      aria-label={`Switch to ${nextThemeLabel} mode`}
      title={`Switch to ${nextThemeLabel} mode`}
    >
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
      {showLabel && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
    </Button>
  );
}

