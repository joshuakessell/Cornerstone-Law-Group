import { Section } from "@/components/ui/section";
import { TESTIMONIALS } from "@/lib/content";
import { SEO } from "@/lib/seo";
import { Quote } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

export default function Reviews() {
  return (
    <>
      <SEO
        title="Client Reviews"
        description="Curated client reviews of Cornerstone Law Group, P.C. Consistent, calm advocacy for Dallas families."
        path="/reviews"
      />
      <PageHero
        kicker="Reviews"
        title="Clients feel the difference"
        subtitle="Real words from families we have guided. Scan quickly or settle in for the full story."
        ctaPrimary={{ label: "Schedule consultation", href: "/schedule" }}
        ctaSecondary={{ label: "See our approach", href: "/our-approach" }}
      />

      <Section background="muted" padded>
        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <blockquote key={idx} className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-3">
              <Quote className="w-5 h-5 text-primary" />
              <p className="text-foreground font-medium leading-relaxed">"{t.quote}"</p>
              {t.author ? <p className="text-xs text-muted-foreground">- {t.author}</p> : null}
            </blockquote>
          ))}
        </div>
      </Section>
    </>
  );
}

