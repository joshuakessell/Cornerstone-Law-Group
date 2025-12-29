import { COMPANY_INFO } from "@/lib/content";

export function Footer() {
  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    }
    return phone;
  };

  return (
    <footer className="border-t-2 border-primary bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 md:gap-4">
          {/* Logo: shrink-to-content so it sits right beside the divider */}
          <div className="shrink-0 flex items-center justify-center md:justify-start">
            <img
              src="/brand/full_black_logo.png"
              alt="Cornerstone Law Group, P.C."
              className="h-[120px] sm:h-[130px] md:h-[140px] lg:h-[155px] w-auto object-contain dark:hidden"
            />
            <img
              src="/brand/full_white_logo.png"
              alt="Cornerstone Law Group, P.C."
              className="h-[120px] sm:h-[130px] md:h-[140px] lg:h-[155px] w-auto object-contain hidden dark:block"
            />
          </div>

          {/* Mobile horizontal divider (black thin + gold thick) */}
          <div className="md:hidden flex flex-col gap-[2px] w-full" aria-hidden="true">
            <div className="h-[2px] w-full bg-foreground/90" />
            <div className="h-[6px] w-full bg-primary" />
          </div>

          {/* Desktop vertical divider (inset top/bottom by ~10px) */}
          <div
            className="hidden md:flex flex-row gap-[2px] shrink-0 self-stretch py-[10px]"
            aria-hidden="true"
          >
            <div className="w-[2px] h-full bg-foreground/90" />
            <div className="w-[6px] h-full bg-primary" />
          </div>

          {/* Info block: do NOT stretch across the viewport on desktop */}
          <div className="w-full md:w-auto md:max-w-[760px]">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-8 md:gap-x-10 gap-y-2">
              {/* Row 1 left: Name + Title */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-sm md:text-base lg:text-lg font-semibold uppercase tracking-wide">
                    CLINT C. BROWN,
                  </span>
                  <span className="text-sm md:text-base lg:text-lg font-semibold uppercase tracking-wide text-primary">
                    MANAGING PARTNER
                  </span>
                </div>
              </div>

              {/* Row 1 right: LinkedIn (aligned with the title line) */}
              <a
                href={COMPANY_INFO.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="justify-self-end self-center inline-flex items-center justify-center w-9 h-9 rounded border-2 border-primary bg-background text-foreground hover:opacity-90 transition-opacity"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <span className="font-extrabold text-sm leading-none">in</span>
              </a>

              {/* Row 2 left: Firm */}
              <div className="min-w-0 text-sm md:text-base font-semibold uppercase tracking-wide leading-tight">
                CORNERSTONE LAW GROUP, P.C.
              </div>

              {/* Row 2 right: Phones under LinkedIn */}
              <div className="justify-self-end self-start text-right text-sm md:text-base font-semibold whitespace-nowrap">
                <div>
                  <span className="font-bold">V</span> | {formatPhone(COMPANY_INFO.phone)}
                </div>
                <div>
                  <span className="font-bold">F</span> | {formatPhone(COMPANY_INFO.fax)}
                </div>
              </div>

              {/* Row 3 left: Address (2 lines like the reference) */}
              <div className="min-w-0 text-sm md:text-base font-medium leading-snug">
                <div>8140 Walnut Hill Ln. | Ste. 220</div>
                <div>Dallas, Texas | 75231</div>
              </div>
              <div />

              {/* Row 4 left: Website */}
              <a
                href={`https://${COMPANY_INFO.website}`}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 text-sm md:text-base font-semibold lowercase hover:text-primary transition-colors break-all"
              >
                {COMPANY_INFO.website}
              </a>
              <div />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
