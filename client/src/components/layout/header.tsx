import { Link, useLocation } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarClock, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { COMPANY_INFO, NAV_LINKS } from "@/lib/content";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const shouldReduceMotion = useReducedMotion();
  

  const primaryNav = useMemo(
    () =>
      [
        NAV_LINKS.find((link) => link.label === "Services"),
        NAV_LINKS.find((link) => link.label === "Team"),
        NAV_LINKS.find((link) => link.label === "Our Approach"),
        NAV_LINKS.find((link) => link.label === "Resources"),
        NAV_LINKS.find((link) => link.label === "Reviews"),
        { label: "Pay Online", href: "/pay-online" },
      ].filter(Boolean),
    [],
  );

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-primary bg-background dark:bg-card">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 px-3 py-2 bg-primary text-primary-foreground rounded-full"
      >
        Skip to content
      </a>

      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between gap-4 h-[90px]">
          <Link href="/">
            <a className="flex items-center m-0 p-0 h-full">
              <img
                src="/brand/full_black_logo.png"
                alt="Cornerstone Law Group, P.C."
                className="h-full w-fit max-h-[105px] dark:hidden"
              />
              <img
                src="/brand/full_white_logo.png"
                alt="Cornerstone Law Group, P.C."
                className="h-full w-fit max-h-[105px] hidden dark:block"
              />
            </a>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {primaryNav.map((link) => (
              <Link key={link?.href} href={link?.href ?? "#"}>
                <a
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors",
                    location === link?.href && "text-primary"
                  )}
                >
                  {link?.label}
                </a>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              variant="outline"
              size="sm"
              className="md:hidden rounded-full px-4 border-[#007AFF] text-[#007AFF] hover:border-[#007AFF]/80 hover:text-[#007AFF]/80"
            >
              <Link href="/client-portal">Portal</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden md:inline-flex rounded-full px-4 border-[#007AFF] text-[#007AFF] hover:border-[#007AFF]/80 hover:text-[#007AFF]/80"
            >
              <Link href="/client-portal">Portal</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full px-4">
              <a href="/schedule" className="inline-flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                Schedule
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden md:inline-flex rounded-full border-primary text-primary"
            >
              <Link href="/client-intake">Client Intake</Link>
            </Button>
            <button
              className="p-2 rounded-full border border-border/70 hover:border-primary/40 hover:text-primary lg:hidden"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="lg:hidden px-4 md:px-8 pb-4"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.25 }}
          >
            <div className="mt-3 rounded-2xl border border-border/70 bg-card/95 p-4 shadow-xl backdrop-blur">
              <nav className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a
                      className={cn(
                        "block rounded-xl px-3 py-3 text-sm font-semibold text-foreground hover:bg-muted",
                        location === link.href && "text-primary"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
                <Link href="/pay-online">
                  <a
                    className={cn(
                      "block rounded-xl px-3 py-3 text-sm font-semibold text-foreground hover:bg-muted",
                      location === "/pay-online" && "text-primary"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    Pay Online
                  </a>
                </Link>
              </nav>
              <div className="mt-4 grid gap-2">
                <Button asChild className="rounded-full">
                  <a href="/schedule">Schedule</a>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-primary text-primary">
                  <Link href="/client-intake">Client Intake</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
