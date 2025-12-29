import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  kicker?: string;
  title: string;
  subtitle?: string;
  ctaPrimary?: { label: string; href: string; external?: boolean };
  ctaSecondary?: { label: string; href: string; external?: boolean };
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
    <section className="relative overflow-hidden border-b border-border/70 bg-background/80">
      <div className="pointer-events-none absolute inset-0 opacity-45 app-texture" />
      <div
        className={cn(
          "container mx-auto px-6 md:px-12 py-4 md:py-6",
          align === "center" && "text-center"
        )}
      >
        <div className={cn("max-w-4xl space-y-2 md:space-y-3", align === "center" && "mx-auto")}>
          {kicker ? (
            <p className="uppercase tracking-[0.2em] text-xs text-primary font-semibold">{kicker}</p>
          ) : null}
          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.05] text-foreground">{title}</h1>
          {subtitle ? (
            <p className={cn("text-sm md:text-base text-muted-foreground", align !== "center" && "max-w-3xl")}>
              {subtitle}
            </p>
          ) : null}
          <div className={cn("flex flex-wrap gap-2", align === "center" && "justify-center")}>
            {ctaPrimary ? (
              <Button asChild size="sm" className="rounded-full px-4">
                <a
                  href={ctaPrimary.href}
                  target={ctaPrimary.external ? "_blank" : undefined}
                  rel={ctaPrimary.external ? "noreferrer" : undefined}
                >
                  {ctaPrimary.label}
                </a>
              </Button>
            ) : null}
            {ctaSecondary ? (
              <Button asChild variant="outline" size="sm" className="rounded-full px-4 border-primary text-primary">
                <a
                  href={ctaSecondary.href}
                  target={ctaSecondary.external ? "_blank" : undefined}
                  rel={ctaSecondary.external ? "noreferrer" : undefined}
                >
                  {ctaSecondary.label}
                </a>
              </Button>
            ) : null}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

