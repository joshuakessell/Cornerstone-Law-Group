import { Section } from "@/components/ui/section";
import { SchedulerEmbed } from "@/components/site/SchedulerEmbed";
import { SEO } from "@/lib/seo";

export default function Schedule() {
  return (
    <>
      <SEO
        title="Schedule Consultation"
        description="Book a confidential consultation with Cornerstone Law Group, P.C. via our Clio scheduler."
        path="/schedule"
      />
      <Section background="none" padded>
        <div className="max-w-3xl space-y-3">
          <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Schedule</p>
          <h1 className="font-serif text-4xl text-foreground">Schedule a consultation</h1>
          <p className="text-muted-foreground">
            Secure, confidential scheduling. If the embed is blocked, use the open button.
          </p>
        </div>
      </Section>

      <Section background="muted" padded>
        <div className="max-w-4xl mx-auto">
          <SchedulerEmbed description="Select a time that works for you. We’ll confirm details and send secure intake links." />
        </div>
      </Section>
    </>
  );
}

