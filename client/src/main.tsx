import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Apply theme early to prevent flash
(function applyThemeEarly() {
  const savedTheme = localStorage.getItem("clg_theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }
  // If no saved theme, default to light (no class needed)
})();

createRoot(document.getElementById("root")!).render(<App />);
