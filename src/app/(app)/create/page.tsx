"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { aspectClass } from "@/components/bits";
import { Portrait, Still } from "@/components/still";
import { cameraMoves, cast, models, type Aspect, type SceneKey } from "@/lib/mock";

const aspects: Aspect[] = ["9:16", "16:9", "1:1"];
const lengths = [4, 6, 8, 10, 12];
const modes = ["Text", "Image", "Frames"] as const;
const starters = [
  "Mara steps off the last train into an empty station, steam curling along the platform.",
  "Drone pass over dunes at golden hour, long shadows, a lone traveller on the ridge.",
  "Amber bottle on a dark pedestal, slow orbit, a softbox sweeping across the label.",
];

function pickScene(prompt: string): SceneKey {
  const p = prompt.toLowerCase();
  const map: [string, SceneKey][] = [["train", "subway"], ["station", "subway"], ["subway", "subway"], ["dune", "dunes"], ["desert", "dunes"], ["bottle", "bottle"], ["product", "bottle"], ["door", "door"], ["lamp", "table"], ["table", "table"], ["light", "lighthouse"], ["sea", "lighthouse"], ["city", "skyline"], ["skyline", "skyline"], ["forest", "forest"], ["pine", "forest"], ["mountain", "ridges"], ["ridge", "ridges"], ["garden", "garden"], ["lawn", "garden"]];
  return map.find(([k]) => p.includes(k))?.[1] ?? "alley";
}

type Take = { id: number; scene: SceneKey; seconds: number; model: string; aspect: Aspect; cost: number };

// Viewfinder corner marks.
function Corners({ className = "" }: { className?: string }) {
  const c = "absolute h-6 w-6 border-white/80";
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
    </span>
  );
}

const makerHue: Record<string, string> = { Google: "from-[#4285F4] to-[#34A853]", Kuaishou: "from-[#ff7a18] to-[#ff3d68]", ByteDance: "from-[#7c5cff] to-[#2dd4ff]", Alibaba: "from-[#ff6a00] to-[#ffb200]", MiniMax: "from-[#ec4899] to-[#8b5cf6]" };
const shapeBox: Record<Aspect, string> = { "9:16": "h-[18px] w-[10px]", "16:9": "h-[10px] w-[18px]", "1:1": "h-[14px] w-[14px]" };
const glass = "bg-black/45 backdrop-blur-xl ring-1 ring-white/10";
const mono = "font-mono text-[10px] uppercase tracking-[0.16em] text-white/50";

// The landing page and dashboard send a typed prompt here as ?prompt=; the studio starts with it filled in.
export default function CreatePage() {
  return (
    <Suspense fallback={null}>
      <CreateStudio />
    </Suspense>
  );
}

