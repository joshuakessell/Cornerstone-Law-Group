import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, CalendarClock, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { COMPANY_INFO, NAV_LINKS } from "@/lib/content";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getGrowIntakeUrl, isRelativeUrl } from "@/lib/integrations";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const generalIntakeUrl = getGrowIntakeUrl("general");

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 backdrop-blur bg-background/90 border-b border-border">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 px-3 py-2 bg-primary text-primary-foreground rounded">
        Skip to content
      </a>

      {/* Utility bar */}
      <div className="border-b border-border/60 bg-secondary/60">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-3 py-2 text-sm">
          <div className="flex items-center gap-3">
            <a href={`tel:${COMPANY_INFO.phone}`} className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
            <span className="hidden sm:inline text-muted-foreground">Dallas & surrounding areas</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a href="/client-portal" className="hover:text-primary transition-colors">Client Portal</a>
            <a href="/pay-online" className="hover:text-primary transition-colors inline-flex items-center gap-1">
              <CreditCard className="w-4 h-4" /> Pay Online
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <a className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
              <span className="text-primary font-serif text-xl">CL</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-foreground leading-tight">Cornerstone Law Group, P.C.</p>
              <p className="text-xs text-muted-foreground">{COMPANY_INFO.tagline}</p>
            </div>
          </a>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={cn(
                  "text-sm font-semibold uppercase tracking-wide hover:text-primary transition-colors pb-1 border-b-2 border-transparent",
                  location === link.href && "text-primary border-primary"
                )}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="lg" className="hidden md:inline-flex rounded-full px-5 h-11 shadow-lg">
            <a href="/schedule" className="inline-flex items-center gap-2">
              <CalendarClock className="w-4 h-4" />
              Schedule Consultation
            </a>
          </Button>
          <button
            className="p-2 rounded-full border border-border hover:border-primary hover:text-primary lg:hidden"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden transition-[max-height] duration-300 overflow-hidden border-t border-border bg-card",
          isOpen ? "max-h-[420px]" : "max-h-0"
        )}
      >
        <div className="px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={cn(
                  "block py-3 px-3 rounded-lg border border-transparent hover:border-primary/40 hover:bg-muted",
                  location === link.href ? "text-primary border-primary/40 bg-muted" : "text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            </Link>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button asChild size="lg" className="rounded-full">
              <a href="/schedule">Schedule</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-primary text-primary">
              {generalIntakeUrl ? (
                isRelativeUrl(generalIntakeUrl) ? (
                  <Link href={generalIntakeUrl}>Intake</Link>
                ) : (
                  <a href={generalIntakeUrl} target="_blank" rel="noreferrer">
                    Intake
                  </a>
                )
              ) : (
                <Link href="/contact">Contact</Link>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
