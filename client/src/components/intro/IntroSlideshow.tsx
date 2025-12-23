import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  onComplete: () => void;
  images: string[];
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

export function IntroSlideshow({
  onComplete,
  images,
  logoSrc,
  showOncePerSession = true,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [idx, setIdx] = useState(0);

  const [phase, setPhase] = useState<
    "slideshow" | "flash" | "tagline" | "logoCenter" | "handoff"
  >("slideshow");

  const sessionKey = "cornerstone_intro_done_v1";

  const perImageMs = useMemo(() => 1600, []);

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
      const warm = [images[0], images[1], logoSrc].filter(Boolean) as string[];
      await Promise.all(warm.map(preload));
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [images, logoSrc]);

  useEffect(() => {
    if (!ready) return;
    if (phase !== "slideshow") return;

    const timer = window.setInterval(() => {
      setIdx((prev: number) => {
        const next = prev + 1;
        if (next >= images.length) {
          window.clearInterval(timer);
          setPhase("flash");
          return prev;
        }
        return next;
      });
    }, perImageMs);

    return () => window.clearInterval(timer);
  }, [ready, phase, images.length, perImageMs]);

  useEffect(() => {
    if (!ready) return;

    if (phase === "flash") {
      const t = window.setTimeout(() => setPhase("tagline"), 400);
      return () => window.clearTimeout(t);
    }

    if (phase === "tagline") {
      const t = window.setTimeout(() => setPhase("logoCenter"), 950);
      return () => window.clearTimeout(t);
    }

    if (phase === "handoff") {
      if (showOncePerSession) sessionStorage.setItem(sessionKey, "1");
      const t = window.setTimeout(() => onComplete(), 650);
      return () => window.clearTimeout(t);
    }
  }, [ready, phase, onComplete, showOncePerSession]);

  if (!ready) return <div className="fixed inset-0 z-[100] bg-black" />;

  const current = images[Math.min(idx, images.length - 1)];

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black">
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

      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {phase === "slideshow" && (
            <motion.img
              key={current}
              src={current}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
              draggable={false}
            />
          )}
        </AnimatePresence>

        {phase !== "slideshow" && (
          <img
            src={images[images.length - 1]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-black/25" />
      </div>

      <AnimatePresence>
        {(phase === "flash" ||
          phase === "tagline" ||
          phase === "logoCenter" ||
          phase === "handoff") && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(phase === "tagline" || phase === "logoCenter" || phase === "handoff") && (
          <motion.div
            className="absolute inset-0 z-[110] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <div className="max-w-3xl text-center text-neutral-900">
              <div className="text-2xl font-semibold tracking-tight sm:text-3xl">
                It doesn&apos;t have to be like this...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(phase === "logoCenter" || phase === "handoff") && (
          <motion.img
            src={logoSrc}
            alt="Cornerstone Law Group"
            className="absolute z-[115] h-auto w-[320px] sm:w-[420px] md:w-[520px]"
            style={{ left: "50%", top: "58%", transform: "translate(-50%, -50%)" }}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{
              opacity: 1,
              scale: 1,
              ...(phase === "handoff"
                ? {
                    left: "24px",
                    top: "18px",
                    transform: "translate(0, 0)",
                    width: "220px",
                  }
                : {}),
            }}
            transition={{
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
              left: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
              top: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
              width: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
            }}
            onAnimationComplete={() => {
              if (phase === "logoCenter") {
                window.setTimeout(() => setPhase("handoff"), 450);
              }
            }}
            draggable={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

