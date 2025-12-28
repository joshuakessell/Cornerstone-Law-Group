import { useRoute } from "wouter";
import { SERVICES } from "@/lib/content/services";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { SEO } from "@/lib/seo";
import NotFound from "./not-found";

export default function ServiceDetail() {
  const [, params] = useRoute<{ slug: string }>("/services/:slug");
  const service = SERVICES.find((s) => s.slug === params?.slug);

  if (!service) return <NotFound />;

  return (
    <>
      <SEO title={service.seo.title} description={service.seo.description} path={`/services/${service.slug}`} />
      <Section background="none" padded>
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Services</p>
            <h1 className="font-serif text-4xl text-foreground">{service.title}</h1>
            <p className="text-muted-foreground text-lg">{service.heroCopy}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {service.howWeHelp.map((item) => (
                <div key={item} className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h3 className="font-serif text-2xl text-foreground">What to expect</h3>
              <div className="space-y-4">
                {service.whatToExpect.map((step, idx) => (
                  <div key={step.title} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Accordion type="single" collapsible>
              {service.faq.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
              <h3 className="font-serif text-2xl text-foreground mb-3">Next steps</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {service.bullets.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
              <div className="mt-4 space-y-3">
                <Button asChild className="w-full rounded-full">
                  <a href="/schedule">Schedule Consultation</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full border-primary text-primary"
                >
                  <a href={SITE_CONFIG.intakeUrls[service.intakeKey]} target="_blank" rel="noreferrer">
                    Start Secure Intake
                  </a>
                </Button>
                <Button asChild variant="ghost" className="w-full rounded-full">
                  <a href="/contact">Talk with our team</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

