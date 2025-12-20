import { useState } from "react";
import { Section } from "@/components/ui/section";
import { ContactCTA } from "@/components/ui/contact-cta";
import { TEAM } from "@/lib/content";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, GraduationCap } from "lucide-react";

export default function OurTeam() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  return (
    <>
      <div className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-4xl md:text-5xl font-bold mb-4"
          >
            A Team Dedicated to Holistic Client Care
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl leading-relaxed"
          >
            Experienced advocates dedicated to guiding you through your legal journey with expertise and compassion.
          </motion.p>
        </div>
      </div>

      <Section padded animate={false}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12">
          {TEAM.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`cursor-pointer group relative ${selectedMember === index ? 'ring-4 ring-primary rounded-xl' : ''}`}
              onClick={() => setSelectedMember(selectedMember === index ? null : index)}
              data-testid={`team-member-${index}`}
            >
              <div className="aspect-[3/4] overflow-hidden rounded-xl bg-muted shadow-lg">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-serif text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-primary text-xs md:text-sm font-medium uppercase tracking-wider">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedMember !== null && (
            <motion.div
              key={selectedMember}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-card border border-border rounded-2xl shadow-xl p-6 md:p-10 relative">
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                  data-testid="close-member-details"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
                
                <div className="grid md:grid-cols-[280px_1fr] gap-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded-xl shadow-lg">
                      <img 
                        src={TEAM[selectedMember].image} 
                        alt={TEAM[selectedMember].name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
                      {TEAM[selectedMember].name}
                    </h2>
                    <p className="text-primary/70 text-sm font-bold uppercase tracking-wider mb-6">
                      {TEAM[selectedMember].role}
                    </p>
                    
                    <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
                      {TEAM[selectedMember].fullBio.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="mb-4 leading-relaxed">{paragraph}</p>
                      ))}
                    </div>
                    
                    {TEAM[selectedMember].honors && TEAM[selectedMember].honors.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                      >
                        <h4 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground mb-3">
                          <Award className="w-5 h-5 text-primary" />
                          Honors & Accreditations
                        </h4>
                        <ul className="space-y-2">
                          {TEAM[selectedMember].honors.map((honor, i) => (
                            <li key={i} className="text-muted-foreground text-sm flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {honor}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                    
                    {TEAM[selectedMember].education && TEAM[selectedMember].education.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h4 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground mb-3">
                          <GraduationCap className="w-5 h-5 text-primary" />
                          Education
                        </h4>
                        <ul className="space-y-2">
                          {TEAM[selectedMember].education.map((edu, i) => (
                            <li key={i} className="text-muted-foreground text-sm flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {edu}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      <ContactCTA />
    </>
  );
}
