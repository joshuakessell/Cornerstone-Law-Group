import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ExternalLink, Lock } from "lucide-react";
import { Link } from "wouter";
import { SEO } from "@/lib/seo";
import { integrationsConfig, isRelativeUrl } from "@/lib/integrations";
import { PageHero } from "@/components/site/PageHero";

export default function ClientPortal() {
  const portalUrl = integrationsConfig.clientPortalUrl;
  const isExternal = !isRelativeUrl(portalUrl);

  return (
    <>
      <SEO
        title="Client Portal"
        description="Access your secure client portal to view documents, communicate with your attorney, and manage your case."
        path="/client-portal"
      />
      <PageHero
        kicker="Client Portal"
        title="Secure access, simple next steps"
        subtitle="Use Clio for Clients to view documents, send messages, and stay aligned on your case timeline."
        ctaPrimary={{
          label: "Open Clio Client Portal",
          href: portalUrl,
          external: isExternal,
        }}
        ctaSecondary={{ label: "Need help?", href: "/contact" }}
      />

      <Section background="muted" padded>
        <div className="max-w-2xl space-y-6">
          <div className="rounded-2xl border border-border bg-card/95 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-serif text-2xl text-foreground">Open your portal</h2>
            </div>
            <p className="text-muted-foreground">
              Your portal keeps everything in one place: tasks, messages, and shared documents with your legal team.
            </p>
            <div className="mt-6">
              <Button asChild size="lg" className="rounded-full">
                {isExternal ? (
                  <a href={portalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                    Open Clio Client Portal
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link href={portalUrl} className="inline-flex items-center gap-2">
                    Open Clio Client Portal
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/80 p-6">
            <h3 className="font-semibold text-foreground mb-2">How to access</h3>
            <p className="text-sm text-muted-foreground">
              You will receive an invitation email from the firm. Sign in using the same email address we have on file to
              access your portal.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Need help?{" "}
              <Link href="/contact" className="text-primary font-semibold hover:underline">
                Contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

