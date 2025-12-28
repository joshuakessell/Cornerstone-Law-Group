import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Lock, ExternalLink, FileText } from "lucide-react";
import { Link } from "wouter";
import { SEO } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/siteConfig";

export default function ClientPortal() {
  return (
    <>
      <SEO
        title="Client Portal"
        description="Access your secure client portal to view documents, communicate with your attorney, and manage your case. Sign in with Clio for Clients."
        path="/client-portal"
      />
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-muted/30 py-12">
        <Section className="text-center max-w-2xl mx-auto bg-card p-12 rounded-2xl shadow-xl border border-border">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-primary">Client Portal</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto">
            Use Clio for Clients for passwordless, secure access to documents, messages, and tasks. Sign in with the same email we use to contact you.
          </p>
          
          <div className="space-y-4 mb-8">
            <Button 
              asChild 
              size="lg" 
              className="w-full rounded-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              <a 
                href={SITE_CONFIG.portalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                Open Client Portal
                <ExternalLink className="w-5 h-5" />
              </a>
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Tip: use the invitation email or reset with the same email on file for a passwordless link.
            </p>
          </div>

          <div className="border-t border-border pt-8 mt-8">
            <h2 className="font-serif text-xl font-bold mb-4 text-foreground">New client?</h2>
            <p className="text-muted-foreground mb-6">
              Start with secure intake. We’ll send portal access after engagement.
            </p>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="rounded-full h-12 border-primary text-primary hover:bg-primary/10"
            >
              <Link href="/client-intake" className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Start Client Intake
              </Link>
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help accessing your portal?{" "}
              <Link href="/contact" className="text-primary hover:underline font-medium">
                Contact us
              </Link>
            </p>
          </div>
        </Section>
      </div>
    </>
  );
}

