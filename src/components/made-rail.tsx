"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { RailGlyph, type GlyphName } from "@/components/rail-glyph";
import { MediaSlot } from "@/components/media-slot";
import { media } from "@/lib/media";
import type { SceneKey } from "@/lib/mock";

type Item = { slot: string; scene: SceneKey; label: string; glyph: GlyphName; title: string; by: string; model: string };

// A card's clip: the poster always, the video only while the card is near the middle of the wall, so at most
// five play at once and the rest cost nothing. Reduced motion keeps every card on its poster.
function RailClip({ src, poster, play }: { src: string; poster?: string; play: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (play && !still) v.play().catch(() => {});
    else v.pause();
  }, [play]);
  return <video ref={ref} className="h-full w-full object-cover" src={src} poster={poster} muted loop playsInline preload={play ? "auto" : "none"} aria-hidden="true" />;
}

const items: Item[] = [
  { slot: "rail-1", scene: "alley", label: "Faceless channels", glyph: "voice", title: "Two chairs, one lamp", by: "nightfeed", model: "Seedance 2.0" },
  { slot: "rail-2", scene: "dunes", label: "Travel b-roll", glyph: "dunes", title: "Golden hour over the Sahara", by: "wander.loop", model: "Veo 3.1" },
  { slot: "rail-3", scene: "bottle", label: "Product ads", glyph: "bottle", title: "Amber bottle, one take", by: "clarastudio", model: "Veo 3.1" },
  { slot: "rail-4", scene: "subway", label: "Short film", glyph: "clap", title: "The last train home", by: "casefile.gen", model: "Kling 3.0" },
  { slot: "rail-5", scene: "lighthouse", label: "Animation", glyph: "ghost", title: "Lighthouse before the storm", by: "salt.and.ink", model: "MiniMax H3" },
  { slot: "rail-6", scene: "door", label: "Micro drama", glyph: "door", title: "Door at the end of the hall", by: "overheard.ai", model: "Seedance 2.0" },
  { slot: "rail-7", scene: "skyline", label: "City b-roll", glyph: "city", title: "Skyline, windows coming on", by: "rooftop.reel", model: "Wan 3.0" },
  { slot: "rail-8", scene: "forest", label: "Series", glyph: "stack", title: "Fog in the pines", by: "wander.loop", model: "Veo 3.1" },
  { slot: "rail-9", scene: "table", label: "True crime", glyph: "lens", title: "Rain-soaked alley, ep. 14", by: "casefile.gen", model: "Seedance 2.0" },
];

const N = items.length;
const REACH = 3;

// The top and bottom edges of the wall, in --u units, from the same geometry as the tiles: a point on the cylinder at
// angle a sits at x = 52 tan(a) and the half-height 11.4 grows by 1 / cos(a). Drawn as thin lines so both edges read as one arc.
const arcPath = (sign: 1 | -1) => {
  const pts: string[] = [];
  for (let d = -64; d <= 64; d += 2) {
    const a = (d * Math.PI) / 180;
    pts.push(`${(52 * Math.tan(a)).toFixed(2)} ${(16.4 + sign * (11.4 / Math.cos(a))).toFixed(2)}`);
  }
  return "M" + pts.join(" L");
};
const TOP_ARC = arcPath(-1);
const BOTTOM_ARC = arcPath(1); // tiles shown either side of the active one

