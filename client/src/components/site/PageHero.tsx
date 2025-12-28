import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  kicker?: string;
  title: string;
  subtitle?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  children?: ReactNode;
  align?: "left" | "center";
};

export function PageHero({
  kicker,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  children,
  align = "left",
}: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/50 border-b border-border">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#d6a84b22,transparent_30%),radial-gradient(circle_at_80%_0%,#7dd3fc18,transparent_25%)]" />
      <div className={cn("container mx-auto px-6 md:px-12 py-16 md:py-20", align === "center" && "text-center")}>
        <div className="max-w-4xl space-y-6">
          {kicker ? <p className="uppercase tracking-[0.14em] text-xs text-primary font-semibold">{kicker}</p> : null}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground">{title}</h1>
          {subtitle ? <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">{subtitle}</p> : null}
          <div className="flex flex-wrap gap-3">
            {ctaPrimary ? (
              <Button asChild size="lg" className="rounded-full px-8">
                <a href={ctaPrimary.href}>{ctaPrimary.label}</a>
              </Button>
            ) : null}
            {ctaSecondary ? (
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-primary text-primary">
                <a href={ctaSecondary.href}>{ctaSecondary.label}</a>
              </Button>
            ) : null}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

