import { Section } from "@/components/ui/section";
import { FAQ_ITEMS } from "@/lib/content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEO } from "@/lib/seo";

export default function FAQ() {
  return (
    <>
      <SEO
        title="Family Law FAQ"
        description="Common questions about working with Cornerstone Law Group, P.C. and family law in Texas."
        path="/resources/faq"
      />
      <Section background="none" padded>
        <div className="max-w-3xl space-y-3">
          <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">FAQ</p>
          <h1 className="font-serif text-4xl text-foreground">Answers you can trust</h1>
          <p className="text-muted-foreground">
            Brief, consistent answers—no fluff—covering process, collaboration, and service areas.
          </p>
        </div>
      </Section>

      <Section background="muted" padded>
        <div className="max-w-3xl">
          <Accordion type="single" collapsible>
            {FAQ_ITEMS.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>
    </>
  );
}

