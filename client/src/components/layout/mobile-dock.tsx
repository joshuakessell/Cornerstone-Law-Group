import { CalendarClock, Phone } from "lucide-react";
import { COMPANY_INFO } from "@/lib/content";

export function MobileDock() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-primary bg-background dark:bg-card">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between gap-4 py-2 text-xs text-muted-foreground">
          <a
            href={`tel:${COMPANY_INFO.phone.replace(/[()\s-]/g, "")}`}
            className="inline-flex items-center gap-2 hover:text-primary"
          >
            <Phone className="h-3.5 w-3.5" />
            {COMPANY_INFO.phone}
          </a>
          <a
            href="/schedule"
            className="inline-flex items-center gap-2 hover:text-primary"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            Schedule
          </a>
          <a
            href="/client-portal"
            className="inline-flex items-center gap-2 hover:text-primary"
          >
            <img 
              src="/brand/clio-icon.svg" 
              alt="Clio" 
              className="h-4 w-4"
            />
            <span>Clio</span>
          </a>
        </div>
      </div>
    </div>
  );
}
