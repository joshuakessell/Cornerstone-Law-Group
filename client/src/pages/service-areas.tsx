import { Section } from "@/components/ui/section";
import { SERVICE_AREAS } from "@/lib/content";
import { SEO } from "@/lib/seo";

export default function ServiceAreas() {
  return (
    <>
      <SEO
        title="Service Areas"
        description="Cornerstone Law Group, P.C. serves Dallas and surrounding communities."
        path="/service-areas"
      />
      <Section background="none" padded>
        <div className="max-w-3xl space-y-3">
          <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Service Areas</p>
          <h1 className="font-serif text-4xl text-foreground">Dallas & surrounding areas</h1>
          <p className="text-muted-foreground">
            We regularly serve clients across Dallas–Fort Worth. If you don’t see your city, reach out—we may still be able to help.
          </p>
        </div>
      </Section>

      <Section background="muted" padded>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
          {SERVICE_AREAS.map((city) => (
            <div key={city} className="p-4 bg-card border border-border rounded-lg text-foreground">
              {city}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

