"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { fmtTime } from "@/components/bits";
import { Still } from "@/components/still";
import { clips, type SceneKey } from "@/lib/mock";

const TOTAL = 30;
const timeline: { scene: SceneKey; start: number; len: number; label: string }[] = [
  { scene: "alley", start: 0, len: 8, label: "Rain-soaked alley" },
  { scene: "subway", start: 8, len: 10, label: "Flooded platform" },
  { scene: "door", start: 18, len: 6, label: "The door" },
  { scene: "skyline", start: 24, len: 6, label: "City at dusk" },
];
const captions: [number, number, string][] = [[1, 6, "Rain never stopped"], [9, 7, "Nobody told her"], [19, 4, "Some doors"]];

const wave = Array.from({ length: 150 }, (_, i) => 18 + Math.abs(Math.sin(i * 0.7) * 40 + Math.sin(i * 0.23) * 28));
const mono = "font-mono text-[10px] uppercase tracking-[0.16em]";
const panel = "rounded-[6px] bg-[linear-gradient(165deg,#19191c,#0f0f11)] ring-1 ring-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";

function Corners() {
  const c = "absolute h-5 w-5 border-white/80";
  return (
    <span aria-hidden="true" className="pointer-events-none absolute -inset-3">
      <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
    </span>
  );
}

