import { Button } from "@/components/ui/button";
import { Phone, CalendarClock, Shield } from "lucide-react";

export function MobileDock() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border shadow-2xl lg:hidden">
      <div className="grid grid-cols-3">
        <a
          href="tel:2142149500"
          className="flex flex-col items-center justify-center py-3 text-sm font-semibold text-foreground hover:text-primary"
        >
          <Phone className="w-5 h-5 mb-1" />
          Call
        </a>
        <a
          href="/schedule"
          className="flex flex-col items-center justify-center py-3 text-sm font-semibold text-primary hover:text-primary"
        >
          <CalendarClock className="w-5 h-5 mb-1" />
          Schedule
        </a>
        <Button
          asChild
          variant="ghost"
          className="flex flex-col items-center justify-center py-3 text-sm font-semibold text-foreground"
        >
          <a href="/client-portal">
            <Shield className="w-5 h-5 mb-1" />
            Portal
          </a>
        </Button>
      </div>
    </div>
  );
}

