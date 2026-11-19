"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Clip } from "@/components/clip";
import { Reveal } from "@/components/reveal";
import { models } from "@/lib/mock";

// An example shot for each model, so the choice is about how it looks and not a spec sheet. (Placeholder footage until
// we have real output from each model.)
const sample: Record<string, { n: string; src: string; poster: string; of: string }> = {
  veo: { n: "01", src: "/media/rail/rail-2.mp4", poster: "/media/rail/rail-2.jpg", of: "Travel b-roll" },
  kling: { n: "02", src: "/media/rail/rail-4.mp4", poster: "/media/rail/rail-4.jpg", of: "Short film" },
  seedance: { n: "03", src: "/media/rail/rail-9.mp4", poster: "/media/rail/rail-9.jpg", of: "Same character, new scene" },
  wan: { n: "04", src: "/media/rail/rail-7.mp4", poster: "/media/rail/rail-7.jpg", of: "City b-roll" },
  minimax: { n: "05", src: "/media/rail/rail-5.mp4", poster: "/media/rail/rail-5.jpg", of: "Animation" },
};

const SAMPLE_SECONDS = 8; // what the "cost" figure is quoted for

export function ModelsSection() {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the cheapest model for drafting a shot, the dearest for the keeper
  const draft = [...models].sort((x, y) => x.creditsPerSecond - y.creditsPerSecond)[0];
  const keeper = [...models].sort((x, y) => y.creditsPerSecond - x.creditsPerSecond)[0];

  return (
    <section ref={root} id="models" className="scroll-mt-4 px-3 sm:px-4">
      <div className="rounded-[28px] bg-ink px-4 py-14 text-paper sm:rounded-[40px] sm:px-10 sm:py-20">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-safelight">The models</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,5.4vw,5rem)] leading-[0.98]">Every top model.<br />One cast.</h2>
          </div>
          <p className="max-w-sm text-[17px] leading-relaxed text-paper/55 lg:pb-2">
            Veo, Kling, Seedance, Wan and MiniMax in one workspace. Pick the model for each shot: your cast, camera moves and schedule stay the same.
          </p>
        </Reveal>

        <Reveal as="ul" delay={150} y={40} className="mt-10 flex flex-col gap-2.5 sm:mt-14 lg:h-[34rem] lg:flex-row lg:gap-3">
          {models.map((m, n) => {
            const on = n === i;
            const s = sample[m.id];
            return (
              <li
                key={m.id}
                onPointerEnter={(e) => { if (e.pointerType === "mouse") setI(n); }}
                className={`group relative overflow-hidden rounded-[22px] bg-night-2 transition-[height,flex-grow] duration-[800ms] ease-[cubic-bezier(.2,.7,.2,1)] lg:h-auto lg:min-w-0 lg:basis-0 lg:rounded-[28px] ${on ? "h-[26rem] lg:grow-[3.4]" : "h-[4.6rem] lg:grow"}`}
              >
                <Clip src={s.src} poster={s.poster} play={on && visible} className={`absolute inset-0 transition-[filter,transform] duration-[800ms] ${on ? "scale-100" : "scale-105 brightness-[.42] saturate-75"}`} />
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${on ? "from-black/85 via-black/20 to-black/30 opacity-100" : "from-black/60 to-black/40 opacity-100"}`} />

                {/* closed: a strip with its name (sideways on a wide screen) */}
                <div className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${on ? "opacity-0" : "opacity-100 delay-300"}`} aria-hidden={on}>
                  <div className="flex h-full items-center justify-between px-5 lg:hidden">
                    <span className="flex items-baseline gap-3"><span className="font-mono text-xs text-paper/45">{s.n}</span><span className="font-display text-2xl">{m.name}</span></span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper/55">{m.speed}</span>
                  </div>
                  <div className="hidden h-full flex-col items-center justify-between py-7 lg:flex">
                    <span className="font-mono text-xs text-paper/45">{s.n}</span>
                    <span className="font-display text-3xl [writing-mode:vertical-rl] rotate-180">{m.name}</span>
                  </div>
                </div>

                {/* open: what it is, and what it costs */}
                <div className={`absolute inset-x-5 bottom-5 transition-[opacity,transform] duration-700 lg:inset-x-8 lg:bottom-8 ${on ? "translate-y-0 opacity-100 delay-300" : "pointer-events-none translate-y-3 opacity-0"}`} aria-hidden={!on}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/60">{s.n} · {m.maker} · {s.of}</p>
                  <p className="font-display mt-2 text-4xl lg:text-6xl">{m.name}</p>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-paper/70 lg:text-base">{m.blurb}</p>
                  <dl className="mt-5 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                    {[
                      [`${m.maxSeconds} s`, "Longest clip"],
                      [m.maxRes, "Top resolution"],
                      [m.speed, "To render"],
                      [`${m.creditsPerSecond * SAMPLE_SECONDS}`, `Credits for ${SAMPLE_SECONDS} s`],
                    ].map(([v, l]) => (
                      <div key={l} className="border-t border-white/20 pt-2">
                        <dt className="font-display text-xl lg:text-2xl">{v}</dt>
                        <dd className="mt-0.5 text-[11px] leading-tight text-paper/55">{l}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-paper/80 backdrop-blur-md"><Icon name="check" size={12} className="text-safelight" /> Best for {m.best.toLowerCase()}</p>
                </div>

                {/* the whole card is the control, for touch and keyboard */}
                <button type="button" onClick={() => setI(n)} onFocus={() => setI(n)} aria-expanded={on} aria-label={`${m.name}: ${m.blurb}`} className="absolute inset-0 z-20 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-safelight" />
              </li>
            );
          })}
        </Reveal>

        {draft && keeper && (
          <Reveal delay={250} y={20} className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-[15px] leading-relaxed text-paper/60">
              A usual week: draft the shot on <span className="text-paper">{draft.name}</span> ({draft.speed}, {draft.creditsPerSecond * SAMPLE_SECONDS} credits for {SAMPLE_SECONDS} s), then keep the one you like on{" "}
              <span className="text-paper">{keeper.name}</span> ({keeper.speed}, {keeper.creditsPerSecond * SAMPLE_SECONDS}).
            </p>
            <Link href="/models" className="btn btn-line-light shrink-0 self-start sm:self-auto">See all models <Icon name="arrow" size={15} /></Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