function CreateStudio() {
  const params = useSearchParams();
  const [mode, setMode] = useState<(typeof modes)[number]>("Text");
  const [prompt, setPrompt] = useState(params.get("prompt")?.trim().slice(0, 500) || starters[0]);
  const [modelId, setModelId] = useState("seedance");
  const [aspect, setAspect] = useState<Aspect>("9:16");
  const [seconds, setSeconds] = useState(8);
  const [camera, setCamera] = useState("dolly-in");
  const [cast_, setCast] = useState<string[]>(["mara"]);
  const [motion, setMotion] = useState(55);
  const [progress, setProgress] = useState<number | null>(null);
  const [takes, setTakes] = useState<Take[]>([
    { id: 1, scene: "alley", seconds: 8, model: "seedance", aspect: "9:16", cost: 80 },
    { id: 2, scene: "door", seconds: 6, model: "seedance", aspect: "9:16", cost: 60 },
  ]);
  const [activeTake, setActiveTake] = useState<number>(1);
  const [pop, setPop] = useState<null | "model" | "camera">(null);

  const model = models.find((m) => m.id === modelId)!;
  const cost = model.creditsPerSecond * seconds;
  const generating = progress !== null;
  const shown = takes.find((t) => t.id === activeTake) ?? takes[0];

  useEffect(() => {
    if (!pop) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPop(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pop]);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  // A pretend render: climbs to 100% in a couple of seconds, then adds a take. Values are snapshotted at the press.
  function startRender() {
    const snap: Take = { id: Date.now(), scene: pickScene(prompt), seconds, model: modelId, aspect, cost };
    let p = 4;
    setProgress(p);
    timer.current = setInterval(() => {
      p += 9 + Math.random() * 9;
      if (p >= 100) {
        if (timer.current) clearInterval(timer.current);
        setTakes((t) => [snap, ...t]);
        setActiveTake(snap.id);
        setProgress(null);
      } else {
        setProgress(p);
      }
    }, 220);
  }

  const cam = cameraMoves.find((m) => m.id === camera);
  const frameH = "calc(100svh - 68px - 330px)";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setPop(null);
        if (!generating && prompt.trim()) startRender();
      }}
      className="relative isolate flex min-h-[calc(100svh-68px)] flex-col overflow-hidden bg-[#070708] xl:h-[calc(100svh-68px)]"
    >
      {/* the shot's own light fills the room */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <Still scene={shown.scene} className={`!rounded-none h-full w-full scale-125 opacity-45 blur-3xl saturate-150 transition-opacity duration-700 ${generating ? "animate-pulse" : ""}`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_20%,rgba(7,7,8,0.85)_85%)]" />
      </div>

      <div className="grid min-h-0 flex-1 gap-4 p-4 sm:p-5 xl:grid-cols-[370px_minmax(0,1fr)_150px] xl:gap-6 xl:p-6">
        {/* script + cast */}
        <div className={`order-2 flex max-h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 scrollbar-thin xl:order-1 xl:self-start ${glass} rounded-[6px]`}>
          <div className="flex gap-1 rounded-full bg-white/[0.06] p-1" role="tablist" aria-label="Input type">
            {modes.map((m) => (
              <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={`flex-1 rounded-full py-1.5 text-[12px] font-semibold transition-colors ${mode === m ? "bg-bone text-ink" : "text-white/60 hover:text-white"}`}>
                {m === "Text" ? "Text" : m === "Image" ? "Image" : "Frames"}
              </button>
            ))}
          </div>

          {mode !== "Text" && (
            <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-white/25 text-center text-xs text-white/55 hover:border-white">
              <Icon name="upload" size={18} />
              {mode === "Image" ? "Drop a start image, or browse" : "Drop a first frame and a last frame"}
              <input type="file" accept="image/*" className="sr-only" />
            </label>
          )}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="prompt" className={`${mono} flex items-center gap-2`}><span className="h-1.5 w-1.5 rounded-full bg-safelight" />Scene · Take {takes.length + 1}</label>
              <span className="font-mono text-[10px] text-white/40">{prompt.length}/500</span>
            </div>
            <textarea id="prompt" rows={6} maxLength={500} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="block w-full resize-none rounded-[6px] bg-black/40 px-4 py-3 font-mono text-[13px] leading-relaxed text-white outline-none ring-1 ring-white/10 transition focus:ring-white/40" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {starters.map((st, i) => (
                <button key={i} type="button" onClick={() => setPrompt(st)} className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[11px] text-white/70 transition-colors hover:bg-white/15 hover:text-white">
                  <Icon name="wand" size={10} className="mr-1 inline" />Idea {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={`${mono} mb-2.5`}>Cast · keeps face and wardrobe</p>
            <ul className="flex flex-wrap gap-2">
              {cast.map((c) => {
                const on = cast_.includes(c.id);
                return (
                  <li key={c.id}>
                    <button type="button" aria-pressed={on} onClick={() => setCast((st) => (on ? st.filter((x) => x !== c.id) : [...st, c.id]))} className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs font-medium ring-1 transition-all ${on ? "bg-safelight/15 text-white ring-safelight" : "text-white/65 ring-white/15 hover:ring-white/40"}`}>
                      <Portrait hue={c.hue} className="h-6 w-6 !rounded-full" />
                      {c.short}
                      {on && <Icon name="lock" size={10} className="text-safelight" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* the viewfinder */}
        <section className="relative order-1 flex min-h-0 min-w-0 flex-col items-center justify-center gap-4 xl:order-2" aria-label="Preview">
          <div className="flex w-full max-w-[900px] items-center justify-between gap-3 px-1">
            <span className={`${mono} flex shrink-0 items-center gap-2 !text-white/70`}><span className={`h-2 w-2 rounded-full ${generating ? "pulse-dot bg-safelight" : "bg-white/40"}`} />{generating ? "Rolling" : "Standby"}</span>
            <span className={`${mono} min-w-0 truncate`}>{models.find((m) => m.id === shown.model)?.name} · {shown.aspect} · {shown.seconds}s · 24 fps</span>
          </div>
          <div className="relative w-full" style={{ maxWidth: aspect === "9:16" ? `min(300px, 62vw, calc(${frameH} * 0.5625))` : aspect === "1:1" ? `min(520px, ${frameH})` : `min(900px, calc(${frameH} * 1.7778))` }}>
            <div className="relative overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/15">
              <Still scene={shown.scene} playing={!generating} className={`!rounded-none ${aspectClass(generating ? aspect : shown.aspect)} w-full`} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] opacity-25 [background-image:linear-gradient(to_right,transparent_33.2%,rgba(255,255,255,.4)_33.3%,transparent_33.5%,transparent_66.5%,rgba(255,255,255,.4)_66.6%,transparent_66.8%),linear-gradient(to_bottom,transparent_33.2%,rgba(255,255,255,.4)_33.3%,transparent_33.5%,transparent_66.5%,rgba(255,255,255,.4)_66.6%,transparent_66.8%)]" />
              {generating && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 px-8 text-center backdrop-blur-sm">
                  <svg width="46" height="46" viewBox="0 0 46 46" className="spin-reel" aria-hidden="true">
                    <circle cx="23" cy="23" r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                    <circle cx="23" cy="5" r="4" fill="#f0532b" />
                    <circle cx="41" cy="23" r="3.4" fill="#ece5d3" />
                    <circle cx="23" cy="41" r="3.4" fill="#ece5d3" />
                    <circle cx="5" cy="23" r="3.4" fill="#ece5d3" />
                  </svg>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-warn">Rolling {Math.round(progress ?? 0)}%</p>
                  <div className="mt-3 h-[3px] w-full max-w-[200px] rounded-full bg-white/20"><div className="h-full rounded-full bg-safelight transition-[width]" style={{ width: `${progress}%` }} /></div>
                  <p className="mt-3 text-xs text-white/55">Holding the cast, setting the light</p>
                </div>
              )}
            </div>
            <Corners className="-m-3" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button type="button" className="btn btn-ghost btn-sm !bg-white/10"><Icon name="download" size={14} /> Download</button>
            <button type="button" className="btn btn-ghost btn-sm !bg-white/10"><Icon name="remix" size={14} /> Re-roll</button>
          </div>
        </section>

        {/* takes */}
        <aside className="order-3 min-h-0 xl:overflow-y-auto scrollbar-thin" aria-label="Takes">
          <p className={`${mono} mb-2.5`}>Takes · {takes.length}</p>
          <ul className="relative flex gap-3 overflow-x-auto bg-black/55 px-3 py-5 backdrop-blur-xl ring-1 ring-white/10 xl:flex-col xl:overflow-visible xl:px-5 xl:py-3">
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1.5 h-[6px] bg-[repeating-linear-gradient(to_right,transparent_0_6px,rgba(236,229,211,0.22)_6px_12px)] xl:hidden" />
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-1.5 h-[6px] bg-[repeating-linear-gradient(to_right,transparent_0_6px,rgba(236,229,211,0.22)_6px_12px)] xl:hidden" />
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1.5 hidden w-[6px] bg-[repeating-linear-gradient(to_bottom,transparent_0_6px,rgba(236,229,211,0.22)_6px_12px)] xl:block" />
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-1.5 hidden w-[6px] bg-[repeating-linear-gradient(to_bottom,transparent_0_6px,rgba(236,229,211,0.22)_6px_12px)] xl:block" />
            {takes.map((t, i) => (
              <li key={t.id} className="w-32 shrink-0 xl:w-full">
                <button type="button" onClick={() => setActiveTake(t.id)} aria-pressed={activeTake === t.id} className={`block w-full overflow-hidden text-left ring-2 transition-all ${activeTake === t.id ? "ring-safelight" : "opacity-60 ring-transparent hover:opacity-100"}`}>
                  <Still scene={t.scene} className="!rounded-none aspect-video w-full" />
                  <span className="flex items-center justify-between bg-black px-2 py-1"><span className="font-mono text-[10px] text-white/70">T{String(takes.length - i).padStart(2, "0")}</span><span className="font-mono text-[10px] text-white/40">{t.seconds}s</span></span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* the dock: camera controls */}
      {pop && <button type="button" aria-label="Close" tabIndex={-1} onClick={() => setPop(null)} className="fixed inset-0 z-20 cursor-default" />}
      <div className="sticky bottom-[84px] z-30 px-4 pb-4 sm:px-5 xl:static xl:px-6 xl:pb-6">
        <div className={`relative mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-3 gap-y-3 rounded-[6px] p-3 ${glass} shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]`}>
          {/* model */}
          <div className="relative">
            <button type="button" aria-expanded={pop === "model"} onClick={() => setPop(pop === "model" ? null : "model")} className="flex items-center gap-2.5 rounded-[6px] bg-white/[0.07] py-1.5 pl-1.5 pr-3 text-left transition-colors hover:bg-white/[0.12]">
              <span className={`grid h-9 w-9 place-items-center rounded-[5px] bg-gradient-to-br font-display text-sm text-white ${makerHue[model.maker]}`}>{model.maker[0]}</span>
              <span><span className="block text-[13px] font-semibold leading-tight">{model.name}</span><span className="block font-mono text-[10px] text-white/50">{model.creditsPerSecond} cr/s · {model.speed}</span></span>
              <Icon name="chevron" size={12} className="-rotate-90 text-white/50" />
            </button>
            {pop === "model" && (
              <ul className={`absolute bottom-full left-0 z-30 mb-3 w-[min(22rem,calc(100vw-3rem))] space-y-1 rounded-[6px] p-2 ${glass} bg-black/80`}>
                {models.map((m) => {
                  const on = m.id === modelId;
                  return (
                    <li key={m.id}>
                      <button type="button" aria-pressed={on} onClick={() => { setModelId(m.id); setSeconds((st) => Math.min(st, m.maxSeconds)); setPop(null); }} className={`flex w-full items-center gap-3 rounded-[5px] p-2 text-left transition-colors ${on ? "bg-white/[0.12]" : "hover:bg-white/[0.07]"}`}>
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[5px] bg-gradient-to-br font-display text-sm text-white ${makerHue[m.maker]}`}>{m.maker[0]}</span>
                        <span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold leading-tight">{m.name}</span><span className="block truncate text-[11px] text-white/50">{m.best}</span></span>
                        <span className="text-right"><span className="block font-display text-sm">{m.creditsPerSecond}<span className="ml-0.5 text-[9px] text-white/50">cr/s</span></span><span className="block text-[10px] text-white/50">{m.speed}</span></span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* camera */}
          <div className="relative">
            <button type="button" aria-expanded={pop === "camera"} onClick={() => setPop(pop === "camera" ? null : "camera")} className="flex items-center gap-2.5 rounded-[6px] bg-white/[0.07] px-3 py-2.5 transition-colors hover:bg-white/[0.12]">
              <Icon name={`m-${camera}` as never} size={16} />
              <span className="text-[13px] font-semibold">{cam?.label}</span>
              <Icon name="chevron" size={12} className="-rotate-90 text-white/50" />
            </button>
            {pop === "camera" && (
              <div className={`absolute bottom-full left-0 z-30 mb-3 w-[min(20rem,calc(100vw-3rem))] rounded-[6px] p-3 ${glass} bg-black/80`}>
                <ul className="grid grid-cols-3 gap-1.5">
                  {cameraMoves.map((m) => (
                    <li key={m.id}>
                      <button type="button" aria-pressed={camera === m.id} onClick={() => setCamera(m.id)} className={`flex w-full flex-col items-center gap-1.5 rounded-[5px] py-2.5 text-[11px] ring-1 transition-colors ${camera === m.id ? "bg-safelight/15 text-white ring-safelight" : "text-white/65 ring-white/10 hover:ring-white/30"}`}>
                        <Icon name={`m-${m.id}` as never} size={17} />{m.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 px-1">
                  <div className="mb-1 flex items-center justify-between text-xs"><label htmlFor="motion" className="text-white/60">Motion</label><span className="font-mono text-[11px]">{motion < 34 ? "Calm" : motion < 67 ? "Balanced" : "Wild"}</span></div>
                  <input id="motion" type="range" min={0} max={100} value={motion} onChange={(e) => setMotion(Number(e.target.value))} className="w-full accent-[#f0532b]" />
                </div>
              </div>
            )}
          </div>

          {/* shape */}
          <div className="flex gap-1" role="group" aria-label="Shape">
            {aspects.map((a) => (
              <button key={a} type="button" aria-pressed={aspect === a} aria-label={a} onClick={() => setAspect(a)} title={a} className={`grid h-10 w-9 place-items-center rounded-[6px] ring-1 sm:w-10 transition-colors ${aspect === a ? "bg-white/[0.12] ring-white/50" : "ring-white/10 hover:ring-white/30"}`}>
                <span className={`${shapeBox[a]} rounded-[2px] border-2 ${aspect === a ? "border-safelight" : "border-white/50"}`} />
              </button>
            ))}
          </div>

          {/* length */}
          <div className="flex items-center rounded-[6px] bg-white/[0.07] p-1" role="group" aria-label="Length">
            {lengths.map((l) => {
              const off = l > model.maxSeconds;
              return (
                <button key={l} type="button" disabled={off} aria-pressed={seconds === l} onClick={() => setSeconds(l)} className={`h-8 min-w-[2.1rem] rounded-[5px] px-1.5 font-mono sm:min-w-9 sm:px-2 text-[12px] transition-colors ${seconds === l ? "bg-bone text-ink" : "text-white/70 hover:text-white"} ${off ? "opacity-25" : ""}`}>{l}s</button>
              );
            })}
          </div>

          {/* cost + go */}
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="font-display text-2xl leading-none">{cost}<span className="ml-1 text-[10px] text-white/50">credits</span></p>
              <p className="mt-1 font-mono text-[10px] text-white/45">842 left · ~{model.speed.replace("~", "")}</p>
            </div>
            <button type="submit" disabled={generating || !prompt.trim()} className="btn btn-primary px-6 py-3.5 text-[15px] shadow-[0_10px_40px_-10px_rgba(240,83,43,0.9)] disabled:opacity-70">
              {generating ? "Rolling…" : (<><Icon name="spark" size={16} /> Roll camera</>)}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
