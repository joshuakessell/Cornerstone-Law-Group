import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SERVICES, TESTIMONIALS, TEAM } from "@/lib/content";
import { Link } from "wouter";
import { ArrowRight, HeartHandshake, Shield, Scale, Sparkle, Quote } from "lucide-react";
import { SEO } from "@/lib/seo";
import { getGrowIntakeUrl, isRelativeUrl } from "@/lib/integrations";

const facing = [
  {
    title: "Considering divorce",
    copy: "Know your options before you make a move. We map a plan that protects kids and assets.",
    icon: Shield,
  },
  {
    title: "Protecting children",
    copy: "Child-centered parenting plans that reduce conflict and safeguard stability.",
    icon: HeartHandshake,
  },
  {
    title: "Financial security",
    copy: "Strategic property division, support frameworks, and enforcement when orders are ignored.",
    icon: Scale,
  },
];

export default function Home() {
  const divorceIntakeUrl = getGrowIntakeUrl("divorce");
  const generalIntakeUrl = getGrowIntakeUrl("general");

  return (
    <>
      <SEO
        title="Family Law in Dallas"
        description="Modern, strategic family law for Dallas families. Collaborative options, courtroom advocacy, and clear next steps."
        path="/"
      />
      <div className="relative overflow-hidden">
        <section className="relative bg-gradient-to-br from-background via-secondary/40 to-background border-b border-border">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#d6a84b22,transparent_30%),radial-gradient(circle_at_80%_0%,#7dd3fc18,transparent_25%)] pointer-events-none" />
          <div className="container mx-auto px-6 md:px-12 py-16 md:py-24 relative z-10">
            <div className="max-w-5xl space-y-8">
              <p className="uppercase tracking-[0.18em] text-xs text-primary font-semibold flex items-center gap-2">
                <Sparkle className="w-4 h-4" /> Dallas Family Law
              </p>
              <h1 className="font-serif text-4xl md:text-6xl leading-tight text-foreground">
                <span className="underline decoration-[8px] decoration-primary/60 underline-offset-8">Family</span>… the
                Cornerstone of Life.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                Constructive solutions that protect what matters most—your children, your finances, and your ability to
                move forward.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full px-8" type="button">
                  <Link href="/schedule">Schedule Consultation</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 border-primary text-primary"
                >
                  {divorceIntakeUrl ? (
                    isRelativeUrl(divorceIntakeUrl) ? (
                      <Link href={divorceIntakeUrl}>Start Secure Intake</Link>
                    ) : (
                      <a href={divorceIntakeUrl} target="_blank" rel="noreferrer">
                        Start Secure Intake
                      </a>
                    )
                  ) : (
                    <Link href="/contact">Contact us</Link>
                  )}
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="px-3 py-2 rounded-full border border-border">Collaborative & Mediation-first</span>
                <span className="px-3 py-2 rounded-full border border-border">Trial-ready when needed</span>
                <span className="px-3 py-2 rounded-full border border-border">Confidential & trauma-informed</span>
              </div>
            </div>
          </div>
        </section>

        <Section background="none" padded>
          <div className="grid md:grid-cols-3 gap-6">
            {facing.map((item) => (
              <div key={item.title} className="p-6 bg-card rounded-2xl border border-border shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.copy}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section background="muted" padded>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Practice Areas</p>
            <h2 className="font-serif text-4xl text-foreground">Services built to reduce conflict</h2>
            <p className="text-muted-foreground">
              Eight focused practice areas with clear expectations and predictable next steps.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                <a className="group bg-card p-5 rounded-xl border border-border hover:border-primary/40 hover:-translate-y-1 transition-all h-full flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{service.shortDescription}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-semibold">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </Section>

        <Section background="none" padded>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Our Approach</p>
              <h2 className="font-serif text-4xl text-foreground">Calm, strategic, forward-looking</h2>
              <p className="text-muted-foreground">
                We start with safety and stability, then choose the right path—collaborative, mediation, or litigation—
                based on your goals and risk tolerance.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Strategy & Advocacy — clear game plan with transparent communication</li>
                <li>• Conflict Reduction — keep decision-making with the family when safe to do so</li>
                <li>• Family Stability — plans that protect children and financial security</li>
              </ul>
              <Button asChild variant="link" className="text-primary px-0">
                <Link href="/our-approach">See our 4-step process</Link>
              </Button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-serif text-2xl text-foreground mb-4">Timeline at a glance</h3>
              <div className="space-y-4">
                {["Intake", "Strategy", "Plan", "Resolution"].map((step, idx) => (
                  <div key={step} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{step}</p>
                      <p className="text-sm text-muted-foreground">
                        {step === "Intake"
                          ? "Stabilize and capture the essentials."
                          : step === "Strategy"
                            ? "Choose collaborative, mediation, or litigation path."
                            : step === "Plan"
                              ? "Prepare evidence, negotiations, and parenting logistics."
                              : "Finalize orders and future-proof next steps."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section background="muted" padded>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Team</p>
              <h2 className="font-serif text-3xl text-foreground">Your legal + support team</h2>
            </div>
            <Button asChild variant="outline" className="rounded-full border-primary text-primary">
              <Link href="/our-team">Meet the team</Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {TEAM.slice(0, 3).map((member) => (
              <Link key={member.slug} href={`/our-team/${member.slug}`}>
                <a className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 hover:border-primary/50 transition-colors">
                  <div className="aspect-[4/3] rounded-lg bg-muted overflow-hidden">
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <p className="font-semibold text-foreground">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{member.shortBio}</p>
                </a>
              </Link>
            ))}
          </div>
        </Section>

        <Section background="none" padded>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Testimonials</p>
              <h2 className="font-serif text-3xl text-foreground">Clients feel the difference</h2>
              <p className="text-muted-foreground">
                Strategic advocacy with human warmth. Curated words from families we’ve guided.
              </p>
              <Button asChild variant="outline" className="rounded-full border-primary text-primary">
                <Link href="/reviews">Read reviews</Link>
              </Button>
            </div>
            <div className="flex-1 grid gap-4">
              {TESTIMONIALS.map((t, idx) => (
                <blockquote key={idx} className="p-5 bg-card border border-border rounded-2xl shadow-sm">
                  <Quote className="w-5 h-5 text-primary mb-2" />
                  <p className="text-foreground font-medium">“{t.quote}”</p>
                  {t.author ? <p className="text-xs text-muted-foreground mt-2">— {t.author}</p> : null}
                </blockquote>
              ))}
            </div>
          </div>
        </Section>

        <Section background="primary" padded>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="uppercase text-xs tracking-[0.16em] font-semibold">Next Step</p>
              <h3 className="font-serif text-3xl text-primary-foreground">Ready for a calm, decisive plan?</h3>
              <p className="text-primary-foreground/80 mt-2">
                Schedule a confidential consultation or start the secure intake. Dallas & surrounding areas.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6 bg-primary-foreground text-primary" type="button">
                <Link href="/schedule">Schedule Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6 border-primary-foreground text-primary-foreground">
                {generalIntakeUrl ? (
                  isRelativeUrl(generalIntakeUrl) ? (
                    <Link href={generalIntakeUrl}>Start Secure Intake</Link>
                  ) : (
                    <a href={generalIntakeUrl} target="_blank" rel="noreferrer">
                      Start Secure Intake
                    </a>
                  )
                ) : (
                  <Link href="/contact">Contact us</Link>
                )}
              </Button>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