export default function EditorPage() {
  const [t, setT] = useState(6);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((v) => (v + 0.1 >= TOTAL ? 0 : v + 0.1)), 100);
    return () => clearInterval(id);
  }, [playing]);

  const current = timeline.find((c) => t >= c.start && t < c.start + c.len) ?? timeline[0];
  const caption = captions.find(([s, l]) => t >= s && t < s + l);
  const pct = (n: number) => `${(n / TOTAL) * 100}%`;
  const bin = clips.filter((c) => c.status === "ready" && c.kind === "Video").slice(0, 6);
  const tc = `00:${String(Math.floor(t)).padStart(2, "0")}:${String(Math.floor((t % 1) * 24)).padStart(2, "0")}`;
  const seek = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setT(Math.max(0, Math.min(TOTAL - 0.01, ((e.clientX - r.left) / r.width) * TOTAL)));
  };

  return (
    <div className="flex h-[calc(100svh-68px-5.5rem)] flex-col bg-[#070708] lg:h-[calc(100svh-68px)]">
      {/* top bar */}
      <div className="flex items-center gap-3 border-b border-line px-5 py-2.5">
        <p className="min-w-0 truncate font-display text-lg leading-none">Night Feed <span className="text-dim">/ Ep. 15 cut</span></p>
        <span className={`${mono} hidden items-center gap-1.5 text-dim sm:flex`}><span className="h-1.5 w-1.5 rounded-full bg-ok" />Saved just now</span>
        <div className="ml-auto flex gap-2">
          <button type="button" className="btn btn-ghost btn-sm !bg-white/10">Captions</button>
          <button type="button" className="btn btn-primary btn-sm shadow-[0_8px_30px_-8px_rgba(240,83,43,0.9)]"><Icon name="upload" size={14} /> Export</button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[240px_minmax(0,1fr)_260px]">
        {/* media bin */}
        <aside className="hidden overflow-y-auto border-r border-line p-3 scrollbar-thin lg:block">
          <p className={`${mono} mb-3 text-dim`}>Media · {bin.length}</p>
          <ul className="grid grid-cols-2 gap-2">
            {bin.map((c) => (
              <li key={c.id} className="group cursor-grab">
                <div className="relative overflow-hidden ring-1 ring-white/10 transition-all group-hover:ring-safelight">
                  <Still scene={c.scene} className="!rounded-none aspect-video w-full transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute bottom-1 right-1 bg-black/70 px-1 font-mono text-[9px] text-white">{fmtTime(c.seconds)}</span>
                </div>
                <p className="mt-1.5 truncate text-[11px] text-silver">{c.title}</p>
              </li>
            ))}
            <li>
              <button type="button" className="grid aspect-video w-full place-items-center border border-dashed border-white/25 text-white/50 transition-colors hover:border-white hover:text-white"><Icon name="plus" size={18} /></button>
            </li>
          </ul>
        </aside>

        {/* the monitor */}
        <div className="relative isolate flex min-h-0 flex-col items-center justify-center gap-5 overflow-hidden p-5">
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <Still scene={current.scene} className="!rounded-none h-full w-full scale-125 opacity-40 blur-3xl saturate-150" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_15%,rgba(7,7,8,0.9)_85%)]" />
          </div>
          <div className="relative w-full max-w-[min(720px,calc((100svh-480px)*1.7778))]">
            <div className="relative overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)] ring-1 ring-white/15">
              <Still scene={current.scene} playing={playing} className="!rounded-none aspect-video w-full" />
              <span className={`${mono} absolute left-3 top-3 z-10 !text-white/80 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]`}>TC {tc}</span>
              <span className={`${mono} absolute right-3 top-3 z-10 flex items-center gap-1.5 !text-white/80 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]`}><span className={`h-1.5 w-1.5 rounded-full ${playing ? "pulse-dot bg-safelight" : "bg-white/50"}`} />{playing ? "Play" : "Paused"}</span>
              {caption && <p className="absolute inset-x-6 bottom-5 z-10 mx-auto w-fit max-w-full bg-black/60 px-4 py-1.5 text-center text-sm font-semibold text-white backdrop-blur-sm">{t < 8 ? "Rain never stopped in this city." : t < 18 ? "Nobody told her the line was flooded." : "Some doors you only open once."}</p>}
            </div>
            <Corners />
          </div>
          <div className="flex items-center gap-5">
            <button type="button" aria-label="Back to start" onClick={() => setT(0)} className="text-white/60 transition-colors hover:text-white"><Icon name="back" size={18} /></button>
            <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)} className="flex h-12 w-12 items-center justify-center rounded-full bg-bone text-ink shadow-[0_10px_30px_-8px_rgba(0,0,0,0.9)] transition-transform hover:scale-105">
              <Icon name={playing ? "pause" : "play"} size={17} fill="currentColor" strokeWidth={0} />
            </button>
            <span className="w-28 font-mono text-[12px] text-white/70">{fmtTime(t)} <span className="text-white/35">/ {fmtTime(TOTAL)}</span></span>
          </div>
        </div>

        {/* inspector */}
        <aside className="hidden overflow-y-auto border-l border-line p-4 scrollbar-thin lg:block">
          <p className={`${mono} text-dim`}>Selected clip</p>
          <div className={`${panel} mt-3 overflow-hidden`}>
            <Still scene={current.scene} className="!rounded-none aspect-video w-full" />
            <p className="px-4 pt-3 font-display text-lg leading-tight">{current.label}</p>
            <dl className="mt-3 grid grid-cols-2 gap-px bg-white/10">
              {[["Start", fmtTime(current.start)], ["Length", `${current.len}s`], ["Speed", "100%"], ["Volume", "0 dB"]].map(([k, v]) => (
                <div key={k} className="bg-[#111113] px-4 py-3"><dt className={`${mono} text-dim`}>{k}</dt><dd className="mt-1 font-mono text-[13px]">{v}</dd></div>
              ))}
            </dl>
          </div>
          <button type="button" className="btn btn-ghost btn-sm mt-3 w-full !bg-white/10"><Icon name="scissors" size={14} /> Split at playhead</button>
        </aside>
      </div>

      {/* timeline */}
      <div className="border-t border-line bg-[#0b0b0c] pb-4 pt-3">
        <div className="flex px-5">
          <ul className="mt-6 w-12 shrink-0 space-y-1.5 text-right" aria-hidden="true">
            {[["V1", "h-16", "text-safelight"], ["VO", "h-9", "text-warn"], ["MUS", "h-7", "text-silver"], ["CC", "h-7", "text-ok"]].map(([l, h, c]) => (
              <li key={l} className={`${h} flex items-center justify-end pr-2 font-mono text-[10px] ${c}`}>{l}</li>
            ))}
          </ul>
          <div className="relative min-w-0 flex-1 cursor-pointer" onClick={seek} role="presentation">
            {/* ruler */}
            <div className="relative h-6 border-b border-white/10">
              {Array.from({ length: TOTAL + 1 }, (_, i) => (
                <span key={i} className="absolute bottom-0 w-px bg-white/25" style={{ left: pct(i), height: i % 5 === 0 ? 10 : 5 }} />
              ))}
              {Array.from({ length: TOTAL / 5 + 1 }, (_, i) => (
                <span key={i} className="absolute top-0 -translate-x-1/2 font-mono text-[9px] text-white/45" style={{ left: pct(i * 5) }}>{fmtTime(i * 5)}</span>
              ))}
            </div>
            <div className="relative mt-1.5 space-y-1.5">
              <div className="relative h-16 bg-black/50">
                {timeline.map((c) => {
                  const on = c === current;
                  return (
                    <div key={c.label} className={`absolute inset-y-0 overflow-hidden ring-1 transition-shadow ${on ? "z-10 ring-2 ring-safelight" : "ring-black"}`} style={{ left: pct(c.start), width: pct(c.len) }}>
                      <Still scene={c.scene} className={`!rounded-none h-full w-full ${on ? "" : "opacity-70"}`} />
                      <span className="absolute inset-x-0 top-0 truncate bg-gradient-to-b from-black/80 to-transparent px-1.5 pt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-white">{c.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="relative h-9 bg-black/50">
                <svg viewBox="0 0 150 80" preserveAspectRatio="none" className="h-full w-full text-warn/80" aria-hidden="true">
                  {wave.map((h, i) => <rect key={i} x={i} y={40 - h / 2} width="0.6" height={h} fill="currentColor" />)}
                </svg>
              </div>
              <div className="relative h-7 bg-black/50">
                <div className="absolute inset-y-1 left-0 right-[6%] bg-gradient-to-r from-white/25 to-white/10" />
                <span className={`${mono} absolute left-2 top-1.5 !text-[9px] text-white`}>Score · Low tide.wav</span>
              </div>
              <div className="relative h-7 bg-black/50">
                {captions.map(([s, l, txt]) => (
                  <span key={s} className="absolute inset-y-1 overflow-hidden border border-ok/50 bg-ok/20 px-1.5 font-mono text-[9px] leading-[18px] text-ok" style={{ left: pct(s), width: pct(l) }}>{txt}</span>
                ))}
              </div>
              {/* playhead */}
              <span className="pointer-events-none absolute -top-8 bottom-0 z-30 w-px bg-safelight shadow-[0_0_10px_rgba(240,83,43,0.9)]" style={{ left: pct(t) }}>
                <span className="absolute -left-[22px] -top-0 w-[45px] bg-safelight py-0.5 text-center font-mono text-[9px] text-white">{fmtTime(t)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
