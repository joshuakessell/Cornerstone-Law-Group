import { type FormEvent, useEffect, useState } from "react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DemoPayment = {
  invoice: string;
  amount: string;
  createdAt: string;
};

const STORAGE_KEY = "cornerstone_demo_pay";

export default function DemoPay() {
  const [recent, setRecent] = useState<DemoPayment[]>([]);
  const [form, setForm] = useState<Omit<DemoPayment, "createdAt">>({ invoice: "", amount: "" });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRecent(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const savePayment = (payment: DemoPayment) => {
    const next = [payment, ...recent].slice(0, 10);
    setRecent(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payment: DemoPayment = { ...form, createdAt: new Date().toISOString() };
    savePayment(payment);
    setMessage("Demo payment flow completed — no payment was processed.");
  };

  return (
    <>
      <Section background="none" padded>
        <div className="max-w-4xl space-y-3">
          <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Demo</p>
          <h1 className="font-serif text-4xl text-foreground">Demo Pay Online</h1>
          <p className="text-muted-foreground">
            DEMO — No payment is processed. Use this preview instead of real LawPay links while demoing the site.
          </p>
        </div>
      </Section>

      <Section background="muted" padded>
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Mock invoice details</CardTitle>
              <CardDescription>No credit card details are collected.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="invoice">Invoice number</Label>
                  <Input
                    id="invoice"
                    value={form.invoice}
                    onChange={(e) => setForm((prev) => ({ ...prev, invoice: e.target.value }))}
                    placeholder="e.g., INV-1024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="250.00"
                    required
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="rounded-full px-6">
                    Continue (demo)
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Demo only — nothing is sent to LawPay or any payment processor.
                  </p>
                  {message ? (
                    <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      {message}
                    </p>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Recent demo payments</CardTitle>
              <CardDescription>Stored locally (last 10).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">No demo payments yet.</p>
              ) : (
                <ul className="space-y-3">
                  {recent.map((payment) => (
                    <li key={payment.createdAt} className="p-3 rounded-lg border border-border bg-card">
                      <p className="font-semibold text-foreground">Invoice {payment.invoice}</p>
                      <p className="text-sm text-muted-foreground">${payment.amount}</p>
                      <p className="text-xs text-muted-foreground">
                        Saved locally at {new Date(payment.createdAt).toLocaleString()}
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

