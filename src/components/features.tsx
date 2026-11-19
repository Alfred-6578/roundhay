"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Clip } from "@/components/clip";
import { Reveal } from "@/components/reveal";

const tabs = [
  { id: "cast", n: "01", title: "Lock a character once.", body: "Save a reference or keep a frame you like. The face, the coat, the build carry through every clip, so you stop re-rolling the narrator.", cta: "Start a cast" },
  { id: "camera", n: "02", title: "Direct the move.", body: "Pick a dolly, a crane or an orbit from a list instead of hoping the model guesses. Same shot, different move, seconds apart.", cta: "Try the camera" },
  { id: "batch", n: "03", title: "Write the week on Sunday.", body: "Queue up to twenty episodes against the same cast, set a date for each, and let it render overnight.", cta: "Open the queue" },
] as const;
type TabId = (typeof tabs)[number]["id"];

const moves = [
  { id: "static", label: "Static", icon: "m-static" },
  { id: "dolly-in", label: "Dolly in", icon: "m-dolly-in" },
  { id: "pan-right", label: "Pan right", icon: "m-pan-right" },
  { id: "orbit", label: "Orbit", icon: "m-orbit" },
  { id: "crane", label: "Crane up", icon: "m-crane" },
  { id: "handheld", label: "Handheld", icon: "m-handheld" },
] as const;

// Episodes in the queue: a poster each, so the list looks like a real project.
const queue = [
  { ep: "Ep. 15", title: "The flooded platform", poster: "/media/rail/rail-4.jpg", when: "Tonight" },
  { ep: "Ep. 16", title: "The door into daylight", poster: "/media/rail/rail-6.jpg", when: "Thu 19 Nov" },
  { ep: "Ep. 17", title: "Two chairs, one lamp", poster: "/media/rail/rail-1.jpg", when: "Sat 21 Nov" },
  { ep: "Ep. 18", title: "Fog in the pines", poster: "/media/rail/rail-8.jpg", when: "Mon 23 Nov" },
];

// Viewfinder furniture, the same on every stage: corner brackets, a recording dot and the model.
function Viewfinder({ label }: { label: string }) {
  const corner = "absolute h-5 w-5 border-white/80";
  return (
    <div className="pointer-events-none absolute inset-4 z-20 sm:inset-5" aria-hidden="true">
      <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2 max-sm:hidden`} />
      <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2 max-sm:hidden`} />
      <span className="absolute left-7 top-0 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/85">
        <span className="h-2 w-2 animate-pulse rounded-full bg-safelight" /> Rec
      </span>
      <span className="absolute right-7 top-0 font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">{label}</span>
    </div>
  );
}

