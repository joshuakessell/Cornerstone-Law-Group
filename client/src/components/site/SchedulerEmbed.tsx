import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/siteConfig";

type Props = {
  title?: string;
  description?: string;
};

export function SchedulerEmbed({ title = "Schedule Consultation", description }: Props) {
  const [canEmbed, setCanEmbed] = useState(true);

  useEffect(() => {
    // Basic feature detection; if iframe errors, fallback button remains.
    const timer = setTimeout(() => {
      const iframe = document.getElementById("clio-scheduler-embed") as HTMLIFrameElement | null;
      if (iframe && (iframe as any).contentDocument === null) {
        setCanEmbed(false);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">{title}</h2>
        {description ? <p className="text-muted-foreground">{description}</p> : null}
      </div>
      {canEmbed ? (
        <div className="rounded-xl border border-border shadow-sm overflow-hidden bg-card">
          <iframe
            id="clio-scheduler-embed"
            src={SITE_CONFIG.schedulerUrl}
            title="Clio Scheduler"
            className="w-full h-[720px]"
            loading="lazy"
          />
        </div>
      ) : (
        <Button
          asChild
          size="lg"
          className="rounded-full px-8"
        >
          <a href={SITE_CONFIG.schedulerUrl}>Open Scheduler</a>
        </Button>
      )}
      <p className="text-sm text-muted-foreground">
        Your information is confidential. You can also call us at <a className="underline" href="tel:2142149500">(214) 214-9500</a>.
      </p>
    </div>
  );
}

