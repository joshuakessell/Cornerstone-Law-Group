import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("cs_theme");
    const systemPrefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    const initial = saved === "light" || saved === "dark" ? saved : systemPrefersDark ? "dark" : "light";

    setTheme(initial);
    document.documentElement.classList.toggle("light", initial === "light");
    document.documentElement.classList.toggle("dark", initial === "dark");

    const handler = (event: MediaQueryListEvent) => {
      const next = event.matches ? "dark" : "light";
      if (!localStorage.getItem("cs_theme")) {
        setTheme(next);
        document.documentElement.classList.toggle("light", next === "light");
        document.documentElement.classList.toggle("dark", next === "dark");
      }
    };

    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    media?.addEventListener("change", handler);
    return () => media?.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("cs_theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}






