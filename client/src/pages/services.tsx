import { Section } from "@/components/ui/section";
import { ContactCTA } from "@/components/ui/contact-cta";
import { SERVICES } from "@/lib/content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Services() {
  return (
    <>
      <div className="bg-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
            Comprehensive legal support for all aspects of family law. We guide you through the complexities with clarity and purpose.
          </p>
        </div>
      </div>

      <Section padded>
        <div className="max-w-4xl mx-auto space-y-24">
          {SERVICES.map((service, index) => (
            <div key={service.slug} id={service.slug} className="scroll-mt-32 border-b border-border pb-16 last:border-0">
              <span className="text-accent font-bold text-sm mb-2 block">0{index + 1}</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-primary">{service.title}</h2>
              <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-8">
                {service.description}
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details" className="border-0">
                  <AccordionTrigger className="text-primary font-bold hover:text-accent hover:no-underline text-lg justify-start gap-3">
                    Learn more about {service.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/90 leading-relaxed text-base pt-4">
                    <p className="mb-4">
                      At Cornerstone Law Group, our approach to {service.title.toLowerCase()} is rooted in strategic preparation and compassionate understanding. We know that every family is unique, and we tailor our representation to meet your specific goals.
                    </p>
                    <p>
                      Whether through negotiation, mediation, or litigation when necessary, we are committed to protecting your rights and securing a stable future for you and your loved ones.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </Section>

      <ContactCTA />
    </>
  );
}
