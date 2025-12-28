import { Section } from "@/components/ui/section";
import { TEAM } from "@/lib/content";
import { SEO } from "@/lib/seo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function OurTeam() {
  return (
    <>
      <SEO
        title="Our Team"
        description="Meet the Cornerstone Law Group, P.C. team—strategic advocates with a calm, client-centered approach."
        path="/our-team"
      />
      <Section background="none" padded>
        <div className="max-w-3xl space-y-3">
          <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Team</p>
          <h1 className="font-serif text-4xl text-foreground">Your legal + support team</h1>
          <p className="text-muted-foreground">
            Clear cards, no overlapping shapes. Click through for bios, focus areas, and credentials.
          </p>
        </div>
      </Section>

      <Section background="muted" padded>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <Link key={member.slug} href={`/our-team/${member.slug}`}>
              <a className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-primary/50 transition-colors">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <p className="font-serif text-xl text-foreground">{member.name}</p>
                  <p className="text-sm text-primary font-semibold">{member.title}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{member.shortBio}</p>
                <span className="text-primary text-sm font-semibold">View bio →</span>
              </a>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <Button asChild className="rounded-full px-6" type="button">
            <Link href="/schedule">Schedule Consultation</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
