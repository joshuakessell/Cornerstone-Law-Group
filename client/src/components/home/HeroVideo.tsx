import { useEffect, useRef, useState } from "react";
import { useLocalStorageBoolean } from "@/hooks/useLocalStorageBoolean";

interface HeroVideoProps {
  srcMp4?: string;
  srcWebm?: string;
  poster?: string;
  preferenceKey: string;
  videoDisabled?: boolean;
}

export function HeroVideo({
  srcMp4,
  srcWebm,
  poster,
  preferenceKey,
  videoDisabled: videoDisabledProp,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [storedVideoDisabled] = useLocalStorageBoolean(preferenceKey, false);
  const videoDisabled = videoDisabledProp ?? storedVideoDisabled;
  const [isReady, setIsReady] = useState(false);
  const [playAttempted, setPlayAttempted] = useState(false);

  // Ensure video is muted before playing (required for autoplay)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  // Attempt to play video
  const attemptPlay = async () => {
    const video = videoRef.current;
    if (!video || playAttempted) return;

    try {
      setPlayAttempted(true);
      await video.play();
    } catch (error) {
      // Autoplay may be blocked by browser policy
      // This is expected behavior - user will need to interact to play
      console.debug("Video autoplay blocked:", error);
      setPlayAttempted(false);
    }
  };

  // Handle video ready state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsReady(true);
      if (!videoDisabled && !playAttempted) {
        attemptPlay();
      }
    };

    const handleCanPlay = () => {
      setIsReady(true);
      if (!videoDisabled && !playAttempted) {
        attemptPlay();
      }
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleCanPlay);

    // If already loaded, try to play immediately
    if (video.readyState >= 2) {
      setIsReady(true);
      if (!videoDisabled && !playAttempted) {
        attemptPlay();
      }
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [videoDisabled, playAttempted]);

  // Handle play/pause based on preference
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (videoDisabled) {
      video.pause();
      setPlayAttempted(false);
    } else {
      // Only attempt play if video is ready
      if (isReady && video.readyState >= 2) {
        attemptPlay();
      }
    }
  }, [videoDisabled, isReady]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay={!videoDisabled}
        loop
        muted
        playsInline
        preload="metadata"
        poster={poster}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
          videoDisabled ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {srcWebm && <source src={srcWebm} type="video/webm" />}
        {srcMp4 && <source src={srcMp4} type="video/mp4" />}
      </video>
      {/* Tinted Overlay */}
      <div
        className={`absolute inset-0 z-[1] bg-background/60 transition-opacity duration-300 ${
          videoDisabled ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* Fallback Background (when video is disabled) */}
      {videoDisabled && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-background to-muted/30" />
      )}
    </>
  );
}
