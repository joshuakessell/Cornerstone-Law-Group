import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const saved = localStorage.getItem("clg_theme");
    // Default to light if no saved theme
    const initial = saved === "dark" ? "dark" : "light";

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("clg_theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9"
      aria-label="Toggle theme"
      aria-pressed={theme === "dark"}
    >
      <span
        className={shouldReduceMotion ? "" : "transition-transform duration-300"}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </span>
    </Button>
  );
}






