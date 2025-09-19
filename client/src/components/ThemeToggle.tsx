import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("system");
    } else {
      setTheme("dark");
    }
  };

  const getIcon = () => {
    if (theme === "dark") {
      return <Moon className="w-4 h-4" />;
    } else if (theme === "light") {
      return <Sun className="w-4 h-4" />;
    } else {
      return <Sun className="w-4 h-4" />; // System default
    }
  };

  const getTooltip = () => {
    if (theme === "dark") {
      return "Switch to light mode";
    } else if (theme === "light") {
      return "Switch to system mode";
    } else {
      return "Switch to dark mode";
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={getTooltip()}
      data-testid="button-theme-toggle"
    >
      {getIcon()}
    </Button>
  );
}