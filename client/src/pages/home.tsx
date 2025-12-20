import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ContactCTA } from "@/components/ui/contact-cta";
import { SERVICES, TESTIMONIALS } from "@/lib/content";
import { Link } from "wouter";
import { ArrowRight, Shield, Heart, Scale } from "lucide-react";
import heroImage from "@assets/generated_images/elegant_law_firm_office_interior_with_city_view.png";
import familyImage from "@assets/generated_images/happy_family_walking_in_a_park.png";
import consultationImage from "@assets/generated_images/professional_client_consultation_meeting.png";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Video with Overlay */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
            poster={heroImage}
          >
            <source src="https://cornerstonelawtexas.com/wp-content/uploads/2022/10/CSLG.mp4" type="video/mp4" />
          </video>
          {/* Side gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent"></div>
          {/* Bottom fade to dark background */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 pt-20">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-foreground">
              Family... <br/>
              <span className="text-primary italic">The Cornerstone</span> of Life.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Constructive legal solutions that protect your future. We redefine family law with clarity, strategy, and compassion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full text-lg px-8 h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all">
                <Link href="/contact">Schedule a Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full text-lg px-8 h-14 border-2 border-primary text-primary hover:bg-primary/10">
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <Section background="none" padded className="border-y border-border">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-xl shadow-lg border border-border hover:border-primary/30 transition-colors">
            <Shield className="w-10 h-10 text-primary mb-6" />
            <h3 className="text-xl font-serif font-bold mb-3 text-foreground">Protecting Assets</h3>
            <p className="text-muted-foreground leading-relaxed">
              Complex property division requires sophisticated analysis. We ensure your financial future is secure.
            </p>
          </div>
          <div className="bg-card p-8 rounded-xl shadow-lg border border-border hover:border-primary/30 transition-colors">
            <Heart className="w-10 h-10 text-primary mb-6" />
            <h3 className="text-xl font-serif font-bold mb-3 text-foreground">Child-Centered</h3>
            <p className="text-muted-foreground leading-relaxed">
              We prioritize the well-being of your children, crafting custody arrangements that foster stability.
            </p>
          </div>
          <div className="bg-card p-8 rounded-xl shadow-lg border border-border hover:border-primary/30 transition-colors">
            <Scale className="w-10 h-10 text-primary mb-6" />
            <h3 className="text-xl font-serif font-bold mb-3 text-foreground">Strategic Advocacy</h3>
            <p className="text-muted-foreground leading-relaxed">
              Whether in mediation or the courtroom, we provide the clear, strategic guidance you need.
            </p>
          </div>
        </div>
      </Section>

      {/* Alternating Content: Approach */}
      <Section padded background="none">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-primary/10 rounded-2xl transform -rotate-2"></div>
            <img 
              src={consultationImage} 
              alt="Consultation" 
              className="relative rounded-lg shadow-2xl w-full object-cover aspect-[4/3]"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">Our Approach</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground">We Do Things Differently</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At Cornerstone Law Group, we believe that divorce doesn't have to be a war. We focus on constructive resolutions that preserve your dignity and resources.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our team specializes in Collaborative Law and Mediation—processes designed to keep your family out of court whenever possible.
            </p>
            <Button asChild variant="link" className="text-primary font-bold text-lg p-0 hover:text-primary/80 transition-colors">
              <Link href="/our-approach" className="flex items-center gap-2">
                Learn about our approach <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Services Preview */}
      <Section background="muted" padded>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">Practice Areas</span>
          <h2 className="font-serif text-4xl font-bold mb-4 text-foreground">Comprehensive Family Law Services</h2>
          <p className="text-muted-foreground">
            Dedicated representation for every stage of your family's journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.slice(0, 6).map((service) => (
            <Link key={service.slug} href="/services">
              <a className="group bg-card p-8 rounded-xl shadow-lg border border-border hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 block h-full">
                <h3 className="font-serif text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {service.description}
                </p>
                <span className="text-sm font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-primary text-primary hover:bg-primary/10">
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </Section>

      {/* Alternating Content: Family/Trust */}
      <Section padded background="none">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">Why Choose Us</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground">A Future You Can Look Forward To</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              The end of a marriage marks the beginning of a new chapter. Our goal is to ensure that chapter starts on the strongest possible foundation.
            </p>
            <div className="space-y-6">
              {TESTIMONIALS.map((testimonial, idx) => (
                <blockquote key={idx} className="border-l-4 border-primary pl-4 italic text-muted-foreground bg-card p-4 rounded-r-lg">
                  "{testimonial.quote}"
                  <footer className="mt-2 text-sm font-bold text-primary not-italic">— {testimonial.author}</footer>
                </blockquote>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-primary/5 rounded-2xl transform rotate-2"></div>
             <img 
              src={familyImage} 
              alt="Happy Family" 
              className="relative rounded-lg shadow-2xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </Section>

      <ContactCTA />
    </div>
  );
}
