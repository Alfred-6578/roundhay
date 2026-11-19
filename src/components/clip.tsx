"use client";

import { useEffect, useRef, type CSSProperties } from "react";

// A silent looping clip that only plays while `play` is true (and never with reduced motion), so a page full of
// them costs nothing until one is on show. The poster stands in the rest of the time.
export function Clip({ src, poster, play, className = "", style }: { src: string; poster: string; play: boolean; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.play().catch(() => {});
    else v.pause();
  }, [play]);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload={play ? "auto" : "none"} className={`h-full w-full object-cover ${className}`} style={style} aria-hidden="true" />;
}
