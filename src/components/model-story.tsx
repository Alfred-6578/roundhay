"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Clip } from "@/components/clip";
import { Reveal } from "@/components/reveal";
import type { Model } from "@/lib/mock";

export type Story = {
  model: Model;
  n: string;
  clip: { src: string; poster: string; of: string };
  look: string;
  prompt: string;
  moves: string[];
};

const SAMPLE_SECONDS = 8;

// One camera, given a whole section: a clip from it in a viewfinder, what it looks like, a prompt that made it, and what it costs.
export function ModelStory({ s, flip }: { s: Story; flip?: boolean }) {
  const m = s.model;
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} id={m.id} className={`scroll-mt-32 px-5 py-10 sm:px-8 sm:py-16 lg:px-12 ${flip ? "bg-paper-2" : ""}`}>
      <div className={`mx-auto grid max-w-[1500px] items-center gap-12 lg:gap-20 ${flip ? "lg:grid-cols-[1fr_minmax(0,26rem)]" : "lg:grid-cols-[minmax(0,26rem)_1fr]"}`}>
        {/* the frame in the gate */}
        <Reveal y={36} scale={0.97} className={`relative mx-auto w-full max-w-[22rem] lg:max-w-none ${flip ? "lg:order-2" : ""}`}>
          <div className="relative aspect-[5/6] overflow-hidden rounded-[6px] bg-night shadow-[0_30px_80px_rgba(0,0,0,0.25)] ring-1 ring-ink/15">
            <Clip src={s.clip.src} poster={s.clip.poster} play={visible} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
            <p className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/85">
              <span className="h-2 w-2 animate-pulse rounded-full bg-safelight" /> Rec
            </p>
            <p className="absolute right-4 top-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/65">{m.name} · {m.maxRes}</p>
            <p className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">Example · {s.clip.of}</p>
          </div>
          {["-left-3 -top-3 border-l-2 border-t-2", "-right-3 -top-3 border-r-2 border-t-2", "-bottom-3 -left-3 border-b-2 border-l-2", "-bottom-3 -right-3 border-b-2 border-r-2"].map((c) => (
            <span key={c} aria-hidden="true" className={`absolute h-4 w-4 border-safelight ${c}`} />
          ))}
        </Reveal>

        <div>
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-safelight">{s.n} · {m.maker} · Best for {m.best.toLowerCase()}</p>
            <h2 className="display mt-4 text-[clamp(2.6rem,6vw,5.2rem)] leading-[0.98]">{m.name}</h2>
            <p className="mt-5 max-w-xl text-xl leading-snug text-ink">{m.blurb}</p>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink/60">{s.look}</p>
          </Reveal>

          <Reveal delay={120} y={22} className="mt-8 max-w-xl rounded-2xl bg-ink p-5 text-paper">
            <p className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-paper/50">
              <span>The prompt behind the clip</span>
              <span className="flex items-center gap-1.5 text-safelight"><Icon name="m-dolly-in" size={12} /> {s.moves.join(" · ")}</span>
            </p>
            <p className="mt-3 font-mono text-[13.5px] leading-relaxed text-paper/85">{s.prompt}</p>
          </Reveal>

          <Reveal delay={200} y={22}>
            <dl className="mt-8 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {[
                [`${m.maxSeconds} s`, "Longest clip"],
                [m.maxRes, "Top resolution"],
                [m.speed, "To render"],
                [`${m.creditsPerSecond * SAMPLE_SECONDS}`, `Credits for ${SAMPLE_SECONDS} s`],
              ].map(([v, l]) => (
                <div key={l} className="border-t border-ink/20 pt-3">
                  <dt className="font-display text-2xl">{v}</dt>
                  <dd className="mt-0.5 text-xs text-ink/50">{l}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/signup" className="btn btn-primary px-7 py-4">Shoot with {m.name} <Icon name="arrow" size={15} /></Link>
              <Link href="/pricing" className="text-[15px] font-semibold underline decoration-ink/25 underline-offset-[6px] transition-colors hover:decoration-safelight">See what it costs</Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
