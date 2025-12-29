import { Section } from "@/components/ui/section";
import { SERVICES } from "@/lib/content";
import { Link } from "wouter";
import { SEO } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import { getGrowIntakeUrl, isRelativeUrl } from "@/lib/integrations";
import { PageHero } from "@/components/site/PageHero";

export default function Services() {
  const generalIntakeUrl = getGrowIntakeUrl("general");
  const intakeCta = generalIntakeUrl
    ? {
        label: "Start secure intake",
        href: generalIntakeUrl,
        external: !isRelativeUrl(generalIntakeUrl),
      }
    : { label: "Contact us", href: "/contact" };

  return (
    <>
      <SEO
        title="Family Law Services in Dallas"
        description="Divorce, custody, mediation, collaborative law, and estate planning for Dallas families."
        path="/services"
      />
      <PageHero
        kicker="Services"
        title="Family law, modernized"
        subtitle="Eight practice areas designed to reduce conflict, protect assets, and prioritize children. Each page below shares how we help, what to expect, FAQs, and next steps."
        ctaPrimary={{ label: "Schedule consultation", href: "/schedule" }}
        ctaSecondary={intakeCta}
      >
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="px-3 py-2 rounded-full border border-border">Collaborative + mediation first</span>
          <span className="px-3 py-2 rounded-full border border-border">Trial-ready when needed</span>
          <span className="px-3 py-2 rounded-full border border-border">Clear next steps</span>
        </div>
      </PageHero>

      <Section background="muted" padded>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`}>
              <a className="group bg-card border border-border rounded-xl p-5 h-full flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all">
                <div className="space-y-3">
                  <h2 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-4 break-words">{service.shortDescription}</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {service.howWeHelp.slice(0, 3).map((item) => (
                      <li key={item} className="break-words">- {item}</li>
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
