import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

export type AnchorReturnState = {
  active: boolean;
  lastAnchorReturnY: number;
  lastAnchorId: string | null;
};

export type AnchorReturnControls = {
  state: AnchorReturnState;
  returnToPrevious: () => void;
  clear: () => void;
};

const isModifiedClick = (event: MouseEvent) =>
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

const getAnchorTarget = (anchorId: string) => {
  if (!anchorId) return null;
  const direct = document.getElementById(anchorId);
  if (direct) return direct;
  const safe = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(anchorId) : anchorId;
  return document.querySelector(`[name="${safe}"]`);
};

const getReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

export function useSpaLinkInterceptor(): AnchorReturnControls {
  const [location, setLocation] = useLocation();
  const anchorReturnRef = useRef<AnchorReturnState>({
    active: false,
    lastAnchorReturnY: 0,
    lastAnchorId: null,
  });
  const [anchorState, setAnchorState] = useState<AnchorReturnState>(anchorReturnRef.current);

  const updateAnchorState = useCallback((next: Partial<AnchorReturnState>) => {
    anchorReturnRef.current = { ...anchorReturnRef.current, ...next };
    setAnchorState(anchorReturnRef.current);
  }, []);

  const clearAnchor = useCallback(() => {
    updateAnchorState({ active: false, lastAnchorId: null, lastAnchorReturnY: 0 });
  }, [updateAnchorState]);

  const returnToPrevious = useCallback(() => {
    if (!anchorReturnRef.current.active) return;
    const behavior = getReducedMotion() ? "auto" : "smooth";
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    window.scrollTo({ top: anchorReturnRef.current.lastAnchorReturnY, behavior });
    clearAnchor();
  }, [clearAnchor]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0 || isModifiedClick(event)) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const isHashOnly = href.trim().startsWith("#");
      const isSamePath = url.pathname === window.location.pathname && url.search === window.location.search;
      const hasHash = Boolean(url.hash);

      if (isHashOnly || (isSamePath && hasHash)) {
        event.preventDefault();
        const anchorId = decodeURIComponent(url.hash.replace("#", ""));
        const targetEl = getAnchorTarget(anchorId);
        if (!targetEl) {
          history.pushState(null, "", `${window.location.pathname}${window.location.search}#${anchorId}`);
          return;
        }

        updateAnchorState({
          active: true,
          lastAnchorReturnY: window.scrollY,
          lastAnchorId: anchorId,
        });

        history.pushState(null, "", `${window.location.pathname}${window.location.search}#${anchorId}`);
        targetEl.scrollIntoView({ behavior: getReducedMotion() ? "auto" : "smooth", block: "start" });
        return;
      }

      event.preventDefault();
      setLocation(`${url.pathname}${url.search}${url.hash}`);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [setLocation, updateAnchorState]);

  useEffect(() => {
    if (!anchorReturnRef.current.active) return;
    clearAnchor();
  }, [location, clearAnchor]);

  return {
    state: anchorState,
    returnToPrevious,
    clear: clearAnchor,
  };
}
