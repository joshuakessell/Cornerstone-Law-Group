import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { COMPANY_INFO } from "@/lib/content";
import { integrationsConfig, isRelativeUrl } from "@/lib/integrations";

type Props = {
  title?: string;
  description?: string;
  url?: string | null;
  openHref?: string | null;
  warning?: string | null;
};

export function SchedulerEmbed({
  title = "Schedule Consultation",
  description,
  url = integrationsConfig.schedulerUrl,
  openHref,
  warning,
}: Props) {
  const [canEmbed, setCanEmbed] = useState(true);

  useEffect(() => {
    if (!url) return undefined;
    // Basic feature detection; if iframe errors, fallback button remains.
    const timer = setTimeout(() => {
      const iframe = document.getElementById("clio-scheduler-embed") as HTMLIFrameElement | null;
      if (iframe && (iframe as any).contentDocument === null) {
        setCanEmbed(false);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [url]);

  const buttonHref = openHref ?? url ?? null;

  if (!url) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">{title}</h2>
          {description ? <p className="text-muted-foreground">{description}</p> : null}
        </div>
        <div className="p-4 rounded-lg border border-border bg-muted/40">
          <p className="text-sm text-muted-foreground">
            Online scheduling is not configured right now. Please call or send us a note and we’ll get you booked.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="rounded-full px-8">
            <a href={`tel:${COMPANY_INFO.phone}`}>Call {COMPANY_INFO.phone}</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-primary text-primary">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">{title}</h2>
        {description ? <p className="text-muted-foreground">{description}</p> : null}
      </div>
      {warning ? (
        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {warning}
        </div>
      ) : null}
      {canEmbed ? (
        <div className="rounded-xl border border-border shadow-sm overflow-hidden bg-card">
          <iframe
            id="clio-scheduler-embed"
            src={url}
            title="Clio Scheduler"
            className="w-full h-[720px]"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-border shadow-sm overflow-hidden bg-card p-6">
          <p className="text-muted-foreground">Embed blocked? Use the open button below.</p>
        </div>
      )}
      <div>
        <Button
          asChild
          size="lg"
          className="rounded-full px-8"
        >
          {buttonHref && isRelativeUrl(buttonHref) ? (
            <Link href={buttonHref}>Open Scheduler</Link>
          ) : (
            <a href={buttonHref ?? "/schedule"}>Open Scheduler</a>
          )}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Your information is confidential. You can also call us at{" "}
        <a className="underline" href={`tel:${COMPANY_INFO.phone}`}>
          {COMPANY_INFO.phone}
        </a>
        .
      </p>
    </div>
  );
}

