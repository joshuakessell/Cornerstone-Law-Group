import { useEffect, useState, useRef, useCallback, createContext, useContext, ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

const INTRO_KEY = "clg_intro_seen";
const END_MESSAGE = "It doesn't have to be like this…";

type OverlayState = "closed" | "idle" | "loading" | "playing" | "fadingToWhite" | "message" | "exiting";

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
  const autoplayAttemptedRef = useRef(false);

  // Check if user has seen intro on mount
  useEffect(() => {
    const hasSeen = localStorage.getItem(INTRO_KEY) === "1";
    if (!hasSeen && !shouldReduceMotion) {
      setShowOverlay(true);
      setState("idle");
      document.body.style.overflow = "hidden";
    } else if (!hasSeen && shouldReduceMotion) {
      // Show reduced motion version
      setShowOverlay(true);
      setState("idle");
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldReduceMotion]);

  // Autoplay logic: try unmuted first, then muted
  useEffect(() => {
    if (state !== "idle" || !videoRef.current || autoplayAttemptedRef.current || shouldReduceMotion) return;

    const video = videoRef.current;
    autoplayAttemptedRef.current = true;
    setState("loading");

    // Try unmuted autoplay first
    video.muted = false;
    video.play()
      .then(() => {
        setState("playing");
      })
      .catch(() => {
        // If unmuted fails, try muted
        video.muted = true;
        return video.play();
      })
      .then(() => {
        setState("playing");
      })
      .catch((error) => {
        // Both attempts failed - keep overlay open with poster visible
        console.warn("Autoplay failed, user can still interact:", error);
        setState("idle");
        autoplayAttemptedRef.current = false;
      });
  }, [state, shouldReduceMotion]);

  // Handle video time updates for fade-to-white
  useEffect(() => {
    if (state !== "playing" || !videoRef.current) return;

    const video = videoRef.current;
    const checkTime = () => {
      // Fix: Check for finite duration and currentTime, not just truthy values
      if (!Number.isFinite(video.duration) || !Number.isFinite(video.currentTime)) {
        if (state === "playing") {
          animationFrameRef.current = requestAnimationFrame(checkTime);
        }
        return;
      }

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

      // Linger for ~2 seconds, then fade out
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
      }, 2000);

      return () => clearTimeout(lingerTimer);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [state]);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.style.overflow = "";
    };
  }, []);

  if (!showOverlay || state === "closed") return null;

  // Reduced motion: show white screen with message
  if (shouldReduceMotion) {
    const showMessage = state === "idle" || state === "message" || state === "exiting";
    
    if (state === "idle") {
      // Start reduced motion flow
      setTimeout(() => {
        setState("message");
        if (messageRef.current) {
          messageRef.current.style.transition = "opacity 800ms ease-in";
          messageRef.current.style.opacity = "1";
        }
      }, 100);
    }

    if (state === "message") {
      // Show message for 500-1000ms, then exit
      setTimeout(() => {
        setState("exiting");
        if (messageRef.current) {
          messageRef.current.style.transition = "opacity 400ms ease-out";
          messageRef.current.style.opacity = "0";
        }
        setTimeout(() => {
          handleComplete();
        }, 400);
      }, 750);
    }

    return (
      <div
        className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Intro animation"
      >
        <div
          ref={messageRef}
          className="text-center px-6"
          style={{ opacity: 0 }}
        >
          <p
            className="text-black"
            style={{
              fontFamily: '"Avenir Next LT Pro Demi", "Avenir Next", Avenir, "Helvetica Neue", Arial, sans-serif',
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontWeight: 600,
            }}
          >
            {END_MESSAGE}
          </p>
        </div>
        <Button
          onClick={handleSkip}
          variant="outline"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full px-6 border-black/30 text-black hover:bg-black/10"
          aria-label="Skip intro"
        >
          Skip movie
        </Button>
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
      {/* Video container - full screen */}
      <div className="relative z-10 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          preload="auto"
          playsInline
        >
          <source src="/intro-video-cornerstone.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Subtle loading spinner (only if loading) */}
        {state === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Skip button - always visible at bottom center */}
      <Button
        onClick={handleSkip}
        variant="outline"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 rounded-full px-6 border-white/30 text-white hover:bg-white/10"
        aria-label="Skip intro video"
      >
        Skip movie
      </Button>

      {/* White fade overlay */}
      <div
        ref={whiteOverlayRef}
        className="absolute inset-0 bg-white z-20 pointer-events-none"
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
              fontFamily: '"Avenir Next LT Pro Demi", "Avenir Next", Avenir, "Helvetica Neue", Arial, sans-serif',
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontWeight: 600,
            }}
          >
            {END_MESSAGE}
          </p>
        </div>
      )}
    </div>
  );
}

