import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type DemoBooking = {
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

const STORAGE_KEY = "cornerstone_demo_scheduler";

export default function DemoScheduler() {
  const timeSlots = useMemo(
    () => ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"],
    [],
  );

  const [recent, setRecent] = useState<DemoBooking[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<DemoBooking, "createdAt">>(() => ({
    date: new Date().toISOString().split("T")[0],
    time: timeSlots[0],
    name: "",
    email: "",
    phone: "",
  }));

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecent(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveBooking = (booking: DemoBooking) => {
    const next = [booking, ...recent].slice(0, 5);
    setRecent(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const booking: DemoBooking = { ...form, createdAt: new Date().toISOString() };
    saveBooking(booking);
    setMessage("Demo booking confirmed — no appointment was actually scheduled.");
  };

  return (
    <>
      <Section background="none" padded>
        <div className="max-w-4xl space-y-3">
          <p className="uppercase text-xs tracking-[0.16em] text-primary font-semibold">Demo</p>
          <h1 className="font-serif text-4xl text-foreground">Demo Scheduler</h1>
          <p className="text-muted-foreground max-w-2xl">
            This demo simulates booking without contacting Clio Scheduler. No data leaves your browser.
          </p>
        </div>
      </Section>

      <Section background="muted" padded>
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 max-w-5xl mx-auto">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Pick a time</CardTitle>
              <CardDescription>Select a date, choose a slot, and share basic contact details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, time: slot }))}
                          className={`px-3 py-2 text-sm rounded-lg border ${
                            form.time === slot
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/40 text-foreground"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
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
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="(214) 555-1234"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="rounded-full px-6">
                    Confirm demo booking
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Demo only — nothing is sent to Clio or any third party.
                  </p>
                  {message ? <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{message}</p> : null}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-dashed">
            <CardHeader>
              <CardTitle>Recent demo submissions</CardTitle>
              <CardDescription>Stored locally (last 5).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">No demo bookings yet.</p>
              ) : (
                <ul className="space-y-3">
                  {recent.map((item) => (
                    <li key={item.createdAt} className="p-3 rounded-lg border border-border bg-card">
                      <p className="font-medium text-foreground">
                        {item.date} at {item.time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.name} • {item.email} • {item.phone}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Saved locally at {new Date(item.createdAt).toLocaleString()}
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

