import { type FormEvent, useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PracticeSlug } from "@/lib/integrations";

const STORAGE_KEY = "cornerstone_demo_intake";

const LABELS: Record<PracticeSlug, string> = {
  divorce: "Divorce",
  "child-custody-parenting-plans": "Child Custody & Parenting Plans",
  "modification-enforcement": "Modification / Enforcement",
  mediation: "Mediation",
  "collaborative-law": "Collaborative Law",
  "prenuptial-marital-agreements": "Prenuptial / Marital Agreements",
  adoption: "Adoption",
  "wills-trusts-estates": "Wills, Trusts & Estates",
  general: "General Intake",
};

type DemoIntakeEntry = {
  practice: PracticeSlug;
  name: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
};

export default function DemoIntakePractice() {
  const [, params] = useRoute<{ practice: string }>("/demo/intake/:practice");
  const practice = (params?.practice ?? "") as PracticeSlug;
  const isValidPractice = practice in LABELS;

  const [recent, setRecent] = useState<DemoIntakeEntry[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<Omit<DemoIntakeEntry, "createdAt">>({
    practice: isValidPractice ? practice : "general",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      practice: isValidPractice ? practice : "general",
    }));
  }, [practice, isValidPractice]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRecent(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const saveEntry = (entry: DemoIntakeEntry) => {
    const next = [entry, ...recent].slice(0, 10);
    setRecent(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entry: DemoIntakeEntry = { ...form, createdAt: new Date().toISOString() };
    saveEntry(entry);
    setSubmitted(true);
  };

  if (!isValidPractice) {
    return (
      <Section padded background="none">
        <div className="space-y-4 max-w-xl">
          <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Demo</p>
          <h1 className="font-serif text-3xl text-foreground">Practice not found</h1>
          <p className="text-muted-foreground">
            Choose a practice area to continue the demo intake flow.
          </p>
          <Button asChild className="rounded-full px-6">
            <Link href="/demo/intake">Back to demo intake</Link>
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Section background="none" padded>
        <div className="max-w-4xl space-y-3">
          <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Demo</p>
          <h1 className="font-serif text-4xl text-foreground">{LABELS[practice]}</h1>
          <p className="text-muted-foreground max-w-3xl">
            Demo intake only — do not share sensitive information. This stays in your browser for preview purposes.
          </p>
        </div>
      </Section>

      <Section background="muted" padded>
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Demo Intake Form</CardTitle>
              <CardDescription>Lightweight fields to preview the flow.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">How can we help?</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Share a short, safe description. No sensitive details."
                    rows={4}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="rounded-full px-6">
                    Submit demo intake
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Demo only — no data is transmitted to Clio Grow or any third party.
                  </p>
                  {submitted ? (
                    <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      Demo intake saved locally. No information was sent externally.
                    </p>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Recent demo entries</CardTitle>
              <CardDescription>Stored locally (last 10).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">No demo entries yet.</p>
              ) : (
                <ul className="space-y-3">
                  {recent.map((entry) => (
                    <li key={entry.createdAt} className="p-3 rounded-lg border border-border bg-card">
                      <p className="font-semibold text-foreground">{LABELS[entry.practice]}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.name} • {entry.email} • {entry.phone}
                      </p>
                      {entry.notes ? <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{entry.notes}</p> : null}
                      <p className="text-xs text-muted-foreground">
                        Saved locally at {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}

