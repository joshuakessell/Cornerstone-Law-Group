import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { ArrowRight, ArrowLeft, Download, FileText } from "lucide-react";

type MatterType = 
  | "divorce"
  | "modification"
  | "enforcement"
  | "adoption"
  | "mediation"
  | "marital-agreement"
  | "prenuptial-agreement"
  | "wills-trusts-estates"
  | "not-sure"
  | null;

export default function ClientIntake() {
  const [matterType, setMatterType] = useState<MatterType>(null);

  const matterOptions = [
    { id: "divorce" as MatterType, label: "Divorce", description: "Dissolution of marriage" },
    { id: "modification" as MatterType, label: "Modification", description: "Modify existing orders" },
    { id: "enforcement" as MatterType, label: "Enforcement", description: "Enforce court orders" },
    { id: "adoption" as MatterType, label: "Adoption", description: "Adoption proceedings" },
    { id: "mediation" as MatterType, label: "Mediation", description: "Mediation services" },
    { id: "marital-agreement" as MatterType, label: "Marital Agreement", description: "Postnuptial agreements" },
    { id: "prenuptial-agreement" as MatterType, label: "Prenuptial Agreement", description: "Prenuptial agreements" },
    { id: "wills-trusts-estates" as MatterType, label: "Wills/Trusts/Estates", description: "Estate planning" },
    { id: "not-sure" as MatterType, label: "Not sure", description: "I'm not sure what I need" },
  ];

  const handleMatterSelect = (type: MatterType) => {
    setMatterType(type);
  };

  const getContinuePath = () => {
    if (matterType === "divorce") return "/intake/divorce";
    return null;
  };

  const hasContinueForm = getContinuePath() !== null;

  // Map matter types to their corresponding docx file names
  const getDocxFileName = (matterType: MatterType): string | null => {
    if (!matterType || matterType === "not-sure") return null;
    
    const docxMap: Record<string, string> = {
      "divorce": "Intake - Divorce.docx",
      "modification": "Intake - Modification.docx",
      "enforcement": "Intake - Enforcement.docx",
      "adoption": "Intake - Adoption.docx",
      "mediation": "Intake - Mediation.docx",
      "marital-agreement": "Intake - Marital Agreement.docx",
      "prenuptial-agreement": "Intake - Prenuptual Agreement.docx",
      "wills-trusts-estates": "Intake - Wills Trusts & Estates.docx",
    };
    
    return docxMap[matterType] || null;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Section className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
            Client Intake
          </h1>
          <p className="text-muted-foreground">
            Let's get started. We'll guide you through the intake process.
          </p>
        </div>

        {!matterType && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">What do you need help with?</CardTitle>
              <CardDescription>
                Select the type of legal matter you need assistance with.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {matterOptions.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleMatterSelect(option.id)}
                  className="w-full justify-start h-auto py-4"
                  variant="outline"
                >
                  <div className="text-left">
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {option.description}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {matterType && (
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMatterType(null)}
                  className="shrink-0"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <CardTitle className="font-serif text-2xl">Let's Get Started</CardTitle>
                  <CardDescription>
                    We'll start with a basic intake form, then you can continue to a more detailed form
                    if needed.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">
                  All new clients start with our basic intake form. This collects essential
                  information about you and your matter.
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/intake/basic">
                      Start Basic Information
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <a
                    href="/documents/Intake Basic Information.docx"
                    download
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors border border-border rounded-md hover:bg-muted/50"
                  >
                    <Download className="w-4 h-4" />
                    <FileText className="w-4 h-4" />
                    Download Basic Intake Form (DOCX)
                  </a>
                </div>
              </div>

              {hasContinueForm && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    After completing the basic intake, you can continue with our detailed{" "}
                    {matterOptions.find((o) => o.id === matterType)?.label.toLowerCase()} intake form
                    for more comprehensive information.
                  </p>
                  <div className="space-y-3">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <Link href={getContinuePath()!}>
                        Continue to {matterOptions.find((o) => o.id === matterType)?.label} Intake
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    {getDocxFileName(matterType) && (
                      <a
                        href={`/documents/${getDocxFileName(matterType)}`}
                        download
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors border border-border rounded-md hover:bg-muted/50"
                      >
                        <Download className="w-4 h-4" />
                        <FileText className="w-4 h-4" />
                        Download {matterOptions.find((o) => o.id === matterType)?.label} Intake Form (DOCX)
                      </a>
                    )}
                  </div>
                </div>
              )}

              {!hasContinueForm && matterType !== "not-sure" && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    A detailed intake form for {matterOptions.find((o) => o.id === matterType)?.label.toLowerCase()} is coming next.
                    For now, please complete the basic intake form above.
                  </p>
                  {getDocxFileName(matterType) && (
                    <a
                      href={`/documents/${getDocxFileName(matterType)}`}
                      download
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors border border-border rounded-md hover:bg-muted/50"
                    >
                      <Download className="w-4 h-4" />
                      <FileText className="w-4 h-4" />
                      Download {matterOptions.find((o) => o.id === matterType)?.label} Intake Form (DOCX)
                    </a>
                  )}
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Need to speak with someone directly?
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </Section>
    </div>
  );
}
