"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Clip } from "@/components/clip";
import { Reveal } from "@/components/reveal";

// A running timecode (hh:mm:ss:ff at 24 fps), written straight into the element so it never re-renders the page.
function Timecode({ run }: { run: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now() - 7500; // it joins the take part way through
    let raf = 0, lastFrame = -1;
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = (t: number) => {
      const frames = Math.floor(((t - start) / 1000) * 24);
      if (frames !== lastFrame) {
        lastFrame = frames;
        const s = Math.floor(frames / 24);
        el.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(frames % 24)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  return <span ref={ref} className="tabular-nums">00:00:07:12</span>;
}

// Frames from the other clips, scattered round the section in three layers so it has depth. Far frames are small,
// dim and soft, and sit behind the words; mid frames are in between; near frames are big and sharp in the corners and
// pass in front of everything. Each layer also shifts with the cursor by a different amount (near moves most).
// Positions are percentages of the section so they keep their places at any width; some are cropped by the edges on
// purpose. Phones get the four near ones.
type Depth = 0 | 1 | 2;
const layer: Record<Depth, { z: string; look: string; shift: number; ring: string }> = {
  0: { z: "-z-20", look: "opacity-45 blur-[2px] brightness-75", shift: 5, ring: "ring-white/5" },
  1: { z: "-z-10", look: "opacity-70 blur-[0.6px]", shift: 14, ring: "ring-white/10" },
  2: { z: "z-[1]", look: "opacity-95", shift: 30, ring: "ring-white/20" },
};
// Deliberately uneven: different shapes and sizes, overlapping in clumps, cropped by the edges, a couple tucked behind
// the words. Each also drifts on its own path (dx, dy in px, one period, one phase) so they never move in step.
const tiles: { n: number; d: Depth; cls: string; ratio: string; dx: number; dy: number; dur: number; delay: number }[] = [
  // left clump: a tall frame, a wide one overlapping it, one under both
  { n: 4, d: 2, cls: "left-[-8%] top-[2%] w-[28vw] lg:left-[-2%] lg:top-[5%] lg:w-[12vw]", ratio: "aspect-[3/4]", dx: 14, dy: 10, dur: 11, delay: 0 },
  { n: 7, d: 2, cls: "left-[-9%] bottom-[7%] w-[28vw] lg:left-[4%] lg:top-[30%] lg:bottom-auto lg:w-[13vw]", ratio: "aspect-[4/3]", dx: -12, dy: 16, dur: 9.5, delay: -3 },
  { n: 3, d: 1, cls: "max-lg:hidden lg:left-[15%] lg:top-[58%] lg:w-[10vw]", ratio: "aspect-square", dx: 18, dy: -12, dur: 13, delay: -6 },
  { n: 8, d: 2, cls: "max-lg:hidden lg:left-[-3%] lg:bottom-[-8%] lg:w-[15vw]", ratio: "aspect-[4/3]", dx: -16, dy: -10, dur: 10, delay: -5 },
  // right clump
  { n: 5, d: 2, cls: "right-[-9%] top-[9%] w-[26vw] lg:right-[-5%] lg:top-[6%] lg:w-[12vw]", ratio: "aspect-[4/5]", dx: -13, dy: 12, dur: 12.5, delay: -1 },
  { n: 9, d: 1, cls: "max-lg:hidden lg:right-[8%] lg:top-[34%] lg:w-[12vw]", ratio: "aspect-[4/3]", dx: 15, dy: 11, dur: 9, delay: -7 },
  { n: 2, d: 2, cls: "right-[-7%] bottom-[2%] w-[24vw] lg:right-[2%] lg:top-[48%] lg:bottom-auto lg:w-[12vw]", ratio: "aspect-square", dx: -18, dy: -14, dur: 11, delay: -4 },
  // far: behind the words, small and dim
  { n: 1, d: 0, cls: "max-lg:hidden lg:left-[22%] lg:top-[20%] lg:w-[8vw]", ratio: "aspect-[3/4]", dx: 10, dy: 14, dur: 12, delay: -2 },
  { n: 6, d: 0, cls: "max-lg:hidden lg:right-[24%] lg:top-[22%] lg:w-[10vw]", ratio: "aspect-[4/3]", dx: 9, dy: -12, dur: 14, delay: -9 },
];

export function ClosingSection() {
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    // The cursor sets --mx and --my (-1 to 1 across the section); each layer reads them with its own strength.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || still) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    };
    el.addEventListener("pointermove", onMove);
    return () => { io.disconnect(); cancelAnimationFrame(raf); el.removeEventListener("pointermove", onMove); };
  }, []);

  const word = "display text-[clamp(2.7rem,12vw,4.4rem)] leading-[0.92] lg:text-[clamp(3rem,6.1vw,7rem)]";

  return (
    <section ref={root} className="relative isolate my-12 overflow-hidden bg-night text-bone sm:my-20">
      {/* frames at three depths: behind the words, beside them, and in front */}
      {tiles.map((t) => {
        const L = layer[t.d];
        return (
          <div
            key={t.n}
            aria-hidden="true"
            className={`pointer-events-none absolute ${L.z} ${t.ratio} ${t.cls}`}
            style={{ transform: `translate3d(calc(var(--mx, 0) * -${L.shift}px), calc(var(--my, 0) * -${Math.round(L.shift * 0.6)}px), 0)`, transition: "transform 600ms cubic-bezier(.2,.7,.2,1)" }}
          >
            <div
              className={`drift h-full w-full overflow-hidden rounded-2xl ring-1 ${L.ring} ${t.d === 2 ? "shadow-[0_30px_70px_rgba(0,0,0,0.65)]" : "shadow-[0_16px_40px_rgba(0,0,0,0.45)]"}`}
              style={{ animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s`, ["--dx" as string]: `${t.dx}px`, ["--dy" as string]: `${t.dy}px` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/media/rail/rail-${t.n}.jpg`} alt="" loading="lazy" className={`h-full w-full object-cover ${L.look}`} />
            </div>
          </div>
        );
      })}

      {/* the glow the take is lit by */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,77,31,0.2),transparent)]" />

      {/* the roll of film running through the whole section: dark stock with its perforations moving up */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-[80vw] -translate-x-1/2 sm:w-[min(22rem,90vw)] border-x border-white/10 bg-[#0d0d0f]">
        {[0, 1].map((side) => (
          <span
            key={side}
            className={`reel-holes absolute inset-y-0 w-2 sm:w-3 ${side ? "right-1.5 sm:right-3" : "left-1.5 sm:left-3"}`}
            style={{ backgroundImage: "repeating-linear-gradient(180deg, transparent 0 13px, rgba(243,240,233,0.78) 13px 29px, transparent 29px 44px)", backgroundSize: "100% 44px" }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <h2 className="sr-only">Roll camera.</h2>
        <div className="grid items-center gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-12">
          <Reveal className={`${word} text-center lg:text-right`} aria-hidden="true">ROLL</Reveal>

          {/* the frame that is "in the gate" */}
          <Reveal delay={120} y={36} scale={0.96} className="relative mx-auto w-[min(11.5rem,50vw)] sm:w-[13rem] lg:w-[15rem]">
            <div className="relative aspect-[5/6] overflow-hidden rounded-[6px] bg-night-2 shadow-[0_30px_90px_rgba(0,0,0,0.6)] ring-1 ring-white/15">
              <Clip src="/media/rail/rail-6.mp4" poster="/media/rail/rail-6.jpg" play={visible} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
            </div>
            {/* viewfinder corners just outside the frame */}
            {["-left-3 -top-3 border-l-2 border-t-2", "-right-3 -top-3 border-r-2 border-t-2", "-bottom-3 -left-3 border-b-2 border-l-2", "-bottom-3 -right-3 border-b-2 border-r-2"].map((c) => (
              <span key={c} aria-hidden="true" className={`absolute h-4 w-4 border-safelight ${c}`} />
            ))}
            <p className="mt-4 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-bone/70" aria-hidden="true">
              <span className="h-2 w-2 animate-pulse rounded-full bg-safelight" /> Rec <Timecode run={visible} />
            </p>
          </Reveal>

          <Reveal delay={200} className={`${word} text-center text-safelight lg:text-left`} aria-hidden="true">CAMERA.</Reveal>
        </div>

        <Reveal delay={300} y={24} className="mt-9 flex flex-col items-center gap-4 text-center lg:mt-11">
          <Link href="/signup" className="btn btn-primary px-9 py-[1.1rem] text-base shadow-[0_14px_40px_rgba(255,77,31,0.35)] max-sm:px-6 max-sm:py-3 max-sm:text-sm">
            Try Roundhay <Icon name="arrow" size={16} />
          </Link>
          <p className="max-w-[12rem] text-sm text-bone/75 sm:max-w-[17rem] sm:text-base">60 free credits, no card. About a minute of footage.</p>
        </Reveal>
      </div>
    </section>
  );
}
