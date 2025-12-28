import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/content";
import { Link } from "wouter";
import { SEO } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import { getGrowIntakeUrl, isRelativeUrl } from "@/lib/integrations";

export default function Services() {
  const generalIntakeUrl = getGrowIntakeUrl("general");

  return (
    <>
      <SEO
        title="Family Law Services in Dallas"
        description="Divorce, custody, mediation, collaborative law, and estate planning for Dallas families."
        path="/services"
      />
      <Section background="none" padded>
        <div className="space-y-4 max-w-3xl">
          <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Services</p>
          <h1 className="font-serif text-4xl text-foreground">Family law, modernized</h1>
          <p className="text-muted-foreground">
            Eight practice areas designed to reduce conflict, protect assets, and prioritize children. Each page below
            shares how we help, what to expect, FAQs, and next steps.
          </p>
          <div className="flex gap-3">
            <Button asChild className="rounded-full px-6">
              <a href="/schedule">Schedule Consultation</a>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6 border-primary text-primary">
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

      <Section background="muted" padded>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`}>
              <a className="group bg-card border border-border rounded-xl p-5 h-full flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all">
                <div className="space-y-3">
                  <h2 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-4">{service.shortDescription}</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {service.howWeHelp.slice(0, 3).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-semibold">
                  View details <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
