import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  container?: boolean;
  padded?: boolean;
  background?: "default" | "muted" | "primary" | "none";
}

export function Section({ 
  children, 
  className, 
  container = true, 
  padded = true,
  background = "default",
  ...props 
}: SectionProps) {
  
  const bgStyles = {
    default: "bg-background",
    muted: "bg-muted",
    primary: "bg-primary text-primary-foreground",
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
