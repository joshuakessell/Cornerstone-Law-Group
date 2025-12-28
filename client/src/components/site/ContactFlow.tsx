import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { getGrowIntakeUrl, integrationsConfig, isRelativeUrl } from "@/lib/integrations";

type ServiceKey =
  | "divorce"
  | "modification-enforcement"
  | "mediation"
  | "prenuptial-marital-agreements"
  | "wills-trusts-estates"
  | "adoption"
  | "other";

const intakeSlugMap: Record<ServiceKey, "divorce" | "modification-enforcement" | "mediation" | "prenuptial-marital-agreements" | "wills-trusts-estates" | "adoption" | "general"> = {
  divorce: "divorce",
  "modification-enforcement": "modification-enforcement",
  mediation: "mediation",
  "prenuptial-marital-agreements": "prenuptial-marital-agreements",
  "wills-trusts-estates": "wills-trusts-estates",
  adoption: "adoption",
  other: "general",
};

type BranchState = {
  general: {
    name: string;
    email: string;
    phone: string;
  };
  details: Record<string, string>;
};

const branches: Record<ServiceKey, { questions: { id: string; label: string; type: "text" | "textarea" }[] }> = {
  divorce: {
    questions: [
      { id: "casePending", label: "Is there an active case pending? (yes/no)", type: "text" },
      { id: "causeNumber", label: "Cause number (if pending)", type: "text" },
      { id: "children", label: "Are children involved? (yes/no)", type: "text" },
      { id: "collaborative", label: "Interested in collaborative divorce? (yes/no)", type: "text" },
    ],
  },
  "modification-enforcement": {
    questions: [
      { id: "causeNumber", label: "Existing cause number", type: "text" },
      { id: "county", label: "County filed in", type: "text" },
    ],
  },
  mediation: {
    questions: [
      { id: "opposingCounsel", label: "Opposing counsel (if any)", type: "text" },
      { id: "timeline", label: "Preferred mediation timeline", type: "text" },
    ],
  },
  "prenuptial-marital-agreements": {
    questions: [
      { id: "planningToMarry", label: "Planning to get married? (yes/no)", type: "text" },
      { id: "weddingDate", label: "Wedding date (if set)", type: "text" },
      { id: "alreadyMarried", label: "Already married and need a property agreement? (yes/no)", type: "text" },
    ],
  },
  "wills-trusts-estates": {
    questions: [
      { id: "hasPlan", label: "Do you have an existing plan? (yes/no)", type: "text" },
      { id: "priority", label: "Top priority (guardianship, healthcare, property)", type: "text" },
    ],
  },
  adoption: {
    questions: [
      { id: "type", label: "Adoption type (stepparent, relative, agency, private)", type: "text" },
      { id: "consents", label: "Do you have required consents? (yes/no/unsure)", type: "text" },
    ],
  },
  other: {
    questions: [{ id: "notes", label: "How can we help?", type: "textarea" }],
  },
};

export function ContactFlow() {
  const [service, setService] = useState<ServiceKey>("divorce");
  const [state, setState] = useState<BranchState>({
    general: { name: "", email: "", phone: "" },
    details: {},
  });

  const intakeLink = useMemo(() => {
    return getGrowIntakeUrl(intakeSlugMap[service]);
  }, [service]);

  const schedulerUrl = integrationsConfig.schedulerUrl ?? (integrationsConfig.demoActive ? "/demo/scheduler" : null);

  const updateDetail = (id: string, value: string) => {
    setState((prev) => ({
      ...prev,
      details: { ...prev.details, [id]: value },
    }));
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="space-y-3">
          <Label htmlFor="service">I would like to find out more about</Label>
          <Select value={service} onValueChange={(v) => setService(v as ServiceKey)}>
            <SelectTrigger id="service">
              <SelectValue placeholder="Choose a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="divorce">Divorce</SelectItem>
              <SelectItem value="modification-enforcement">Modification / Enforcement</SelectItem>
              <SelectItem value="mediation">Mediation</SelectItem>
              <SelectItem value="prenuptial-marital-agreements">Premarital / Marital Agreements</SelectItem>
              <SelectItem value="wills-trusts-estates">Wills / Trusts / Estates</SelectItem>
              <SelectItem value="adoption">Adoption</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={state.general.name}
                onChange={(e) => setState((prev) => ({ ...prev, general: { ...prev.general, name: e.target.value } }))}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={state.general.email}
                onChange={(e) => setState((prev) => ({ ...prev, general: { ...prev.general, email: e.target.value } }))}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={state.general.phone}
                onChange={(e) => setState((prev) => ({ ...prev, general: { ...prev.general, phone: e.target.value } }))}
                placeholder="(214) 555-0000"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            We keep this lightweight—no sensitive personal information. Answer only what you’re comfortable sharing.
          </p>
          <div className="grid gap-3">
            {branches[service].questions.map((q) => (
              <div key={q.id} className="space-y-1.5">
                <Label htmlFor={q.id}>{q.label}</Label>
                {q.type === "text" ? (
                  <Input
                    id={q.id}
                    value={state.details[q.id] || ""}
                    onChange={(e) => updateDetail(q.id, e.target.value)}
                  />
                ) : (
                  <Textarea
                    id={q.id}
                    value={state.details[q.id] || ""}
                    onChange={(e) => updateDetail(q.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Button asChild size="lg" className="rounded-full px-8">
          {schedulerUrl ? (
            isRelativeUrl(schedulerUrl) ? (
              <Link href={schedulerUrl}>Schedule Consultation</Link>
            ) : (
              <a href={schedulerUrl} target="_blank" rel="noreferrer">
                Schedule Consultation
              </a>
            )
          ) : (
            <Link href="/contact">Contact Us</Link>
          )}
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-primary text-primary">
          {intakeLink ? (
            isRelativeUrl(intakeLink) ? (
              <Link href={intakeLink}>Start Secure Intake</Link>
            ) : (
              <a href={intakeLink} target="_blank" rel="noreferrer">
                Start Secure Intake
              </a>
            )
          ) : (
            <Link href="/contact">Contact us</Link>
          )}
        </Button>
        <Button asChild variant="ghost" size="lg" className="rounded-full px-8">
          <a href="tel:2142149500">Call (214) 214-9500</a>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground max-w-3xl">
        Submitting information does not create an attorney–client relationship. Please avoid sharing sensitive personal
        data here. We will follow up to confirm next steps and provide secure channels for any documents.
      </p>
    </div>
  );
}

