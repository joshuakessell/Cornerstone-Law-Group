import { Section } from "@/components/ui/section";
import { ContactFlow } from "@/components/site/ContactFlow";
import { SchedulerEmbed } from "@/components/site/SchedulerEmbed";
import { COMPANY_INFO } from "@/lib/content";
import { SEO } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";

export default function Contact() {
  const mapQuery = `${COMPANY_INFO.address.street}, ${COMPANY_INFO.address.city}, ${COMPANY_INFO.address.state} ${COMPANY_INFO.address.zip}`;

  return (
    <>
      <SEO
        title="Get Started"
        description="Branching contact flow to select your matter and schedule a consultation. Secure intake links per practice area."
        path="/contact"
      />
      <PageHero
        kicker="Get Started"
        title="Schedule or start intake"
        subtitle="Choose your matter, answer lightweight branching questions, then schedule. No sensitive data here, just the essentials."
        ctaPrimary={{ label: "Schedule consultation", href: "/schedule" }}
        ctaSecondary={{ label: "Start intake", href: "/client-intake" }}
      />

      <Section background="muted" padded>
        <div className="max-w-5xl space-y-10">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.12em] text-primary font-semibold">Step 1 & 2</p>
            <h2 className="font-serif text-3xl text-foreground">Tell us the basics</h2>
            <ContactFlow />
          </div>

          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.12em] text-primary font-semibold">Step 3</p>
            <SchedulerEmbed description="Main action: book your confidential consultation. If the embed is blocked, use the open button." />
          </div>

          <p className="text-xs text-muted-foreground">
            Submitting information does not create an attorney-client relationship. Please do not include sensitive personal
            data. We will provide secure upload links if documents are needed.
          </p>
        </div>
      </Section>

      <Section background="none" padded>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-card border border-border rounded-xl">
            <p className="font-semibold text-foreground mb-2">Call</p>
            <a href={`tel:${COMPANY_INFO.phone}`} className="text-primary font-semibold">
              {COMPANY_INFO.phone}
            </a>
          </div>
          <div className="p-4 bg-card border border-border rounded-xl">
            <p className="font-semibold text-foreground mb-2">Hours</p>
            <p className="text-muted-foreground">Mon-Thu: {COMPANY_INFO.hours.mon_thu}</p>
            <p className="text-muted-foreground">Fri: {COMPANY_INFO.hours.fri}</p>
          </div>
          <div className="p-4 bg-card border border-border rounded-xl">
            <p className="font-semibold text-foreground mb-2">Address</p>
            <p className="text-muted-foreground">{COMPANY_INFO.address.street}</p>
            <p className="text-muted-foreground">
              {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state} {COMPANY_INFO.address.zip}
            </p>
          </div>
        </div>
        <div className="w-full h-64 bg-muted rounded-xl overflow-hidden mt-6">
          <iframe
            title="Office Location"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyB85-jSS2Y0o-Z1k2uSxLhv6khE2XUui20&q=${encodeURIComponent(mapQuery)}`}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Section>
    </>
  );
}
