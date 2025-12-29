import { Section } from "@/components/ui/section";
import { TEAM } from "@/lib/content";
import { SEO } from "@/lib/seo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";

export default function OurTeam() {
  return (
    <>
      <SEO
        title="Our Team"
        description="Meet the Cornerstone Law Group, P.C. team - strategic advocates with a calm, client-centered approach."
        path="/our-team"
      />
      <PageHero
        kicker="Team"
        title="Your legal + support team"
        subtitle="Clear bios, focused experience, and a steady presence when decisions feel heavy."
        ctaPrimary={{ label: "Schedule consultation", href: "/schedule" }}
        ctaSecondary={{ label: "Start intake", href: "/client-intake" }}
      />

      <Section background="muted" padded>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <Link key={member.slug} href={`/our-team/${member.slug}`}>
              <a className="group bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-primary/50 hover:-translate-y-1 transition-all">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <p className="font-serif text-xl text-foreground">{member.name}</p>
                  <p className="text-sm text-primary font-semibold">{member.title}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{member.shortBio}</p>
                <span className="text-primary text-sm font-semibold">View bio +</span>
              </a>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <Button asChild className="rounded-full px-6">
            <a href="/schedule">Schedule Consultation</a>
          </Button>
        </div>
      </Section>
    </>
  );
}
