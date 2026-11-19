"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { bust, faceTrack } from "@/lib/media";
import { Icon } from "@/components/icons";

/*
  The hero statue. The head turns to follow the cursor while it is over the hero, and otherwise holds its starting
  pose, turned to the left (no automatic movement). With real frames in bust.frames the nearest two are blended; without them a
  drawn stand-in turns by shifting its features. The word ribbon passes behind and in front of the statue.
*/

// The pose the statue starts in and returns to when the cursor is not over the hero: turned to the viewer's left
// (toward the headline), -1 being fully left and 0 straight on.
const REST = -0.7;
const REST_FRAME = Math.round(bust.centre + REST * bust.centre);

const CX = 300, CY = 436, RX = 288, RY = 98;
const BACK = `M ${CX - RX} ${CY} A ${RX} ${RY} 0 0 1 ${CX + RX} ${CY}`;
const FRONT = `M ${CX - RX} ${CY} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CY}`;
const WORDS = "CAST  ·  DIRECT  ·  SHOOT  ·  CUT  ·  PUBLISH";
const HEAD = "M205 296 C205 194 250 144 300 144 C350 144 395 194 395 296 C395 372 372 432 338 458 Q300 480 262 458 C228 432 205 372 205 296 Z";

// A band with thickness: a drop shadow, a dark lower edge, the body, a soft highlight along the top and a bright rim.
// The back half is darker and cooler (we are looking at its inside); the front half is lit and casts a shadow on the statue.
function Ribbon({ id, d, front }: { id: string; d: string; front?: boolean }) {
  const body = front ? ["#ff7a45", "#ff5a24", "#f0481a"] : ["#e2501f", "#c93d12", "#b2330d"];
  return (
    <svg className="enter-ring absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 600 700" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}g`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={body[0]} />
          <stop offset="0.5" stopColor={body[1]} />
          <stop offset="1" stopColor={body[2]} />
        </linearGradient>
        <filter id={`${id}b`} x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="9" /></filter>
        <filter id={`${id}s`} x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="3" /></filter>
        <filter id={`${id}h`} x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.6" /></filter>
      </defs>
      <g transform="rotate(-14 300 436)">
        <path d={d} fill="none" stroke="rgba(255,77,31,0.3)" strokeWidth="64" filter={`url(#${id}b)`} />
        {front && <path d={d} fill="none" stroke="rgba(70,20,0,0.5)" strokeWidth="46" transform="translate(0 16)" filter={`url(#${id}b)`} />}
        <path d={d} fill="none" stroke={front ? "#b02a07" : "#8f2606"} strokeWidth="46" transform="translate(0 4)" />
        <path id={`${id}p`} d={d} fill="none" stroke={`url(#${id}g)`} strokeWidth="42" />
        <path d={d} fill="none" stroke={front ? "rgba(255,196,160,0.75)" : "rgba(255,170,130,0.3)"} strokeWidth="11" transform="translate(0 -11)" filter={`url(#${id}h)`} />
        <path d={d} fill="none" stroke="rgba(120,25,0,0.38)" strokeWidth="9" transform="translate(0 15)" filter={`url(#${id}s)`} />
        <path d={d} fill="none" stroke={front ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)"} strokeWidth="1.4" transform="translate(0 -20.5)" />
        <text id={`${id}t`} fontSize="12.5" fontWeight="700" letterSpacing="3.2" fill="#fff" dy="4.5" style={{ filter: "drop-shadow(0 1px 1px rgba(120,25,0,0.5))" }}>
          <textPath href={`#${id}p`} startOffset="50%" textAnchor="middle">{WORDS}</textPath>
        </text>
      </g>
    </svg>
  );
}

