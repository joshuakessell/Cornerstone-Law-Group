import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Link } from "wouter";

export default function ClientArea() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-muted/30 py-6">
      <Section className="text-center max-w-lg mx-auto bg-white dark:bg-card/80 p-12 rounded-2xl shadow-xl border border-gray-100 dark:border-border/60">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="font-serif text-3xl font-bold mb-4 text-primary">Client Portal</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Our secure client portal is currently under maintenance. Please contact the office directly for any immediate needs or document transfers.
        </p>
        
        <div className="space-y-4">
          <Button asChild className="w-full rounded-full h-12 bg-accent hover:bg-accent/90 text-white shadow-lg">
             <Link href="/client-intake">Start New Client Intake Form</Link>
          </Button>
          <Button disabled variant="outline" className="w-full rounded-full h-12">
            Existing Client Portal (Coming Soon)
          </Button>
          <Button variant="ghost" asChild className="w-full rounded-full h-12">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </Section>
    </div>
  );
}
