import { useEffect, useState, useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";

const INTRO_KEY = "clg_intro_seen";

type OverlayState = "closed" | "idle" | "playing" | "fadingToWhite" | "message" | "exiting";

interface IntroOverlayProps {
  onClose?: () => void;
}

export function IntroOverlay({ onClose }: IntroOverlayProps) {
  const [state, setState] = useState<OverlayState>("closed");
  const [showOverlay, setShowOverlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const animationFrameRef = useRef<number>();

  // Check if user has seen intro on mount
  useEffect(() => {
    const hasSeen = localStorage.getItem(INTRO_KEY) === "1";
    if (!hasSeen && !shouldReduceMotion) {
      setShowOverlay(true);
      setState("idle");
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldReduceMotion]);

  // Handle video time updates for fade-to-white
  useEffect(() => {
    if (state !== "playing" || !videoRef.current) return;

    const video = videoRef.current;
    const checkTime = () => {
      if (!video.duration || !video.currentTime) return;

      const timeRemaining = video.duration - video.currentTime;
      
      if (timeRemaining <= 1.0 && state === "playing") {
        setState("fadingToWhite");
        if (whiteOverlayRef.current) {
          whiteOverlayRef.current.style.transition = "opacity 1000ms ease-out";
          whiteOverlayRef.current.style.opacity = "1";
        }
      }

      if (state === "playing") {
        animationFrameRef.current = requestAnimationFrame(checkTime);
      }
    };

    animationFrameRef.current = requestAnimationFrame(checkTime);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state]);

  // Handle video ended
  useEffect(() => {
    if (state !== "fadingToWhite" && state !== "playing") return;

    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // Ensure white overlay is fully opaque
      if (whiteOverlayRef.current) {
        whiteOverlayRef.current.style.opacity = "1";
      }
      
      setState("message");
      
      // Fade in message
      if (messageRef.current) {
        messageRef.current.style.transition = "opacity 800ms ease-in";
        messageRef.current.style.opacity = "1";
      }

      // Linger for 1500-2500ms, then fade out
      const lingerTimer = setTimeout(() => {
        setState("exiting");
        if (whiteOverlayRef.current && messageRef.current) {
          whiteOverlayRef.current.style.transition = "opacity 800ms ease-out";
          whiteOverlayRef.current.style.opacity = "0";
          messageRef.current.style.transition = "opacity 400ms ease-out";
          messageRef.current.style.opacity = "0";
        }
        
        // Complete exit after fade
        setTimeout(() => {
          handleComplete();
        }, 800);
      }, shouldReduceMotion ? 500 : 2000);

      return () => clearTimeout(lingerTimer);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [state, shouldReduceMotion]);

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      setState("playing");
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, []);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, []);

  const handleComplete = useCallback(() => {
    localStorage.setItem(INTRO_KEY, "1");
    setState("closed");
    setShowOverlay(false);
    document.body.style.overflow = "";
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Handle ESC key
  useEffect(() => {
    if (state === "closed") return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [state, handleSkip]);

  // Focus management
  useEffect(() => {
    if (state === "idle") {
      // Focus the Play button when idle
      const playButton = document.querySelector('[data-intro-play]') as HTMLElement;
      if (playButton) {
        playButton.focus();
      }
    }
  }, [state]);

  if (!showOverlay || state === "closed") return null;

  // Reduced motion: skip to message quickly
  if (shouldReduceMotion && state === "idle") {
    return (
      <div
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Intro animation"
      >
        <div className="text-center space-y-4 px-6">
          <p
            className="text-white text-2xl md:text-4xl font-semibold"
            style={{
              fontFamily: '"Avenir Next LT Pro Demi", "Avenir Next", Avenir, -apple-system, sans-serif',
            }}
          >
            It doesn't have to be like this...
          </p>
          <Button
            onClick={handleComplete}
            className="rounded-full"
            aria-label="Close"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Intro video"
    >
      {/* Dark overlay background */}
      <div className="absolute inset-0 bg-black" />

      {/* Video container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 px-6 max-w-4xl w-full">
        {/* Volume hint text */}
        {state === "idle" && (
          <p className="text-white text-sm md:text-base text-center">
            Volume up for the best experience.
          </p>
        )}

        {/* Video element */}
        <div className="relative w-full max-w-4xl aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            preload="metadata"
            playsInline
            muted={false}
          >
            <source src="/intro_video.webm" type="video/webm" />
            <source src="/intro_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play button overlay (when idle) */}
          {state === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Button
                data-intro-play
                onClick={handlePlay}
                size="lg"
                className="rounded-full px-8 py-6 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm"
                aria-label="Play intro video"
              >
                <Play className="w-6 h-6 mr-2" />
                Play
              </Button>
            </div>
          )}
        </div>

        {/* Disclaimer text */}
        {state === "idle" && (
          <p className="text-white/60 text-xs text-center">
            Dramatization. No actual incidents occurred
          </p>
        )}

        {/* Skip button */}
        {state === "idle" && (
          <Button
            onClick={handleSkip}
            variant="outline"
            className="rounded-full px-6 border-white/30 text-white hover:bg-white/10"
            aria-label="Skip intro video"
          >
            Skip movie
          </Button>
        )}
      </div>

      {/* White fade overlay */}
      <div
        ref={whiteOverlayRef}
        className={cn(
          "absolute inset-0 bg-white z-20 pointer-events-none",
          state === "fadingToWhite" || state === "message" || state === "exiting" ? "opacity-0" : "opacity-0"
        )}
        style={{ opacity: 0 }}
      />

      {/* Message overlay */}
      {(state === "message" || state === "exiting") && (
        <div
          ref={messageRef}
          className="absolute inset-0 z-30 flex items-center justify-center bg-white"
          style={{ opacity: 0 }}
        >
          <p
            className="text-black text-center px-6"
            style={{
              fontFamily: '"Avenir Next LT Pro Demi", "Avenir Next", Avenir, -apple-system, sans-serif',
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontWeight: 600,
            }}
          >
            It doesn't have to be like this...
          </p>
        </div>
      )}
    </div>
  );
}

// Context for opening intro overlay programmatically
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface IntroOverlayContextType {
  openIntro: () => void;
}

const IntroOverlayContext = createContext<IntroOverlayContextType | undefined>(undefined);

export function IntroOverlayProvider({ children }: { children: ReactNode }) {
  const [forceOpen, setForceOpen] = useState(false);

  const openIntro = useCallback(() => {
    setForceOpen(true);
  }, []);

  return (
    <IntroOverlayContext.Provider value={{ openIntro }}>
      {children}
      <IntroOverlayInstance forceOpen={forceOpen} onClose={() => setForceOpen(false)} />
    </IntroOverlayContext.Provider>
  );
}

// Separate instance component for forced opens
function IntroOverlayInstance({ forceOpen, onClose }: { forceOpen: boolean; onClose: () => void }) {
  const [state, setState] = useState<OverlayState>("closed");
  const videoRef = useRef<HTMLVideoElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (forceOpen) {
      setState("idle");
      document.body.style.overflow = "hidden";
      // Reset video if it exists
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
      }
    }

    return () => {
      if (!forceOpen) {
        document.body.style.overflow = "";
      }
    };
  }, [forceOpen]);

  // Same video handling logic as main component
  useEffect(() => {
    if (state !== "playing" || !videoRef.current) return;

    const video = videoRef.current;
    const checkTime = () => {
      if (!video.duration || !video.currentTime) return;

      const timeRemaining = video.duration - video.currentTime;
      
      if (timeRemaining <= 1.0 && state === "playing") {
        setState("fadingToWhite");
        if (whiteOverlayRef.current) {
          whiteOverlayRef.current.style.transition = "opacity 1000ms ease-out";
          whiteOverlayRef.current.style.opacity = "1";
        }
      }

      if (state === "playing") {
        animationFrameRef.current = requestAnimationFrame(checkTime);
      }
    };

    animationFrameRef.current = requestAnimationFrame(checkTime);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state]);

  useEffect(() => {
    if (state !== "fadingToWhite" && state !== "playing") return;

    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (whiteOverlayRef.current) {
        whiteOverlayRef.current.style.opacity = "1";
      }
      
      setState("message");
      
      if (messageRef.current) {
        messageRef.current.style.transition = "opacity 800ms ease-in";
        messageRef.current.style.opacity = "1";
      }

      const lingerTimer = setTimeout(() => {
        setState("exiting");
        if (whiteOverlayRef.current && messageRef.current) {
          whiteOverlayRef.current.style.transition = "opacity 800ms ease-out";
          whiteOverlayRef.current.style.opacity = "0";
          messageRef.current.style.transition = "opacity 400ms ease-out";
          messageRef.current.style.opacity = "0";
        }
        
        setTimeout(() => {
          setState("closed");
          onClose();
        }, 800);
      }, shouldReduceMotion ? 500 : 2000);

      return () => clearTimeout(lingerTimer);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [state, shouldReduceMotion, onClose]);

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      setState("playing");
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, []);

  const handleSkip = useCallback(() => {
    setState("closed");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (state === "closed" || !forceOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [state, forceOpen, handleSkip]);

  if (!forceOpen || state === "closed") return null;

  if (shouldReduceMotion && state === "idle") {
    return (
      <div
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Intro animation"
      >
        <div className="text-center space-y-4 px-6">
          <p
            className="text-white text-2xl md:text-4xl font-semibold"
            style={{
              fontFamily: '"Avenir Next LT Pro Demi", "Avenir Next", Avenir, -apple-system, sans-serif',
            }}
          >
            It doesn't have to be like this...
          </p>
          <Button
            onClick={handleSkip}
            className="rounded-full"
            aria-label="Close"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Intro video"
    >
      <div className="absolute inset-0 bg-black" />
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 px-6 max-w-4xl w-full">
        {state === "idle" && (
          <p className="text-white text-sm md:text-base text-center">
            Volume up for the best experience.
          </p>
        )}
        <div className="relative w-full max-w-4xl aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            preload="metadata"
            playsInline
            muted={false}
          >
            <source src="/intro_video.webm" type="video/webm" />
            <source src="/intro_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {state === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Button
                onClick={handlePlay}
                size="lg"
                className="rounded-full px-8 py-6 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm"
                aria-label="Play intro video"
              >
                <Play className="w-6 h-6 mr-2" />
                Play
              </Button>
            </div>
          )}
        </div>
        {state === "idle" && (
          <p className="text-white/60 text-xs text-center">
            Dramatization. No actual incidents occurred
          </p>
        )}
        {state === "idle" && (
          <Button
            onClick={handleSkip}
            variant="outline"
            className="rounded-full px-6 border-white/30 text-white hover:bg-white/10"
            aria-label="Skip intro video"
          >
            Skip movie
          </Button>
        )}
      </div>
      <div
        ref={whiteOverlayRef}
        className="absolute inset-0 bg-white z-20 pointer-events-none"
        style={{ opacity: 0 }}
      />
      {(state === "message" || state === "exiting") && (
        <div
          ref={messageRef}
          className="absolute inset-0 z-30 flex items-center justify-center bg-white"
          style={{ opacity: 0 }}
        >
          <p
            className="text-black text-center px-6"
            style={{
              fontFamily: '"Avenir Next LT Pro Demi", "Avenir Next", Avenir, -apple-system, sans-serif',
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontWeight: 600,
            }}
          >
            It doesn't have to be like this...
          </p>
        </div>
      )}
    </div>
  );
}

export function useIntroOverlay() {
  const context = useContext(IntroOverlayContext);
  if (!context) {
    throw new Error("useIntroOverlay must be used within IntroOverlayProvider");
  }
  return context;
}
