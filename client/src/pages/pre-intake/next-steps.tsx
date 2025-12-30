import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { CheckCircle, ExternalLink } from "lucide-react";
import { integrationsConfig, isRelativeUrl } from "@/lib/integrations";
import { Link } from "wouter";

const serviceLabels: Record<string, string> = {
  divorce: "Divorce",
  modification: "Modification",
  enforcement: "Enforcement",
  adoption: "Adoption",
  mediation: "Mediation",
  "marital-agreement": "Marital Agreement",
  "prenuptial-agreement": "Prenuptial Agreement",
  "wills-trusts-estates": "Wills/Trusts/Estates",
};

export default function NextSteps() {
  const [location, setLocation] = useLocation();
  const searchParams = location.includes("?") ? location.split("?")[1] : "";
  const params = new URLSearchParams(searchParams);
  const serviceType = params.get("service") || "";
  const serviceLabel = serviceLabels[serviceType] || "Client Intake";

  const portalUrl = integrationsConfig.clientPortalUrl;
  const isExternal = !isRelativeUrl(portalUrl);

  const handleContinueToPortal = () => {
    if (isExternal) {
      window.open(portalUrl, "_blank", "noopener,noreferrer");
    } else {
      setLocation(portalUrl);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Section className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-serif text-3xl">Thank You!</CardTitle>
          <CardDescription className="text-base mt-2">
              We've received your information for {serviceLabel}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Next, you'll be prompted to create a secure client account in Clio for Clients. 
                This secure portal allows you to:
              </p>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>Complete your intake forms securely online</li>
                <li>Communicate with your legal team</li>
                <li>Access and share documents</li>
                <li>Track your case progress</li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={handleContinueToPortal}
                size="lg"
                className="w-full"
              >
                Continue to Secure Portal
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Need help?{" "}
                <Link href="/contact" className="text-primary font-semibold hover:underline">
                  Contact us
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}

