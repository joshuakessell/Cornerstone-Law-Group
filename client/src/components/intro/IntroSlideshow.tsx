import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  onComplete: () => void;
  logoSrc: string;
  showOncePerSession?: boolean;
};

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

type Phase = "introVideo" | "tagline" | "logoCenter" | "logoSlide" | "fadeIn";

export function IntroSlideshow({
  onComplete,
  logoSrc,
  showOncePerSession = true,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("introVideo");

  const sessionKey = "cornerstone_intro_done_v1";

  useEffect(() => {
    if (reduceMotion) {
      if (showOncePerSession) sessionStorage.setItem(sessionKey, "1");
      onComplete();
      return;
    }

    if (showOncePerSession && sessionStorage.getItem(sessionKey) === "1") {
      onComplete();
      return;
    }
  }, [reduceMotion, onComplete, showOncePerSession]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await preload(logoSrc);
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [logoSrc]);

  useEffect(() => {
    if (!ready) return;

    const timers: number[] = [];

    if (phase === "introVideo") {
      // Show "Intro Video Here" for 5 seconds
      const t1 = window.setTimeout(() => {
        setPhase("tagline");
      }, 5000);
      timers.push(t1);
    }

    if (phase === "tagline") {
      // Show "It doesn't have to be like this..." for 3 seconds
      const t2 = window.setTimeout(() => {
        setPhase("logoCenter");
      }, 3000);
      timers.push(t2);
    }

    if (phase === "logoCenter") {
      // Show logo centered, then slide after a brief pause
      const t3 = window.setTimeout(() => {
        setPhase("logoSlide");
      }, 800);
      timers.push(t3);
    }

    if (phase === "logoSlide") {
      // After logo slides to position, fade in website
      const t4 = window.setTimeout(() => {
        setPhase("fadeIn");
      }, 650);
      timers.push(t4);
    }

    if (phase === "fadeIn") {
      // Complete the intro
      const t5 = window.setTimeout(() => {
        if (showOncePerSession) sessionStorage.setItem(sessionKey, "1");
        onComplete();
      }, 500);
      timers.push(t5);
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [ready, phase, onComplete, showOncePerSession]);

  if (!ready) return <div className="fixed inset-0 z-[100] bg-background" />;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-background">
      <button
        type="button"
        className="absolute right-4 top-4 z-[120] rounded-md bg-black/40 px-3 py-2 text-sm text-white backdrop-blur hover:bg-black/55"
        onClick={() => {
          if (showOncePerSession) sessionStorage.setItem(sessionKey, "1");
          onComplete();
        }}
      >
        Skip
      </button>

      {/* Intro Video Here Text */}
      <AnimatePresence>
        {phase === "introVideo" && (
          <motion.div
            className="absolute inset-0 z-[110] flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Intro Video Here
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tagline Text */}
      <AnimatePresence>
        {phase === "tagline" && (
          <motion.div
            className="absolute inset-0 z-[110] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="max-w-3xl text-center text-foreground">
              <div className="text-2xl font-semibold tracking-tight sm:text-3xl">
                It doesn&apos;t have to be like this...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo - Centered then slides to top left */}
      {(phase === "logoCenter" || phase === "logoSlide" || phase === "fadeIn") && (
        <motion.img
          key="logo"
          src={logoSrc}
          alt="Cornerstone Law Group"
          className="absolute z-[115]"
          initial={{
            left: "50%",
            top: "50%",
            x: "-50%",
            y: "-50%",
            width: 320,
            height: "auto",
            opacity: 0,
          }}
          animate={
            phase === "logoCenter"
              ? {
                  opacity: 1,
                }
              : phase === "logoSlide" || phase === "fadeIn"
              ? {
                  left: 24,
                  top: 20,
                  x: 0,
                  y: 0,
                  width: "auto",
                  height: 40,
                  opacity: 1,
                }
              : {}
          }
          transition={
            phase === "logoCenter"
              ? {
                  opacity: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                }
              : phase === "logoSlide"
              ? {
                  left: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
                  top: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
                  x: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
                  y: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
                  width: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
                  height: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
                }
              : {}
          }
          draggable={false}
        />
      )}

      {/* Fade in overlay for website reveal */}
      <AnimatePresence>
        {phase === "fadeIn" && (
          <motion.div
            className="absolute inset-0 z-[105] bg-background"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
