import { COMPANY_INFO, NAV_LINKS } from "@/lib/content";
import { Link } from "wouter";
import { SITE_CONFIG } from "@/lib/siteConfig";

const quickLinks = [
  ...NAV_LINKS,
  { label: "Client Portal", href: "/client-portal" },
  { label: "Pay Online", href: "/pay-online" },
];

export function Footer() {
  return (
    <footer className="bg-secondary/40 border-t border-border mt-16">
      <div className="container mx-auto px-6 md:px-12 py-12 space-y-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
              <span className="text-primary font-serif text-xl">CL</span>
            </div>
            <p className="font-semibold text-foreground">Cornerstone Law Group, P.C.</p>
            <p className="text-sm text-muted-foreground">
              {COMPANY_INFO.address.street}
              <br />
              {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state} {COMPANY_INFO.address.zip}
            </p>
            <a href={`tel:${COMPANY_INFO.phone}`} className="text-sm font-semibold text-primary">
              {COMPANY_INFO.phone}
            </a>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {quickLinks.map((link) =>
                link.href.startsWith("http") ? (
                  <a key={link.href} href={link.href} className="text-muted-foreground hover:text-primary">
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href}>
                    <a className="text-muted-foreground hover:text-primary">{link.label}</a>
                  </Link>
                ),
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Hours</h3>
            <p className="text-sm text-muted-foreground">
              Mon–Thu: {COMPANY_INFO.hours.mon_thu}
              <br />
              Fri: {COMPANY_INFO.hours.fri}
              <br />
              Weekend: {COMPANY_INFO.hours.weekend}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Dallas & surrounding areas</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Actions</h3>
            <a href="/schedule" className="block text-primary font-semibold">
              Schedule Consultation
            </a>
            <a href={SITE_CONFIG.intakeUrls.general} className="block text-muted-foreground hover:text-primary" target="_blank" rel="noreferrer">
              Start Secure Intake
            </a>
            <a href="/client-portal" className="block text-muted-foreground hover:text-primary">
              Client Portal
            </a>
            <a href="/pay-online" className="block text-muted-foreground hover:text-primary">
              Pay Online
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-6 grid gap-3 md:grid-cols-2 text-xs text-muted-foreground">
          <p>
            Submitting information does not create an attorney–client relationship. Please do not send confidential
            information until an engagement is confirmed.
          </p>
          <p className="md:text-right">&copy; {new Date().getFullYear()} Cornerstone Law Group, P.C. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
