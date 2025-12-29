import { Section } from "@/components/ui/section";
import { GUIDES } from "@/lib/content/resources";
import { FAQ_ITEMS } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SEO } from "@/lib/seo";
import { ArrowRight, BookOpen } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

export default function Resources() {
  return (
    <>
      <SEO
        title="Resources"
        description="Practical family law guides for Dallas families. Divorce, custody, modifications, and FAQs."
        path="/resources"
      />
      <PageHero
        kicker="Resources"
        title="Guides & answers"
        subtitle="Calm, practical guides that focus on decisions and next steps. Each guide includes FAQs and clear ways to connect."
        ctaPrimary={{ label: "Schedule consultation", href: "/schedule" }}
        ctaSecondary={{ label: "View FAQ", href: "/resources/faq" }}
      />

      <Section background="muted" padded>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES.map((guide) => (
            <Link key={guide.slug} href={`/resources/${guide.slug}`}>
              <a className="group bg-card border border-border rounded-xl p-5 h-full flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-primary font-semibold">
                    <BookOpen className="w-4 h-4" /> Guide
                  </div>
                  <h2 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">
                    {guide.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">{guide.hero}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-semibold">
                  Read guide <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </Link>
          ))}
        </div>
      </Section>

      <Section background="none" padded>
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl text-foreground">FAQ</h2>
          </div>
          <p className="text-muted-foreground">
            Straight answers to common questions about working with us and family law in Texas.
          </p>
          <Button asChild variant="outline" className="rounded-full border-primary text-primary">
            <Link href="/resources/faq">Read FAQ</Link>
          </Button>
          <div className="grid sm:grid-cols-2 gap-4">
            {FAQ_ITEMS.slice(0, 4).map((faq) => (
              <div key={faq.question} className="p-4 bg-card border border-border rounded-xl">
                <p className="font-semibold text-foreground">{faq.question}</p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

