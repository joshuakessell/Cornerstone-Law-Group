import { Section } from "@/components/ui/section";
import { ContactCTA } from "@/components/ui/contact-cta";
import { TEAM } from "@/lib/content";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import malePlaceholder from "@assets/generated_images/professional_headshot_placeholder_male.png";
import femalePlaceholder from "@assets/generated_images/professional_headshot_placeholder_female.png";

export default function OurTeam() {
  return (
    <>
      <div className="bg-primary text-white py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Our Team</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
            Experienced advocates dedicated to guiding you through your legal journey with expertise and compassion.
          </p>
        </div>
      </div>

      <Section padded>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM.map((member, index) => (
            <div key={index} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
                 <img 
                  src={member.image === 'female' ? femalePlaceholder : malePlaceholder} 
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl font-bold text-primary mb-1">{member.name}</h3>
                <p className="text-accent text-sm font-bold uppercase tracking-wider mb-4">{member.role}</p>
                <p className="text-gray-600 mb-6 line-clamp-3">{member.bio}</p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                      Read Full Bio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl font-bold text-primary">{member.name}</DialogTitle>
                      <p className="text-accent text-sm font-bold uppercase tracking-wider">{member.role}</p>
                    </DialogHeader>
                    <div className="mt-4">
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {member.bio}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        (Extended bio placeholder text... In a real application, this would contain the full professional history, education, and accolades of the team member.)
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <ContactCTA />
    </>
  );
}
