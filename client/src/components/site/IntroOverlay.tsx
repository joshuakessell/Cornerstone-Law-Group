import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const INTRO_KEY = "cs_intro_seen";

export function IntroOverlay() {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);

    const hasSeen = localStorage.getItem(INTRO_KEY);
    if (hasSeen || prefersReduced) {
      return;
    }
    setVisible(true);

    const timer = window.setTimeout(() => {
      handleClose();
    }, 7200);

    return () => window.clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem(INTRO_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex items-center justify-center bg-gradient-to-br from-[#050a14] via-[#0b1528] to-[#0f1f36] text-foreground/90"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Intro animation"
    >
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_20%,#d6a84b33,transparent_25%),radial-gradient(circle_at_80%_10%,#4ea6ff22,transparent_20%),radial-gradient(circle_at_50%_80%,#d6a84b22,transparent_22%)]" />
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <g
            className={cn(
              "transition-all duration-[1800ms] ease-out",
              reducedMotion ? "opacity-80" : "opacity-100 animate-[pulse_6s_ease-in-out_infinite]"
            )}
            stroke="#d6a84b"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          >
            <path d="M120 420 Q220 260 340 360 T560 320" opacity="0.6" />
            <path d="M160 380 Q260 240 380 340 T600 300" opacity="0.3" />
            <path d="M100 450 Q220 300 360 380 T640 340" opacity="0.4" />
          </g>
          <g
            className={cn(
              "transition-all duration-700 ease-out delay-300",
              reducedMotion ? "opacity-85" : "animate-[fadeIn_2s_ease-out_forwards]"
            )}
            fill="#0f1f36"
          >
            <path d="M180 420 q20 -80 60 -120 q80 -40 140 30 q60 70 120 20 q40 -30 100 30 l0 150 l-420 0z" fill="#0a1529" opacity="0.35" />
            <path d="M250 430 q30 -60 80 -70 q50 -10 90 40 q40 50 90 10 q40 -30 90 40 l0 120 l-340 0z" fill="#0d1c32" opacity="0.4" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl text-center space-y-6 px-6">
        <p
          className={cn(
            "text-lg md:text-xl text-foreground/80 tracking-[0.08em] uppercase",
            reducedMotion ? "" : "animate-[fadeIn_1.2s_ease-out]"
          )}
        >
          Cornerstone Law Group, P.C.
        </p>
        <h1
          className={cn(
            "font-serif text-3xl md:text-5xl leading-tight text-foreground",
            reducedMotion ? "" : "animate-[fadeIn_1.6s_ease-out]"
          )}
        >
          It doesn’t have to be like this.
        </h1>
        <p
          className={cn(
            "text-base md:text-lg text-foreground/75",
            reducedMotion ? "" : "animate-[fadeIn_2s_ease-out]"
          )}
        >
          Calm, strategic family law for Dallas families—protecting children, assets, and your ability to move forward.
        </p>
        <button
          onClick={handleClose}
          className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

