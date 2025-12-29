import { Section } from "@/components/ui/section";
import { SEO } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";

export default function OurApproach() {
  const pillars = [
    { title: "Strategy & Advocacy", copy: "Clear plans, transparent communication, and courtroom-ready preparation." },
    { title: "Conflict Reduction", copy: "Mediation and collaborative options first when safe and appropriate." },
    { title: "Family Stability", copy: "Child-centered outcomes and financial clarity that last." },
  ];

  const steps = ["Intake", "Strategy", "Plan", "Resolution"];

  return (
    <>
      <SEO
        title="Our Approach"
        description="A calm, strategic framework that puts children first, reduces conflict, and prepares for court when needed."
        path="/our-approach"
      />
      <PageHero
        kicker="Our Approach"
        title="Calm decisions. Strong outcomes."
        subtitle="We blend a collaborative mindset with decisive advocacy. Every matter starts with stabilization, then we pick the right process: collaboration, mediation, or litigation."
        ctaPrimary={{ label: "Talk with us", href: "/contact" }}
        ctaSecondary={{ label: "Schedule consultation", href: "/schedule" }}
      />

      <Section background="muted" padded>
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="p-5 bg-card border border-border rounded-xl shadow-sm">
              <h3 className="font-serif text-xl text-foreground mb-2">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground">{pillar.copy}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section background="none" padded>
        <div className="max-w-4xl space-y-6">
          <h2 className="font-serif text-3xl text-foreground">4-step timeline</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map((step, idx) => (
              <div key={step} className="p-4 rounded-xl border border-border bg-card flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{step}</p>
                  <p className="text-sm text-muted-foreground">
                    {step === "Intake"
                      ? "Stabilize, gather essentials, define success."
                      : step === "Strategy"
                        ? "Select collaborative, mediation, or litigation path."
                        : step === "Plan"
                          ? "Evidence, experts, timelines, and communication rhythms."
                          : "Finalize orders and plan for enforcement or future updates."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
