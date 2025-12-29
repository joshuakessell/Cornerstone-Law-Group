import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SEO } from "@/lib/seo";
import { integrationsConfig, isRelativeUrl } from "@/lib/integrations";
import { Link } from "wouter";

export default function PayOnline() {
  const lawPayUrl = integrationsConfig.lawpayUrl;
  const isRelative = lawPayUrl ? isRelativeUrl(lawPayUrl) : false;

  return (
    <>
      <SEO
        title="Pay Online"
        description="Secure LawPay link for Cornerstone Law Group, P.C. Make trust or invoice payments online."
        path="/pay-online"
      />
      <Section background="none" padded>
        <div className="max-w-3xl space-y-6">
          <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Payments</p>
          <h1 className="font-serif text-4xl text-foreground">Pay online securely</h1>
          <p className="text-muted-foreground">
            We use LawPay for secure payments. No duplicate payment buttons appear elsewhere to avoid confusion.
          </p>
          <div className="space-y-3">
            {lawPayUrl ? (
              <Button asChild size="lg" className="rounded-full px-8">
                {isRelative ? (
                  <Link href={lawPayUrl}>Open LawPay</Link>
                ) : (
                  <a href={lawPayUrl} target="_blank" rel="noreferrer">
                    Open LawPay
                  </a>
                )}
              </Button>
            ) : (
              <div className="p-4 border border-border rounded-lg bg-muted/40 text-sm text-muted-foreground">
                Online payments are not available right now. Please call our office and we’ll process your payment securely.
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Need help? Call us at <a className="underline" href="tel:2142149500">(214) 214-9500</a>.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}


