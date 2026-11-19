"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from "react";

// Fades and lifts its content into place the first time it scrolls into view. One easing for the whole
// site, so every entrance feels like part of the same movement; `delay` staggers things that arrive together.
// With reduced motion turned on, it simply shows.
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  y = 28,
  scale = 1,
  edge = "0px 0px -6% 0px",
  className = "",
  ...rest
}: { children: ReactNode; as?: ElementType; delay?: number; y?: number; scale?: number; edge?: string; className?: string } & HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setOn(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: edge }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [edge]);

  const style: CSSProperties = {
    opacity: on ? 1 : 0,
    transform: on ? "none" : `translateY(${y}px) scale(${scale})`,
    transition: `opacity 800ms cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 950ms cubic-bezier(.2,.7,.2,1) ${delay}ms`,
  };

  return (
    <Tag ref={ref} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}
