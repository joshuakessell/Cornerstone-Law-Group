import { Section } from "@/components/ui/section";
import { TESTIMONIALS } from "@/lib/content";
import { SEO } from "@/lib/seo";
import { Quote } from "lucide-react";

export default function Reviews() {
  return (
    <>
      <SEO
        title="Client Reviews"
        description="Curated client reviews of Cornerstone Law Group, P.C. Consistent, calm advocacy for Dallas families."
        path="/reviews"
      />
      <Section background="none" padded>
        <div className="max-w-3xl space-y-3">
          <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Reviews</p>
          <h1 className="font-serif text-4xl text-foreground">Clients feel the difference</h1>
          <p className="text-muted-foreground">
            We keep layouts consistent—no odd short quotes—so you can scan real feedback quickly.
          </p>
        </div>
      </Section>

      <Section background="muted" padded>
        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <blockquote key={idx} className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-3">
              <Quote className="w-5 h-5 text-primary" />
              <p className="text-foreground font-medium leading-relaxed">“{t.quote}”</p>
              {t.author ? <p className="text-xs text-muted-foreground">— {t.author}</p> : null}
            </blockquote>
          ))}
        </div>
      </Section>
    </>
  );
}

