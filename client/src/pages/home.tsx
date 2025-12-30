import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SERVICES, TESTIMONIALS, TEAM, COMPANY_INFO } from "@/lib/content";
import { Link } from "wouter";
import {
  ArrowRight,
  PhoneCall,
  Sparkle,
  Quote,
  ArrowLeft,
} from "lucide-react";
import { SEO } from "@/lib/seo";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DialogClose } from "@/components/ui/dialog";
import type { TeamMember } from "@/lib/content/team";

const microTimeline = [
  { title: "Intake", copy: "Stabilize the essentials and define priorities." },
  { title: "Strategy", copy: "Choose the right path: collaborative, mediation, or litigation." },
  { title: "Plan", copy: "Prepare evidence, negotiations, and parenting logistics." },
  { title: "Resolution", copy: "Finalize agreements and protect what comes next." },
];

const processSteps = [
  {
    title: "Stabilize first",
    copy: "We start with safety, clarity, and a plan that protects children and finances.",
  },
  {
    title: "Choose the right path",
    copy: "Collaborative and mediation options lead when they serve your goals.",
  },
  {
    title: "Build the case",
    copy: "Evidence, timelines, and negotiations are organized with steady communication.",
  },
  {
    title: "Resolve and future-proof",
    copy: "Orders, agreements, and enforcement plans are built to last.",
  },
];


