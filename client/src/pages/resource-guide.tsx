import { useRoute, Link } from "wouter";
import { GUIDES } from "@/lib/content/resources";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEO } from "@/lib/seo";

export default function ResourceGuide() {
  const [, params] = useRoute<{ slug: string }>("/resources/:slug");
  const guide = GUIDES.find((g) => g.slug === params?.slug);

  if (!guide) return <div className="p-10">Guide not found.</div>;

  return (
    <>
      <SEO title={guide.title} description={guide.intro} path={`/resources/${guide.slug}`} />
      <Section background="none" padded>
        <div className="max-w-3xl space-y-4">
          <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Guide</p>
          <h1 className="font-serif text-4xl text-foreground">{guide.title}</h1>
          <p className="text-muted-foreground">{guide.hero}</p>
          <div className="flex gap-3">
            <Button asChild className="rounded-full px-6" type="button">
              <Link href="/schedule">Schedule Consultation</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6 border-primary text-primary">
              <Link href="/resources">Back to resources</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section background="muted" padded>
        <div className="max-w-4xl space-y-6">
          <h2 className="font-serif text-2xl text-foreground">Table of contents</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            {guide.toc.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>

        <Section background="none" padded>
          <div className="max-w-4xl space-y-6">
            {guide.body.map((paragraph, idx) => (
              <p key={idx} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </Section>

      <Section background="muted" padded>
        <div className="max-w-4xl space-y-4">
          <h3 className="font-serif text-2xl text-foreground">FAQs</h3>
          <Accordion type="single" collapsible>
            {guide.faq.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <Section background="primary" padded>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="uppercase text-xs tracking-[0.16em] font-semibold">Next Step</p>
            <h3 className="font-serif text-3xl text-primary-foreground">Talk with our team</h3>
            <p className="text-primary-foreground/80 mt-2">Calm, confidential consultations for Dallas families.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg" className="rounded-full px-6 bg-primary-foreground text-primary" type="button">
              <Link href="/schedule">Schedule Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6 border-primary-foreground text-primary-foreground">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

