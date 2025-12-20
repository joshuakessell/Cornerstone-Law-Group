import { COMPANY_INFO, NAV_LINKS } from "@/lib/content";
import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-bold tracking-tight text-primary mb-1">Cornerstone</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Law Group, P.C.</p>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {COMPANY_INFO.tagline}. Constructive solutions that protect and redefine what matters most to you and your family.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-primary">Navigation</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-muted-foreground hover:text-primary transition-colors text-sm">{link.label}</a>
                  </Link>
                </li>
              ))}
              <li>
                 <a href="https://secure.lawpay.com/pages/cornerstonelawtexas/trust?gr_used=true" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                   Make a Payment
                 </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-primary">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>
                  {COMPANY_INFO.address.street}<br/>
                  {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state} {COMPANY_INFO.address.zip}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-primary transition-colors">{COMPANY_INFO.phone}</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-primary transition-colors">{COMPANY_INFO.email}</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-primary">Hours</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between border-b border-border pb-2">
                <span>Mon – Thu</span>
                <span>{COMPANY_INFO.hours.mon_thu}</span>
              </li>
              <li className="flex justify-between border-b border-border pb-2">
                <span>Friday</span>
                <span>{COMPANY_INFO.hours.fri}</span>
              </li>
              <li className="flex justify-between pt-1">
                <span>Sat – Sun</span>
                <span>{COMPANY_INFO.hours.weekend}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cornerstone Law Group, P.C. All rights reserved.</p>
          <div className="flex gap-6">
             <span>Privacy Policy</span>
             <span>Disclaimer</span>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-muted rounded text-[10px] text-muted-foreground leading-relaxed text-center md:text-left">
          DISCLAIMER: The information provided on this website is for general informational purposes only and does not constitute legal advice. Visiting this site or contacting Cornerstone Law Group, P.C. does not create an attorney-client relationship.
        </div>
      </div>
    </footer>
  );
}
