import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Phone, Calendar } from "lucide-react";
import { COMPANY_INFO } from "@/lib/content";

export function ContactCTA() {
  return (
    <section className="bg-primary text-white py-20 relative overflow-hidden">
      {/* Abstract Background shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Ready to protect what matters most?
        </h2>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Your family’s future deserves a strategic, compassionate advocate. Schedule a consultation today to discuss your options.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="rounded-full text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-white shadow-xl hover:shadow-2xl transition-all">
            <Link href="/contact">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Schedule Consultation
              </span>
            </Link>
          </Button>
          
          <span className="text-gray-400 hidden sm:inline">or call us at</span>
          
          <a href={`tel:${COMPANY_INFO.phone}`} className="text-xl font-semibold hover:text-accent transition-colors flex items-center gap-2">
             <Phone className="w-5 h-5" /> {COMPANY_INFO.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
