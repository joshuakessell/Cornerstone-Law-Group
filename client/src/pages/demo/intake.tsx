import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { PracticeSlug } from "@/lib/integrations";

const practices: { slug: PracticeSlug; label: string }[] = [
  { slug: "divorce", label: "Divorce" },
  { slug: "child-custody-parenting-plans", label: "Child Custody & Parenting Plans" },
  { slug: "mediation", label: "Mediation" },
  { slug: "collaborative-law", label: "Collaborative Law" },
  { slug: "modification-enforcement", label: "Modification / Enforcement" },
  { slug: "prenuptial-marital-agreements", label: "Prenuptial / Marital Agreements" },
  { slug: "adoption", label: "Adoption" },
  { slug: "wills-trusts-estates", label: "Wills, Trusts & Estates" },
  { slug: "general", label: "General Intake" },
];

export default function DemoIntakeLanding() {
  return (
    <>
      <Section background="none" padded>
        <div className="max-w-4xl space-y-3">
          <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Demo</p>
          <h1 className="font-serif text-4xl text-foreground">Demo Intake</h1>
          <p className="text-muted-foreground max-w-3xl">
            Production intake links route to Clio Grow. These demo flows stay on-site so you can preview the journey without
            sending data anywhere.
          </p>
        </div>
      </Section>

      <Section background="muted" padded>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {practices.map((practice) => (
            <Link key={practice.slug} href={`/demo/intake/${practice.slug}`}>
              <a className="group p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:-translate-y-1 transition-all flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{practice.label}</p>
                  <p className="text-xs text-muted-foreground">Demo only — no sensitive info.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