// Context for opening intro overlay programmatically

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

// Separate instance component for forced opens (replay)
function IntroOverlayInstance({ forceOpen, onClose }: { forceOpen: boolean; onClose: () => void }) {
  const [state, setState] = useState<OverlayState>("closed");
  const videoRef = useRef<HTMLVideoElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const animationFrameRef = useRef<number>();
  const autoplayAttemptedRef = useRef(false);

  useEffect(() => {
    if (forceOpen) {
      setState("idle");
      autoplayAttemptedRef.current = false;
      document.body.style.overflow = "hidden";
    } else {
      setState("closed");
    }

    return () => {
      if (!forceOpen) {
        document.body.style.overflow = "";
      }
    };
  }, [forceOpen]);

  // Reset video when state becomes idle (for replay)
  useEffect(() => {
    if (state === "idle" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [state]);

  // Autoplay logic: try unmuted first, then muted
  useEffect(() => {
    if (state !== "idle" || !videoRef.current || autoplayAttemptedRef.current || shouldReduceMotion || !forceOpen) return;

    const video = videoRef.current;
    autoplayAttemptedRef.current = true;
    setState("loading");

    // Try unmuted autoplay first
    video.muted = false;
    video.play()
      .then(() => {
        setState("playing");
      })
      .catch(() => {
        // If unmuted fails, try muted
        video.muted = true;
        return video.play();
      })
      .then(() => {
        setState("playing");
      })
      .catch((error) => {
        // Both attempts failed - keep overlay open with poster visible
        console.warn("Autoplay failed, user can still interact:", error);
        setState("idle");
        autoplayAttemptedRef.current = false;
      });
  }, [state, forceOpen, shouldReduceMotion]);

  // Handle video time updates for fade-to-white
  useEffect(() => {
    if (state !== "playing" || !videoRef.current) return;

    const video = videoRef.current;
    const checkTime = () => {
      // Fix: Check for finite duration and currentTime
      if (!Number.isFinite(video.duration) || !Number.isFinite(video.currentTime)) {
        if (state === "playing") {
          animationFrameRef.current = requestAnimationFrame(checkTime);
        }
        return;
      }

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
      }, 2000);

      return () => clearTimeout(lingerTimer);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [state, onClose]);

  const handleSkip = useCallback(() => {
    setState("closed");
    onClose();
    // Note: Do NOT set localStorage for replay - only for first visit
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.style.overflow = "";
    };
  }, []);

  if (!forceOpen || state === "closed") return null;

  // Reduced motion: show white screen with message
  if (shouldReduceMotion) {
    if (state === "idle") {
      // Start reduced motion flow
      setTimeout(() => {
        setState("message");
        if (messageRef.current) {
          messageRef.current.style.transition = "opacity 800ms ease-in";
          messageRef.current.style.opacity = "1";
        }
      }, 100);
    }

    if (state === "message") {
      // Show message for 500-1000ms, then exit
      setTimeout(() => {
        setState("exiting");
        if (messageRef.current) {
          messageRef.current.style.transition = "opacity 400ms ease-out";
          messageRef.current.style.opacity = "0";
        }
        setTimeout(() => {
          setState("closed");
          onClose();
        }, 400);
      }, 750);
    }

    return (
      <div
        className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Intro animation"
      >
        <div
          ref={messageRef}
          className="text-center px-6"
          style={{ opacity: 0 }}
        >
          <p
            className="text-black"
            style={{
              fontFamily: '"Avenir Next LT Pro Demi", "Avenir Next", Avenir, "Helvetica Neue", Arial, sans-serif',
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontWeight: 600,
            }}
          >
            {END_MESSAGE}
          </p>
        </div>
        <Button
          onClick={handleSkip}
          variant="outline"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full px-6 border-black/30 text-black hover:bg-black/10"
          aria-label="Skip intro"
        >
          Skip movie
        </Button>
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
      {/* Video container - full screen */}
      <div className="relative z-10 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          preload="auto"
          playsInline
        >
          <source src="/intro-video-cornerstone.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Subtle loading spinner (only if loading) */}
        {state === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Skip button - always visible at bottom center */}
      <Button
        onClick={handleSkip}
        variant="outline"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 rounded-full px-6 border-white/30 text-white hover:bg-white/10"
        aria-label="Skip intro video"
      >
        Skip movie
      </Button>

      {/* White fade overlay */}
      <div
        ref={whiteOverlayRef}
        className="absolute inset-0 bg-white z-20 pointer-events-none"
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
              fontFamily: '"Avenir Next LT Pro Demi", "Avenir Next", Avenir, "Helvetica Neue", Arial, sans-serif',
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontWeight: 600,
            }}
          >
            {END_MESSAGE}
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
