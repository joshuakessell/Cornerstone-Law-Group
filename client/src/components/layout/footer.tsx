import { COMPANY_INFO } from "@/lib/content";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white text-neutral-900 border-t border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Main Footer Content - Dynamically segmented and spaced */}
        <div className="pt-6 sm:pt-8 md:pt-10 pb-5 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            {/* Segment 1: Logo + Contact Info */}
            <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
              <img
                src="/brand/cornerstone_logo_footer.png"
                alt="Cornerstone Law Group"
                className="block h-32 w-auto"
                draggable={false}
              />
              <div className="text-xs sm:text-sm space-y-1.5 sm:space-y-2">
                <p className="font-semibold text-xs sm:text-sm">CLINT C. BROWN, <span className="text-primary">MANAGING PARTNER</span></p>
                <p className="font-semibold text-xs sm:text-sm">CORNERSTONE LAW GROUP, P.C.</p>
                <p className="text-neutral-600 text-xs sm:text-sm">
                  {COMPANY_INFO.address.street} | Ste. 220
                </p>
                <p className="text-neutral-600 text-xs sm:text-sm">
                  {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state} | {COMPANY_INFO.address.zip}
                </p>
                <p className="text-neutral-600 text-xs sm:text-sm">
                  <a href={`https://${COMPANY_INFO.email.split('@')[1]}`} className="hover:text-primary transition-colors">
                    {COMPANY_INFO.email.split('@')[1]}
                  </a>
                </p>
              </div>
            </div>

            {/* Segment 2: Social and Contact Methods */}
            <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-3 text-xs sm:text-sm">
              <a 
                href={COMPANY_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                aria-label="LinkedIn"
              >
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
              <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-600">
                <span className="font-medium shrink-0">V</span>
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-primary transition-colors whitespace-nowrap">
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-600">
                <span className="font-medium shrink-0">F</span>
                <span className="whitespace-nowrap">214.370.3005</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright and Links */}
        <div className="border-t border-neutral-200 pt-4 sm:pt-6 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-neutral-500">
            <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} Cornerstone Law Group, P.C. All rights reserved.</p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
              <Link href="/privacy">
                <a className="hover:text-primary transition-colors whitespace-nowrap">Privacy Policy</a>
              </Link>
              <Link href="/disclaimer">
                <a className="hover:text-primary transition-colors whitespace-nowrap">Disclaimer</a>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Disclaimer Section */}
        <div className="border-t border-neutral-200 pt-4 sm:pt-6 pb-6 sm:pb-8">
          <div className="p-3 sm:p-4 bg-neutral-50 rounded text-[9px] sm:text-[10px] text-neutral-600 leading-relaxed text-center sm:text-left">
            DISCLAIMER: The information provided on this website is for general informational purposes only and does not constitute legal advice. Visiting this site or contacting Cornerstone Law Group, P.C. does not create an attorney-client relationship.
          </div>
        </div>
      </div>
    </footer>
  );
}
