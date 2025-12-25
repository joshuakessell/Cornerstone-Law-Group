import { Section } from "@/components/ui/section";
import { ContactCTA } from "@/components/ui/contact-cta";
import { CheckCircle2, Users, Scale, HeartHandshake } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";

export default function OurApproach() {
  return (
    <>
      <div className="bg-primary text-white py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Our Approach</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
            We believe in resolving conflict, not escalating it. Our goal is to help you move forward with dignity and financial security.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 blur-3xl rounded-l-full transform translate-x-1/2"></div>
      </div>

      <Section padded>
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-primary text-center">Three Pillars of Representation</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Scale className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-foreground">Strategic Clarity</h3>
              <p className="text-foreground/80">We analyze the complex financial and legal aspects of your case to create a clear roadmap.</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm text-center">
               <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartHandshake className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-foreground">Constructive Solutions</h3>
              <p className="text-foreground/80">We prioritize negotiation and settlement to save you the stress and cost of litigation.</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm text-center">
               <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-foreground">Family Focused</h3>
              <p className="text-foreground/80">We never lose sight of the human element, especially when children are involved.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section background="muted" padded>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="absolute -inset-4 bg-white/50 rounded-2xl transform -rotate-2"></div>
             <img 
              src="/brand/Collaborative-Law-scaled.jpg" 
              alt="Collaborative Law Meeting" 
              className="relative rounded-lg shadow-xl w-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-primary">The Collaborative Difference</h2>
            <p className="text-lg text-foreground/90 mb-6 leading-relaxed">
              Traditional divorce litigation often destroys families. Collaborative Law is different. It is a private, voluntary process where you, your spouse, and your respective attorneys commit to reaching a settlement without going to court.
            </p>
            <ul className="space-y-4">
              {[
                "Maintains privacy and confidentiality",
                "Preserves co-parenting relationships",
                "Gives you control over the outcome, not a judge",
                "Often more cost-effective than litigation"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section padded background="none">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">What Our Clients Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={idx} className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-primary fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <blockquote className="text-foreground mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <footer className="text-sm font-semibold text-primary">
                  — {testimonial.author}
                </footer>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <ContactCTA />
    </>
  );
}
