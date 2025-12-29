import React from "react";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  container?: boolean;
  padded?: boolean;
  background?: "default" | "muted" | "primary" | "none";
  animate?: boolean;
  id?: string;
}

export function Section({ 
  children, 
  className, 
  container = true, 
  padded = true,
  background = "default",
  animate = true,
  id,
}: SectionProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const bgStyles = {
    default: "bg-background",
    muted: "bg-muted",
    primary: "bg-primary text-primary-foreground",
    none: ""
  };

  const content = container ? (
    <div className="container mx-auto px-6 md:px-12">
      {children}
    </div>
  ) : children;

  const sectionClasses = cn(
    bgStyles[background],
    padded && "py-12 md:py-16",
    className
  );

  if (animate && !shouldReduceMotion) {
    return (
      <motion.section 
        id={id}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={sectionClasses}
      >
        {content}
      </motion.section>
    );
  }

  return (
    <section id={id} className={sectionClasses}>
      {content}
    </section>
  );
}
