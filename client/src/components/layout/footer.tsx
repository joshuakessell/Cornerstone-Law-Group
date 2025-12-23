import { COMPANY_INFO, NAV_LINKS } from "@/lib/content";
import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white text-neutral-900 border-t border-neutral-200 pt-12 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          {/* Logo and Company Name */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <img
              src="/brand/logo-black.png"
              alt="Cornerstone Law Group"
              className="h-12 w-auto"
              draggable={false}
            />
            <div>
              <h3 className="text-xl font-semibold tracking-tight mb-1">CORNERSTONE</h3>
              <p className="text-sm uppercase tracking-wider text-neutral-600 mb-1">LAW GROUP</p>
              <p className="text-xs uppercase tracking-wider text-neutral-500">ATTORNEYS | COUNSELORS | MEDIATORS</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-sm space-y-1">
            <p className="font-semibold">CLINT C. BROWN, MANAGING PARTNER</p>
            <p className="font-semibold">CORNERSTONE LAW GROUP, P.C.</p>
            <p className="text-neutral-600">
              {COMPANY_INFO.address.street} | Ste. 220
            </p>
            <p className="text-neutral-600">
              {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state} | {COMPANY_INFO.address.zip}
            </p>
            <p className="text-neutral-600">
              <a href={`https://${COMPANY_INFO.email.split('@')[1]}`} className="hover:text-primary transition-colors">
                {COMPANY_INFO.email.split('@')[1]}
              </a>
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a 
                href={COMPANY_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
                aria-label="LinkedIn"
              >
                <svg 
                  className="w-5 h-5 text-primary hover:text-primary/80 transition-colors" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <div className="flex items-center gap-2 text-neutral-600">
                <span className="font-medium">V</span>
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-primary transition-colors">
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <span className="font-medium">F</span>
                <span>214.370.3005</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Cornerstone Law Group, P.C. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy">
              <a className="hover:text-primary transition-colors">Privacy Policy</a>
            </Link>
            <Link href="/disclaimer">
              <a className="hover:text-primary transition-colors">Disclaimer</a>
            </Link>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-neutral-50 rounded text-[10px] text-neutral-600 leading-relaxed text-center md:text-left">
          DISCLAIMER: The information provided on this website is for general informational purposes only and does not constitute legal advice. Visiting this site or contacting Cornerstone Law Group, P.C. does not create an attorney-client relationship.
        </div>
      </div>
    </footer>
  );
}
