import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { COMPANY_INFO, NAV_LINKS } from "@/lib/content";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled ? "bg-white/90 backdrop-blur-md py-3 shadow-sm border-gray-100" : "bg-transparent py-5 border-transparent"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex flex-col group">
            <span className="font-serif text-2xl md:text-3xl font-bold text-primary tracking-tight group-hover:text-primary/90 transition-colors">
              Cornerstone
            </span>
            <span className="text-[10px] md:text-xs tracking-[0.2em] text-muted-foreground uppercase font-sans group-hover:text-accent transition-colors">
              Law Group, P.C.
            </span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <a className={cn(
                "text-sm font-medium transition-colors hover:text-accent relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full",
                location === link.href ? "text-primary font-semibold after:w-full" : "text-gray-600"
              )}>
                {link.label}
              </a>
            </Link>
          ))}
          <a 
            href="https://secure.lawpay.com/pages/cornerstonelawtexas/trust?gr_used=true" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-600 hover:text-accent transition-colors"
          >
            Make a Payment
          </a>
          <Button asChild className="rounded-full px-6 shadow-lg bg-primary hover:bg-primary/90 text-white transition-all hover:scale-105">
            <Link href="/contact">Schedule Consultation</Link>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-primary hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-x-0 top-[70px] bg-white border-b shadow-lg transition-all duration-300 ease-in-out lg:hidden overflow-hidden",
        isOpen ? "max-h-screen opacity-100 py-6" : "max-h-0 opacity-0 py-0"
      )}>
        <div className="container mx-auto px-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <a 
                className={cn(
                  "text-lg font-medium py-2 border-b border-gray-50",
                  location === link.href ? "text-primary pl-2 border-l-4 border-l-accent border-b-0 bg-gray-50" : "text-gray-600"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            </Link>
          ))}
           <a 
            href="https://secure.lawpay.com/pages/cornerstonelawtexas/trust?gr_used=true" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-lg font-medium py-2 text-gray-600"
          >
            Make a Payment
          </a>
          <Button asChild className="mt-4 w-full rounded-full py-6 text-lg">
            <Link href="/contact">Schedule Consultation</Link>
          </Button>
          
          <div className="mt-6 p-4 bg-muted rounded-lg flex flex-col gap-2">
             <span className="text-xs text-muted-foreground uppercase tracking-wider">Contact Us</span>
             <a href={`tel:${COMPANY_INFO.phone}`} className="flex items-center gap-2 text-primary font-bold">
               <Phone className="h-4 w-4" /> {COMPANY_INFO.phone}
             </a>
             <span className="text-sm text-gray-600">{COMPANY_INFO.address.street}, {COMPANY_INFO.address.city}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