function StandIn() {
  const marble = "url(#mbl)";
  const curls = Array.from({ length: 11 }, (_, i) => {
    const a = (200 + (i * 140) / 10) * (Math.PI / 180);
    return { x: 300 + Math.cos(a) * 98, y: 262 + Math.sin(a) * 104, r: i % 2 ? 25 : 28 };
  });
  const inner = Array.from({ length: 8 }, (_, i) => {
    const a = (212 + (i * 116) / 7) * (Math.PI / 180);
    return { x: 300 + Math.cos(a) * 66, y: 252 + Math.sin(a) * 78 };
  });
  const turn = (px: number, extra = "") => ({ transform: `translateX(calc(var(--yaw) * ${px}px)) ${extra}` });
  return (
    <svg className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,#000_72%,transparent_97%)]" viewBox="0 0 600 700" aria-hidden="true">
      <defs>
        <linearGradient id="mbl" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#ebe6da" />
          <stop offset="1" stopColor="#bdb6a5" />
        </linearGradient>
        <linearGradient id="shade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0.35" stopColor="#2a2118" stopOpacity="0" />
          <stop offset="1" stopColor="#2a2118" stopOpacity="0.36" />
        </linearGradient>
        <linearGradient id="vis" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ff5a24" />
          <stop offset="0.5" stopColor="#ff8a4c" />
          <stop offset="1" stopColor="#e23a0d" />
        </linearGradient>
        <filter id="vein" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.007 0.022" numOctaves="4" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.4  0 0 0 0 0.37  0 0 0 1.1 -0.38" result="v" />
          <feComposite in="v" in2="SourceAlpha" operator="in" result="vi" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="vi" /></feMerge>
        </filter>
        <filter id="glow" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="11" /></filter>
        <clipPath id="headclip"><path d={HEAD} /></clipPath>
      </defs>

      <g filter="url(#vein)">
        {/* shoulders and drape */}
        <g style={turn(7)}>
          <path d="M30 760 C40 604 120 556 226 538 L374 538 C480 556 560 604 570 760 Z" fill={marble} />
          <path d="M30 760 C40 604 120 556 226 538 L374 538 C480 556 560 604 570 760 Z" fill="url(#shade)" />
          <path d="M150 700 C170 640 230 590 330 556 M250 700 C262 650 300 612 372 580 M360 700 C372 664 410 632 470 612" fill="none" stroke="#8c8577" strokeOpacity="0.45" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M226 538 C260 600 340 640 440 626" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* neck */}
        <g style={turn(11)}>
          <path d="M246 440 L236 552 Q300 584 364 552 L354 440 Z" fill={marble} />
          <path d="M246 440 L236 552 Q300 584 364 552 L354 440 Z" fill="url(#shade)" />
          <path d="M252 500 Q300 524 348 500" fill="none" stroke="#8c8577" strokeOpacity="0.4" strokeWidth="2" />
        </g>
        {/* head */}
        <g style={{ ...turn(18, "rotate(calc(var(--yaw) * 2.2deg))"), transformOrigin: "300px 340px" }}>
          <ellipse cx="206" cy="318" rx="10" ry="24" fill={marble} style={{ opacity: "calc(1 - var(--yaw) * 0.9)" }} />
          <ellipse cx="394" cy="318" rx="10" ry="24" fill={marble} style={{ opacity: "calc(1 + var(--yaw) * 0.9)" }} />
          <path d={HEAD} fill={marble} />
          <path d={HEAD} fill="url(#shade)" />
          <g clipPath="url(#headclip)">
            <g style={turn(34)}>
              <path d="M300 318 L300 404" stroke="#fff" strokeOpacity="0.75" strokeWidth="9" strokeLinecap="round" />
              <path d="M312 396 Q300 410 286 398" fill="none" stroke="#8c8577" strokeOpacity="0.55" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M270 436 Q300 448 330 436" fill="none" stroke="#8c8577" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="300" cy="332" rx="108" ry="40" fill="#ff5a24" opacity="0.5" filter="url(#glow)" />
              <g style={{ transformOrigin: "300px 312px", transform: "scaleX(calc(1 - var(--yaw) * var(--yaw) * 0.14))" }}>
                <path d="M192 284 Q300 258 408 284 L404 338 Q300 362 196 338 Z" fill="url(#vis)" />
                <path d="M196 292 Q300 268 404 292" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" />
                <text x="300" y="318" textAnchor="middle" fontSize="12" fontWeight="800" letterSpacing="5" fill="#fff" fillOpacity="0.9">ROUNDHAY</text>
              </g>
            </g>
          </g>
          {/* sculpted curls */}
          <g style={turn(8)}>
            {inner.map((c, i) => <circle key={`i${i}`} cx={c.x} cy={c.y} r="26" fill={marble} stroke="#8c8577" strokeOpacity="0.4" strokeWidth="1.6" />)}
            {curls.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={marble} stroke="#8c8577" strokeOpacity="0.5" strokeWidth="1.8" />)}
            {curls.map((c, i) => <path key={`h${i}`} d={`M${c.x - 10} ${c.y - 4} q10 -12 20 0`} fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2.4" strokeLinecap="round" />)}
          </g>
        </g>
      </g>
    </svg>
  );
}

export function BustStage({ children }: { children?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  // 0 = the look of early film (12 fps, frames dissolve into each other, grain), 1 = clean 60 fps cuts. Starts in the middle.
  const [smooth, setSmooth] = useState(0.5);
  const smoothRef = useRef(0.5);
  const grain = useRef<HTMLDivElement>(null);
  const lines = useRef<SVGSVGElement>(null);
  const faceBox = useRef<HTMLDivElement>(null);
  const faceHook = useRef<{ update: (box: { x: number; y: number; w: number; h: number }) => void } | null>(null);
  useEffect(() => {
    try { const v = parseFloat(localStorage.getItem("rh-fps-v2") ?? ""); if (v >= 0 && v <= 1) { smoothRef.current = v; queueMicrotask(() => setSmooth(v)); } } catch {}
  }, []);
  const onSlide = (v: number) => { setSmooth(v); smoothRef.current = v; try { localStorage.setItem("rh-fps-v2", String(v)); } catch {} };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--yaw", "0.18");
      return;
    }
    const n = bust.frames.length, centre = bust.centre;
    // Only the cursor moves the statue, and only while it is over the hero. Otherwise it holds the REST pose.
    const zone = el.closest("section") ?? el;
    let target = REST, cur = REST, last = 0, raf = 0, running = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      // Scale each side by the room available, so the right-hand turn is reachable even though the statue sits near the right edge.
      const mid = r.left + r.width / 2, d = e.clientX - mid;
      target = Math.max(-1, Math.min(1, d < 0 ? d / (mid * 0.6) : d / ((window.innerWidth - mid) * 0.85)));
    };
    const onLeave = () => { target = REST; };
    let held = REST, acc = 0;
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;
      // Time-based easing, so it feels the same at 60 and 120 Hz.
      cur += (target - cur) * (1 - Math.exp(-dt / 0.16));
      const f = smoothRef.current;
      // The picture only updates at the chosen frame rate (12 fps at the film end, every frame at the smooth end).
      const fps = 12 + f * 48;
      acc += dt;
      if (acc >= 1 / fps || f > 0.97) { acc = 0; held = cur; }
      el.style.setProperty("--yaw", held.toFixed(4));
      if (n) {
        const p = Math.max(0, Math.min(n - 1, centre + held * (held < 0 ? centre : n - 1 - centre)));
        const lo = Math.floor(p);
        // Dissolve between the two nearest frames; toward the smooth end the dissolve is sharpened into a cut.
        const sharp = 1 + f * f * 40;
        // At the clean end there is no dissolve at all: one frame is shown at a time.
        const w = f > 0.95 ? (p - lo >= 0.5 ? 1 : 0) : Math.max(0, Math.min(1, (p - lo - 0.5) * sharp + 0.5));
        imgs.current.forEach((im, i) => {
          if (im) im.style.opacity = i === lo ? (w >= 1 ? "0" : "1") : i === lo + 1 ? String(w) : "0";
        });
      }
      if (faceBox.current && n) {
        const p2 = Math.max(0, Math.min(n - 1, centre + held * (held < 0 ? centre : n - 1 - centre)));
        const i0 = Math.floor(p2), i1 = Math.min(n - 1, i0 + 1);
        const cx = faceTrack.cx[i0] + (faceTrack.cx[i1] - faceTrack.cx[i0]) * (p2 - i0);
        const x = cx - faceTrack.w / 2, y = faceTrack.top, w = faceTrack.w, h = faceTrack.bottom - faceTrack.top;
        const b = faceBox.current.style;
        b.left = `${x * 100}%`; b.top = `${y * 100}%`; b.width = `${w * 100}%`; b.height = `${h * 100}%`;
        faceHook.current?.update({ x, y, w, h });
      }
      if (grain.current) grain.current.style.opacity = String((1 - f) * 0.5);
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    // Don't animate while the hero is mostly scrolled out of view.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.15 });
    io.observe(zone);
    zone.addEventListener("pointermove", onMove as EventListener);
    zone.addEventListener("pointerleave", onLeave);
    return () => { zone.removeEventListener("pointermove", onMove as EventListener); zone.removeEventListener("pointerleave", onLeave); io.disconnect(); stop(); };
  }, []);

  // Each callout card's line runs to something real: the face box (follows the head), the ring (an orbit), the last word of the ring (publish).
  useEffect(() => {
    const el = root.current, svg = lines.current;
    if (!el || !svg) return;
    const NS = "http://www.w3.org/2000/svg";
    let face: { x0: number; y0: number; path: SVGPathElement; ring: SVGCircleElement; dot: SVGCircleElement } | null = null;
    const put = (path: SVGPathElement, ring: SVGCircleElement, dot: SVGCircleElement, x0: number, y0: number, x1: number, y1: number) => {
      path.setAttribute("d", `M${x0} ${y0} Q${(x0 + x1) / 2} ${y0} ${x1} ${y1}`);
      for (const c of [ring, dot]) { c.setAttribute("cx", String(x1)); c.setAttribute("cy", String(y1)); }
    };
    const draw = () => {
      svg.replaceChildren();
      face = null;
      const rr = el.getBoundingClientRect();
      el.querySelectorAll<HTMLElement>("[data-callout]").forEach((card) => {
        const cr = card.getBoundingClientRect();
        if (cr.width === 0) return; // hidden on small screens
        const x0 = cr.left - rr.left, y0 = cr.top - rr.top + cr.height / 2;
        let x1 = 0, y1 = 0;
        const kind = card.dataset.target;
        if (kind === "ring") { x1 = 0.966 * rr.width; y1 = 0.523 * rr.height; } // the right-hand sweep of the ring
        else if (kind === "publish") {
          // the end of the last letter of the ring's text: "PUBLISH"
          const text = document.getElementById("rft") as unknown as SVGTextContentElement | null;
          const ctm = (text as unknown as SVGGraphicsElement | null)?.getScreenCTM();
          if (!text || !ctm) return;
          const pt = text.getEndPositionOfChar(text.getNumberOfChars() - 1).matrixTransform(ctm);
          x1 = pt.x - rr.left; y1 = pt.y - rr.top;
        } else { x1 = 0.6 * rr.width; y1 = 0.3 * rr.height; }
        const path = document.createElementNS(NS, "path");
        path.setAttribute("fill", "none"); path.setAttribute("stroke", "rgba(13,13,14,0.4)"); path.setAttribute("stroke-width", "1.25");
        const ring = document.createElementNS(NS, "circle");
        ring.setAttribute("r", "9"); ring.setAttribute("fill", "rgba(255,255,255,0.55)"); ring.setAttribute("stroke", "rgba(13,13,14,0.35)");
        const dot = document.createElementNS(NS, "circle");
        dot.setAttribute("r", "4"); dot.setAttribute("fill", "#ff4d1f");
        put(path, ring, dot, x0, y0, x1, y1);
        svg.append(path, ring, dot);
        if (kind === "face") { face = { x0, y0, path, ring, dot }; ring.setAttribute("r", "0"); } // the box itself marks the end of this line
      });
    };
    draw();
    faceHook.current = {
      update: (box) => {
        if (!face) return;
        const rr = el.getBoundingClientRect();
        put(face.path, face.ring, face.dot, face.x0, face.y0, (box.x + box.w) * rr.width, box.y * rr.height);
      },
    };
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    window.addEventListener("resize", draw);
    document.fonts?.ready.then(draw);
    return () => { ro.disconnect(); window.removeEventListener("resize", draw); faceHook.current = null; };
  }, []);

  return (
    <div ref={root} className="relative mx-auto aspect-[6/7] w-full lg:-mt-14 max-w-[min(700px,calc((100svh_-_4.5rem)*0.857))]" style={{ ["--yaw" as string]: 0 }}>
      <div className="enter-statue absolute inset-0">
      <Ribbon id="rb" d={BACK} />
      {bust.frames.length ? (
        bust.frames.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} ref={(el) => { imgs.current[i] = el; }} src={src} alt="" className="absolute inset-0 h-full w-full object-contain [mask-image:linear-gradient(to_bottom,#000_74%,transparent_98%)]" style={{ opacity: i === REST_FRAME ? 1 : 0 }} />
        ))
      ) : (
        <StandIn />
      )}
      <div ref={grain} className="film-grain pointer-events-none absolute inset-[8%] z-[5] [mask-image:radial-gradient(closest-side,#000_55%,transparent)]" aria-hidden="true" />
      <Ribbon id="rf" d={FRONT} front />
      <div ref={faceBox} className="pointer-events-none absolute z-20" style={{ left: `${(faceTrack.cx[REST_FRAME] - faceTrack.w / 2) * 100}%`, top: `${faceTrack.top * 100}%`, width: `${faceTrack.w * 100}%`, height: `${(faceTrack.bottom - faceTrack.top) * 100}%` }} aria-hidden="true">
        {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((c) => (
          <span key={c} className={`absolute h-4 w-4 border-safelight ${c}`} />
        ))}
        <span className="absolute left-0 top-full mt-2 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white shadow-[0_6px_18px_rgba(0,0,0,0.25)]">
          <Icon name="lock" size={10} className="text-safelight" /> Mara Quill · locked
        </span>
      </div>
      </div>
      <svg ref={lines} className="enter-fade [--d:0.5s] pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible" aria-hidden="true" />
      {children}
      <label className="enter-fade [--d:0.5s] absolute -bottom-2 left-1/2 z-30 hidden w-[min(22rem,90%)] -translate-x-1/2 items-center gap-3 rounded-full border border-white/80 bg-white/70 py-2 pl-4 pr-5 text-[11px] shadow-[0_10px_34px_rgba(40,20,10,0.1)] backdrop-blur-xl sm:flex">
        <span className="shrink-0 font-semibold">Frame rate</span>
        <input type="range" min={0} max={1} step={0.01} value={smooth} onChange={(e) => onSlide(parseFloat(e.target.value))} aria-label="Frame rate: from 12 frames per second, as in 1888, to smooth 60" aria-valuetext={`${Math.round(12 + smooth * 48)} frames per second`} className="min-w-0 flex-1 accent-[#ff4d1f]" />
        <span className="w-[4.6rem] shrink-0 text-right tabular-nums text-ink/60">{Math.round(12 + smooth * 48)} fps{smooth < 0.05 ? " · 1888" : smooth > 0.95 ? " · cuts" : ""}</span>
      </label>
    </div>
  );
}
