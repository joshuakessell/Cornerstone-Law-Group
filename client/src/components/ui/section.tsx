import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  container?: boolean;
  padded?: boolean;
  background?: "white" | "muted" | "primary" | "none";
}

export function Section({ 
  children, 
  className, 
  container = true, 
  padded = true,
  background = "white",
  ...props 
}: SectionProps) {
  
  const bgStyles = {
    white: "bg-white",
    muted: "bg-muted/50",
    primary: "bg-primary text-white",
    none: ""
  };

  return (
    <section 
      className={cn(
        bgStyles[background],
        padded && "py-16 md:py-24",
        className
      )} 
      {...props}
    >
      {container ? (
        <div className="container mx-auto px-6 md:px-12">
          {children}
        </div>
      ) : children}
    </section>
  );
}
