import { useRoute, Link } from "wouter";
import { TEAM } from "@/lib/content";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SEO } from "@/lib/seo";
import NotFound from "./not-found";

export default function TeamMember() {
  const [, params] = useRoute<{ slug: string }>("/our-team/:slug");
  const member = TEAM.find((m) => m.slug === params?.slug);

  if (!member) return <NotFound />;

  return (
    <>
      <SEO
        title={`${member.name} | Team`}
        description={member.shortBio}
        path={`/our-team/${member.slug}`}
      />
      <Section background="none" padded>
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Team</p>
            <h1 className="font-serif text-4xl text-foreground">{member.name}</h1>
            <p className="text-primary text-sm font-semibold uppercase tracking-wide">{member.title}</p>
            <p className="text-muted-foreground">{member.shortBio}</p>
            <div className="space-y-3">
              <h3 className="font-serif text-2xl text-foreground">Philosophy</h3>
              <p className="text-muted-foreground">{member.longBio}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {member.focusAreas?.length ? (
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="font-semibold text-foreground mb-2">Focus Areas</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {member.focusAreas.map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {member.credentials?.length ? (
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="font-semibold text-foreground mb-2">Credentials & Awards</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {member.credentials.map((c) => (
                      <li key={c}>• {c}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
          <div className="space-y-6">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted border border-border">
              <img src={member.photo} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            {member.education?.length ? (
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="font-semibold text-foreground mb-2">Education</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {member.education.map((edu) => (
                    <li key={edu}>• {edu}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {member.memberships?.length ? (
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="font-semibold text-foreground mb-2">Memberships</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {member.memberships.map((m) => (
                    <li key={m}>• {m}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {member.testimonials?.length ? (
              <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                <p className="font-semibold text-foreground">What clients say</p>
                {member.testimonials.map((t, idx) => (
                  <blockquote key={idx} className="text-sm text-muted-foreground border-l-2 border-primary pl-3">
                    {t}
                  </blockquote>
                ))}
              </div>
            ) : null}
            <div className="space-y-3">
              <Button asChild className="w-full rounded-full" type="button">
                <Link href="/schedule">Schedule Consultation</Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-full border-primary text-primary">
                <a href="/contact">Contact</a>
              </Button>
              <Button asChild variant="ghost" className="w-full rounded-full">
                <Link href="/our-team">Back to team</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