export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <>
      <SEO
        title="Family Law in Dallas"
        description="Modern, strategic family law for Dallas families. Collaborative options, courtroom advocacy, and clear next steps."
        path="/"
      />

      <section className="relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-0 -z-10">
          {!shouldReduceMotion ? (
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-70 dark:opacity-60"
              autoPlay
              muted
              loop
              playsInline
              poster="/media/CSLG2-poster.jpg"
            >
              <source src="/media/CSLG2.webm" type="video/webm" />
            </video>
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/40 to-secondary/20 dark:from-background/40 dark:via-background/30 dark:to-secondary/10" />
          <div className="absolute inset-0 app-texture opacity-60" />
        </div>

        <div className="container mx-auto px-6 md:px-12 py-4 md:py-6">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="relative">
              <div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-xl backdrop-blur">
                <div className="space-y-6">
                  <p className="uppercase tracking-[0.2em] text-xs text-primary font-semibold flex items-center gap-2">
                    <Sparkle className="w-4 h-4" /> Dallas Family Law
                  </p>
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-foreground">
                    Family is the cornerstone of life.
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                    Constructive solutions that protect what matters most - your children, your finances, and your ability to
                    move forward with clarity.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button asChild size="lg" className="rounded-full px-8 text-center">
                      <a href="/schedule">Schedule Consultation</a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="rounded-full px-8 border-primary text-primary text-center"
                    >
                      <Link href="/client-intake">Client Intake</Link>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dallas and surrounding areas. Collaborative when possible, courtroom-ready when needed.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-xl backdrop-blur">
                <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold mb-4">What to expect</p>
                <div className="space-y-3">
                  {microTimeline.map((item, idx) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section background="none" padded>
        <div className="flex items-center justify-between gap-6 mb-10">
          <div className="space-y-3">
            <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Services</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Focused practice areas</h2>
            <p className="text-muted-foreground max-w-2xl">
              Clear scope, calm process, and a defined plan for every matter we take on.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full border-primary text-primary hidden md:inline-flex">
            <Link href="/services">View all services</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[220px]">
          {SERVICES.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`}>
              <a className="group relative flex h-full flex-col justify-between rounded-2xl border border-border bg-card/90 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold">Service</p>
                  <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{service.shortDescription}</p>
                </div>
                <span className="mt-auto pt-4 inline-flex items-center gap-2 text-primary text-sm font-semibold">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </Link>
          ))}
        </div>
      </Section>

      <Section background="muted" padded>
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div className="space-y-4">
            <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Our process</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Calm, strategic, forward-looking</h2>
            <p className="text-muted-foreground max-w-2xl">
              We reduce uncertainty by moving with intention and transparency. Every step is designed to protect stability
              for families.
            </p>
            <Button asChild variant="outline" className="rounded-full border-primary text-primary">
              <Link href="/our-approach">See our approach</Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-lg">
            <div className="space-y-4">
              {processSteps.map((step, idx) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section background="none" padded>
        <div className="flex items-center justify-between gap-6 mb-8">
          <div>
            <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Testimonials</p>
            <h2 className="font-serif text-3xl text-foreground">Clients feel the difference</h2>
          </div>
          <Button asChild variant="outline" className="rounded-full border-primary text-primary hidden md:inline-flex">
            <Link href="/reviews">Read reviews</Link>
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              className="min-w-[260px] max-w-[320px] snap-start rounded-2xl border border-border bg-card/90 p-5 shadow-sm"
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <Quote className="w-5 h-5 text-primary mb-3" />
              <p className="text-sm text-foreground leading-relaxed">"{t.quote}"</p>
              {t.author ? <p className="text-xs text-muted-foreground mt-3">- {t.author}</p> : null}
            </motion.div>
          ))}
        </div>
      </Section>

      <Section background="muted" padded>
        <div className="flex items-center justify-between gap-6 mb-8">
          <div>
            <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Team</p>
            <h2 className="font-serif text-3xl text-foreground">Your legal + support team</h2>
          </div>
          <Button asChild variant="outline" className="rounded-full border-primary text-primary hidden md:inline-flex">
            <Link href="/our-team">Meet the team</Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.slice(0, 4).map((member) => (
            <button
              key={member.slug}
              onClick={() => setSelectedMember(member)}
              className="group text-left bg-card border border-border rounded-2xl p-4 flex flex-col items-start justify-start gap-3 hover:border-primary/50 hover:-translate-y-1 transition-all w-full"
            >
              <div className="rounded-xl overflow-hidden bg-muted w-full h-[320px]">
                <img 
                  src={member.photo} 
                  alt={member.name} 
                  className="w-full h-full object-cover" 
                  loading="lazy" 
                />
              </div>
              <div>
                <p className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                  {member.name}
                </p>
                <p className="text-sm text-primary font-semibold">{member.title}</p>
              </div>
            </button>
          ))}
        </div>
      </Section>

      <Dialog open={selectedMember !== null} onOpenChange={(open) => !open && setSelectedMember(null)}>
        {selectedMember && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="sr-only">{selectedMember.name}</DialogTitle>
            </DialogHeader>
            <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
              <div className="space-y-6">
                <div>
                  <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Team</p>
                  <h2 className="font-serif text-4xl text-foreground mt-2">{selectedMember.name}</h2>
                  <p className="text-primary text-sm font-semibold uppercase tracking-wide mt-1">{selectedMember.title}</p>
                  <p className="text-muted-foreground mt-3">{selectedMember.shortBio}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl text-foreground">Philosophy</h3>
                  <p className="text-muted-foreground">{selectedMember.longBio}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectedMember.focusAreas?.length ? (
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <p className="font-semibold text-foreground mb-2">Focus Areas</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedMember.focusAreas.map((f) => (
                          <li key={f}>• {f}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {selectedMember.credentials?.length ? (
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <p className="font-semibold text-foreground mb-2">Credentials & Awards</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedMember.credentials.map((c) => (
                          <li key={c}>• {c}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {selectedMember.education?.length ? (
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <p className="font-semibold text-foreground mb-2">Education</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedMember.education.map((edu) => (
                          <li key={edu}>• {edu}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {selectedMember.memberships?.length ? (
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <p className="font-semibold text-foreground mb-2">Memberships</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedMember.memberships.map((m) => (
                          <li key={m}>• {m}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
                {selectedMember.testimonials?.length ? (
                  <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                    <p className="font-semibold text-foreground">What clients say</p>
                    {selectedMember.testimonials.map((t, idx) => (
                      <blockquote key={idx} className="text-sm text-muted-foreground border-l-2 border-primary pl-3">
                        {t}
                      </blockquote>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="space-y-6">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted border border-border">
                  <img 
                    src={selectedMember.photo} 
                    alt={selectedMember.name} 
                    className="w-full h-full object-cover" 
                    loading="lazy" 
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <DialogClose asChild>
                    <Button variant="outline" className="w-full rounded-full border-primary text-primary">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </DialogClose>
                  <Button asChild className="w-full rounded-full">
                    <a href="/schedule">Schedule Consultation</a>
                  </Button>
                  <Button asChild variant="outline" className="w-full rounded-full border-primary text-primary">
                    <a href="/contact">Contact</a>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Section background="none" className="py-[30px]">
        <div className="rounded-3xl border border-border bg-primary/90 text-primary-foreground p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <p className="uppercase text-xs tracking-[0.16em] font-semibold">Next step</p>
              <h3 className="font-serif text-3xl">Ready for a calm, decisive plan?</h3>
              <p className="text-primary-foreground/80">
                Schedule a confidential consultation or begin the client intake process. Dallas and surrounding areas.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6 bg-primary-foreground text-primary">
                <a href="/schedule">Schedule Consultation</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6 border-primary-foreground text-primary-foreground">
                <Link href="/client-intake">Client Intake</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