/*
  A curved carousel built as one continuous wall: the tiles are panels on the inside of a cylinder seen from its
  axis, so their edges meet in a smooth arc and the ones at the sides are larger and lean inward.
  Everything is measured in --u (about 1vw): a tile is 19u wide and 22.8u tall, the cylinder radius and the camera
  distance are 52u, and each step turns the wall by 21.6 degrees, which makes neighbouring tiles meet with a small gap.
  The labels are a separate flat layer, placed on the arc's lower edge with CSS trigonometry so they stay readable.
  It glides on its own at a steady speed and never stops (not even under the pointer). Dragging, sideways scroll and
  the arrows steer it, then it eases back to the glide. The position is written straight to the elements every
  frame, so React does not re-render while it moves.
*/
export function MadeRail() {
  const GLIDE = 0.28; // tiles per second
  const [active, setActive] = useState(3);
  const [entered, setEntered] = useState(false);
  const [short, setShort] = useState(false); // phone: a shorter placeholder so it never overflows
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setShort(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const [dragging, setDragging] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  // pos is the carousel's position in tiles; vel its speed; tween an eased move to a target position (arrows, tile clicks).
  const st = useRef({ pos: 3, vel: GLIDE, tween: null as number | null, grab: false, last: 0, raf: 0, seen: true, shown: 3 });
  const press = useRef<{ x: number; pos: number; lastX: number; lastT: number; v: number; moved: boolean } | null>(null);
  const moved = useRef(false);

  const rel = (i: number, pos: number) => {
    let k = (((i - pos) % N) + N) % N;
    if (k > N / 2) k -= N;
    return k;
  };
  const tilePx = () => (tiles.current[0]?.offsetWidth ?? 270) * 1.05;
  const go = (d: number) => { const s = st.current; s.tween = (s.tween ?? s.pos) + d; };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const s = st.current;
    const base = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : GLIDE;
    s.vel = base;

    const apply = () => {
      for (let i = 0; i < N; i++) {
        const k = rel(i, s.pos);
        const op = Math.max(0, Math.min(1, REACH + 0.6 - Math.abs(k))).toFixed(3);
        const t = tiles.current[i], l = labels.current[i];
        if (t) { t.style.setProperty("--k", k.toFixed(4)); t.style.opacity = op; t.style.pointerEvents = Number(op) > 0.3 ? "auto" : "none"; }
        if (l) { l.style.setProperty("--k", k.toFixed(4)); l.style.opacity = op; }
      }
      const a = ((Math.round(s.pos) % N) + N) % N;
      if (a !== s.shown) { s.shown = a; setActive(a); }
    };
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - s.last) / 1000 || 0.016);
      s.last = t;
      if (!s.grab) {
        if (s.tween !== null) {
          const d = s.tween - s.pos;
          s.pos += d * (1 - Math.exp(-dt / 0.15));
          if (Math.abs(d) < 0.003) { s.pos = s.tween; s.tween = null; }
        } else {
          s.vel += (base - s.vel) * (1 - Math.exp(-dt / 0.8)); // after a flick, ease back to the steady glide
          s.pos += s.vel * dt;
        }
      }
      apply();
      s.raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!s.raf) { s.last = performance.now(); s.raf = requestAnimationFrame(tick); } };
    const stop = () => { cancelAnimationFrame(s.raf); s.raf = 0; };
    // Only runs while on screen and the tab is visible; it never pauses for the pointer.
    let swung = false;
    const io = new IntersectionObserver(([e]) => {
      s.seen = e.isIntersecting;
      if (s.seen && !document.hidden) start(); else stop();
      // The first time it is properly in view, the wall swings round into place instead of just appearing.
      if (!swung && e.intersectionRatio >= 0.3) {
        swung = true;
        setEntered(true);
        if (base !== 0) { const home = s.pos; s.pos = home - 2.4; s.tween = home; }
      }
    }, { threshold: [0.05, 0.3] });
    io.observe(el);
    const vis = () => { if (document.hidden) stop(); else if (s.seen) start(); };
    document.addEventListener("visibilitychange", vis);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    // Sideways scroll steers it; plain vertical wheel still scrolls the page.
    const onWheel = (e: WheelEvent) => {
      const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
      if (dx === 0 || (!e.shiftKey && Math.abs(dx) <= Math.abs(e.deltaY))) return;
      e.preventDefault();
      s.tween = null;
      s.pos += dx / (tilePx() * 1.2);
    };
    el.addEventListener("keydown", onKey);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { stop(); io.disconnect(); document.removeEventListener("visibilitychange", vis); el.removeEventListener("keydown", onKey); el.removeEventListener("wheel", onWheel); };
  }, []);

  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    press.current = { x: e.clientX, pos: st.current.pos, lastX: e.clientX, lastT: performance.now(), v: 0, moved: false };
    moved.current = false;
    wall.current?.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const p = press.current;
    if (!p) return;
    const dx = e.clientX - p.x;
    if (!p.moved && Math.abs(dx) < 5) return;
    if (!p.moved) { p.moved = true; moved.current = true; st.current.grab = true; st.current.tween = null; setDragging(true); }
    const now = performance.now();
    p.v = (-(e.clientX - p.lastX) / tilePx()) / (Math.max(1, now - p.lastT) / 1000); // tiles per second
    p.lastX = e.clientX; p.lastT = now;
    st.current.pos = p.pos - dx / tilePx();
  };
  const onUp = () => {
    const p = press.current;
    press.current = null;
    if (!p?.moved) return;
    st.current.grab = false;
    st.current.vel = Math.max(-3, Math.min(3, p.v)); // keep the flick's speed, then ease back to the glide
    setDragging(false);
  };

  const cur = items[active];

  return (
    <section>
      <div className="relative overflow-hidden bg-night pb-14 pt-16 text-bone sm:pt-24">
        <div className="pointer-events-none absolute left-1/2 top-[3rem] h-[22rem] w-[min(56rem,90%)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,77,31,0.14),transparent)]" aria-hidden="true" />
        <Reveal as="h2" className="display relative z-10 mx-auto max-w-5xl px-5 text-center text-[clamp(1.9rem,4.6vw,4rem)]">
          Shot on <span className="text-safelight">Roundhay</span>
        </Reveal>

        <div
          ref={root}
          role="group"
          aria-roledescription="carousel"
          aria-label="Clips made on Roundhay"
          tabIndex={0}
          className={`relative -mt-[calc(var(--u)*3.2)] outline-none transition-opacity duration-[1100ms] ease-out [--u:2.4vw] sm:[--u:1.5vw] lg:[--u:min(1vw,1.2rem)] focus-visible:ring-2 focus-visible:ring-safelight/60 ${entered ? "opacity-100" : "opacity-0"}`}
        >
          <div className="relative h-[calc(var(--u)*34+4.5rem)]">
            {/* the wall */}
            <div
              ref={wall}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onClickCapture={(e) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); moved.current = false; } }}
              className={`absolute inset-0 select-none [touch-action:pan-y] ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
              style={{ perspective: "calc(52 * var(--u))", perspectiveOrigin: "50% calc(16.4 * var(--u))" }}
            >
              <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: "translateZ(calc(52 * var(--u)))" }}>
                {items.map((it, i) => {
                  const k = rel(i, 3);
                  return (
                    <button
                      key={it.slot}
                      ref={(el) => { tiles.current[i] = el; }}
                      type="button"
                      onClick={() => { const s = st.current; s.tween = s.pos + rel(i, s.pos); }}
                      tabIndex={-1}
                      aria-label={`Show ${it.title}`}
                      draggable={false}
                      className="absolute left-1/2 block overflow-hidden bg-night-2"
                      style={{
                        ["--k" as string]: k,
                        top: "calc(5 * var(--u))",
                        width: "calc(19 * var(--u))",
                        aspectRatio: "5 / 6",
                        transform: "translateX(-50%) rotateY(calc(var(--k) * -21.6deg)) translateZ(calc(-52 * var(--u)))",
                        opacity: Math.max(0, Math.min(1, REACH + 0.6 - Math.abs(k))),
                      }}
                    >
                      {media[it.slot] ? (
                        <RailClip src={media[it.slot].src} poster={media[it.slot].poster} play={Math.abs(rel(i, active)) <= 2} />
                      ) : (
                        <MediaSlot slot={it.slot} fallback={it.scene} playing={i === active} className="!rounded-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* the labels, flat, on the lower edge of the arc */}
            {items.map((it, i) => {
              const k = rel(i, 3);
              const on = i === active;
              return (
                <div
                  key={it.slot}
                  ref={(el) => { labels.current[i] = el; }}
                  className="pointer-events-none absolute z-[8] flex -translate-x-1/2 flex-col items-center"
                  style={{
                    ["--k" as string]: k,
                    left: "calc(50% + 52 * var(--u) * tan(calc(var(--k) * 21.6deg)))",
                    top: "calc(16.4 * var(--u) + 11.4 * var(--u) / cos(calc(var(--k) * 21.6deg)))",
                    opacity: Math.max(0, Math.min(1, REACH + 0.6 - Math.abs(k))),
                  }}
                  aria-hidden="true"
                >
                  <RailGlyph name={it.glyph} on={on} />
                  <span className={`mt-2.5 whitespace-nowrap text-[15px] font-semibold ${on ? "text-safelight" : "text-bone"}`}>{it.label}</span>
                </div>
              );
            })}

            {/* thin lines along the top and bottom edges of the wall */}
            <svg viewBox="-60 -2 120 48" className="pointer-events-none absolute left-1/2 z-[5] -translate-x-1/2 overflow-visible" style={{ width: "calc(120 * var(--u))", height: "calc(48 * var(--u))", top: "calc(-2 * var(--u))" }} aria-hidden="true">
              <defs>
                <linearGradient id="arcg" x1="0" x2="1">
                  <stop offset="0" stopColor="#ff4d1f" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#ff4d1f" />
                  <stop offset="1" stopColor="#ff4d1f" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={TOP_ARC} fill="none" stroke="url(#arcg)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
              <path d={BOTTOM_ARC} fill="none" stroke="url(#arcg)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" opacity="0.8" />
            </svg>

            {/* the ends fade into the page */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[9%] bg-gradient-to-r from-night via-night/80 to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[9%] bg-gradient-to-l from-night via-night/80 to-transparent" aria-hidden="true" />

            {/* arrows: larger screens only; on a phone the wall just glides and drags */}
            <button type="button" onClick={() => go(-1)} aria-label="Previous" className="absolute left-3 top-[calc(16.4*var(--u)-1.4rem)] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-lg transition-transform hover:scale-105 max-sm:hidden sm:left-5">
              <Icon name="chevron" size={18} className="rotate-180" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next" className="absolute right-3 top-[calc(16.4*var(--u)-1.4rem)] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-lg transition-transform hover:scale-105 max-sm:hidden sm:right-5">
              <Icon name="chevron" size={18} />
            </button>
          </div>
        </div>

        <Reveal delay={200} y={20} className="mx-auto mt-2 flex max-w-2xl flex-col items-center px-5 text-center" aria-live="polite">
          <p className="text-sm text-bone/60">
            <span className="font-semibold text-bone">{cur.title}</span> · @{cur.by} · {cur.model}
          </p>
          <form action="/create" className="mt-6 flex w-full items-center gap-2 rounded-full bg-night-2 py-2 pl-5 pr-2 ring-1 ring-white/10 focus-within:ring-white/30">
            <Icon name="spark" size={18} className="shrink-0 text-safelight" />
            <label htmlFor="rail-prompt" className="sr-only">Describe a clip</label>
            <input id="rail-prompt" name="prompt" type="text" placeholder={short ? "Describe a scene…" : "Describe a scene and Roundhay shoots it…"} className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-bone outline-none placeholder:text-bone/40" />
            <button type="submit" className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-safelight text-sm font-semibold text-white transition-colors hover:bg-safelight-soft max-sm:w-11 sm:px-5">
              <span className="max-sm:sr-only">Create</span> <Icon name="arrow" size={16} />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