export function Features() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const [move, setMove] = useState<(typeof moves)[number]["id"]>("dolly-in");
  const [done, setDone] = useState(0); // episodes finished in the queue demo
  const [pct, setPct] = useState(12);
  const root = useRef<HTMLElement>(null);
  const tab: TabId = tabs[i].id;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // camera tab: step through the moves on its own until the visitor picks one
  useEffect(() => {
    if (tab !== "camera" || !visible || !auto) return;
    const t = setInterval(() => setMove((m) => moves[(moves.findIndex((x) => x.id === m) + 1) % moves.length].id), 2600);
    return () => clearInterval(t);
  }, [tab, visible, auto]);

  // queue tab: the first episode renders, then the next one starts
  useEffect(() => {
    if (tab !== "batch" || !visible) return;
    const t = setInterval(() => {
      setPct((p) => {
        if (p >= 100) { setDone((d) => (d >= queue.length - 1 ? 0 : d + 1)); return 8; }
        return Math.min(100, p + 4 + Math.random() * 5);
      });
    }, 260);
    return () => clearInterval(t);
  }, [tab, visible]);

  const pick = (n: number) => { setI(n); setAuto(false); };
  const next = () => setI((n) => (n + 1) % tabs.length);

  return (
    <section ref={root} id="how" className="scroll-mt-4 px-4 pb-28 pt-16 sm:px-8 sm:pb-36 sm:pt-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,31rem)] lg:gap-20 xl:grid-cols-[1fr_minmax(0,35rem)]">
        {/* the three ideas, one open at a time */}
        <ol className="order-2 lg:order-1">
          {tabs.map((t, n) => {
            const on = n === i;
            return (
              <Reveal as="li" key={t.id} delay={n * 110} y={22} className="border-t border-ink/15 last:border-b">
                <button type="button" onClick={() => pick(n)} aria-expanded={on} className="group flex w-full items-baseline gap-4 py-5 text-left sm:gap-6 sm:py-8">
                  <span className={`w-5 shrink-0 font-mono text-xs tracking-[0.14em] transition-colors ${on ? "text-safelight" : "text-ink/35"}`}>{t.n}</span>
                  <span className={`display text-[clamp(1.7rem,3.4vw,3.2rem)] leading-[1.02] max-sm:text-[clamp(1.2rem,5.6vw,1.6rem)] transition-colors ${on ? "text-ink" : "text-ink/30 group-hover:text-ink/60"}`}>{t.title}</span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <div className="pb-6 pl-9 sm:pl-11">
                      <p className="max-w-md text-lg leading-relaxed text-ink/65 max-sm:text-base">{t.body}</p>
                      <Link href="/signup" className="btn btn-line-ink mt-6" tabIndex={on ? 0 : -1}>{t.cta} <Icon name="arrow" size={15} /></Link>
                    </div>
                  </div>
                </div>
                {/* the clock for this idea: fills, then the next one opens */}
                <div className="h-px bg-transparent">
                  {on && auto && (
                    <div
                      key={`${i}-${visible}`}
                      className="h-px origin-left bg-safelight [animation:fill_9s_linear_forwards] motion-reduce:hidden"
                      style={{ animationPlayState: visible ? "running" : "paused" }}
                      onAnimationEnd={next}
                    />
                  )}
                </div>
              </Reveal>
            );
          })}
        </ol>

        {/* the stage: a portrait frame, whatever the idea is, so the page doesn't jump */}
        <Reveal delay={120} y={40} scale={0.97} className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-[5/6] w-full max-w-[34rem] overflow-hidden rounded-[28px] bg-night sm:rounded-[36px]">
            {/* cast */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${tab === "cast" ? "opacity-100" : "opacity-0"}`}>
              <Clip src="/media/rail/rail-9.mp4" poster="/media/rail/rail-9.jpg" play={tab === "cast" && visible} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
              {/* the lock follows the face */}
              <div className="absolute left-[40.5%] top-[49%] z-10 h-[17%] w-[16%]">
                <span className="absolute inset-0 rounded-md border-2 border-safelight shadow-[0_0_24px_rgba(255,77,31,.55)]" />
                <span className="absolute -top-7 left-0 flex items-center gap-1 whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-safelight"><Icon name="lock" size={11} /> Mara Quill</span>
              </div>
              <div className="absolute inset-x-4 bottom-4 z-10 sm:inset-x-10 sm:bottom-10">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/55">Same face, same coat</p>
                <div className="grid grid-cols-4 gap-2">
                  {[["Ep. 12", "50% 30%", 1], ["Ep. 13", "62% 40%", 1.5], ["Ep. 14", "40% 25%", 1.25], ["Ep. 15", "55% 45%", 1.7]].map(([ep, pos, z]) => (
                    <div key={ep as string} className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/media/rail/rail-9.jpg" alt="" className="h-full w-full object-cover" style={{ objectPosition: pos as string, transform: `scale(${z})` }} loading="lazy" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/55 px-1.5 py-1 font-mono text-[10px] text-white/80">{ep as string}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Viewfinder label="Cast locked" />
            </div>

            {/* camera */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${tab === "camera" ? "opacity-100" : "opacity-0"}`}>
              <div className="mv absolute inset-0" data-move={move}>
                <Clip src="/media/rail/rail-2.mp4" poster="/media/rail/rail-2.jpg" play={tab === "camera" && visible} />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              <div className="absolute inset-x-4 bottom-4 z-10 sm:inset-x-10 sm:bottom-10">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/55">Camera · {moves.find((m) => m.id === move)?.label}</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {moves.map((m) => {
                    const sel = m.id === move;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        tabIndex={tab === "camera" ? 0 : -1}
                        onClick={() => { setMove(m.id); setAuto(false); }}
                        className={`flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-2.5 text-xs font-medium backdrop-blur-md transition-colors ${sel ? "bg-safelight text-white" : "bg-black/45 text-white/85 hover:bg-black/60"}`}
                      >
                        <Icon name={m.icon as never} size={14} /> {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <Viewfinder label="Veo 3.1 · 4K" />
            </div>

            {/* batch */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${tab === "batch" ? "opacity-100" : "opacity-0"}`}>
              <Clip src="/media/rail/rail-7.mp4" poster="/media/rail/rail-7.jpg" play={tab === "batch" && visible} className="scale-110 blur-[3px] brightness-[.38]" />
              <div className="absolute inset-x-4 bottom-4 top-12 z-10 flex flex-col justify-end gap-2 sm:inset-x-10 sm:bottom-10 sm:top-14">
                <div className="mb-1 flex items-baseline justify-between text-white">
                  <p className="font-display text-xl">Night feed · season 2</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/55">20 queued</p>
                </div>
                {queue.map((q, n) => {
                  const state = n < done ? "ready" : n === done ? "rendering" : "queued";
                  return (
                    <div key={q.ep} className="flex items-center gap-3 rounded-2xl bg-black/55 p-2 pr-4 text-white backdrop-blur-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={q.poster} alt="" className="h-12 w-10 shrink-0 rounded-lg object-cover" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium"><span className="mr-2 font-mono text-[11px] text-white/45 max-sm:hidden">{q.ep}</span>{q.title}</p>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/15">
                          <div className="h-full rounded-full bg-safelight transition-[width] duration-300" style={{ width: state === "ready" ? "100%" : state === "rendering" ? `${pct}%` : "0%" }} />
                        </div>
                      </div>
                      <span className={`shrink-0 text-xs ${state === "rendering" ? "text-warn" : state === "ready" ? "text-ok" : "text-white/55"}`}>
                        {state === "ready" ? <><span className="max-sm:hidden">Posts </span>{q.when}</> : state === "rendering" ? `${Math.floor(pct)}%` : q.when}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Viewfinder label="Overnight render" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
