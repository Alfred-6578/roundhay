"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Still } from "@/components/still";
import { models, type SceneKey } from "@/lib/mock";

type Status = "draft" | "queued" | "rendering" | "done";
type Row = { id: number; ep: string; prompt: string; scene: SceneKey; secs: number; publish: string; status: Status; progress: number };

const seed: Row[] = [
  { id: 1, ep: "15", prompt: "Mara walks through a flooded subway platform, a train light flickering down the tunnel.", scene: "subway", secs: 10, publish: "Thu 19 Nov", status: "rendering", progress: 64 },
  { id: 2, ep: "16", prompt: "Mara opens a door at the end of a dark corridor. Warm daylight floods in.", scene: "door", secs: 6, publish: "Sat 21 Nov", status: "queued", progress: 0 },
  { id: 3, ep: "17", prompt: "Mara sits across a table from a stranger under a single hanging lamp.", scene: "table", secs: 8, publish: "Mon 23 Nov", status: "queued", progress: 0 },
  { id: 4, ep: "18", prompt: "", scene: "skyline", secs: 8, publish: "Wed 25 Nov", status: "draft", progress: 0 },
];

const mono = "font-mono text-[10px] uppercase tracking-[0.16em]";
const panel = "rounded-[6px] bg-[linear-gradient(165deg,#19191c,#0f0f11)] ring-1 ring-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";
const steps: Status[] = ["draft", "queued", "rendering", "done"];
const tone: Record<Status, string> = { draft: "bg-line-2", queued: "bg-silver", rendering: "bg-warn", done: "bg-ok" };

const days = ["Thu 19 Nov", "Sat 21 Nov", "Mon 23 Nov", "Wed 25 Nov", "Fri 27 Nov", "Sun 29 Nov"];

export default function BatchPage() {
  const [rows, setRows] = useState<Row[]>(seed);
  const [running, setRunning] = useState(false);
  const rate = models.find((m) => m.id === "seedance")!.creditsPerSecond;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRows((rs) => {
        const active = rs.find((r) => r.status === "rendering") ?? rs.find((r) => r.status === "queued" && r.prompt);
        if (!active) {
          setRunning(false);
          return rs;
        }
        return rs.map((r) => {
          if (r.id !== active.id) return r;
          const p = r.status === "rendering" ? r.progress + 14 : 6;
          return p >= 100 ? { ...r, status: "done", progress: 100 } : { ...r, status: "rendering", progress: p };
        });
      });
    }, 450);
    return () => clearInterval(id);
  }, [running]);

  const update = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const todo = rows.filter((r) => r.status !== "done" && r.prompt.trim());
  const total = todo.reduce((n, r) => n + r.secs * rate, 0);
  const done = rows.filter((r) => r.status === "done").length;

  const finishedPct = rows.length ? (done / rows.length) * 100 : 0;

  return (
    <div className="mx-auto max-w-[1500px] px-5 pb-20 pt-6 lg:px-8">
      <Reveal y={20} className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className={`${mono} text-dim`}>Night Feed · Seedance 2.0 · Mara Quill locked</p>
          <h1 className="display mt-3 text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.94]">
            Write the week.<br />
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(236,229,211,0.85)" }}>Press go.</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-silver">Each episode renders in order, and each can be scheduled to publish.</p>
        </div>
        <button type="button" onClick={() => setRows((r) => [...r, { id: Date.now(), ep: String(15 + r.length), prompt: "", scene: "alley", secs: 8, publish: days[r.length % days.length], status: "draft", progress: 0 }])} className="btn btn-ghost !bg-white/10">
          <Icon name="plus" size={16} /> Add episode
        </button>
      </Reveal>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* the schedule: a timeline of episodes */}
        <ol className="relative ml-3 space-y-5 border-l border-line pl-6 sm:pl-9">
          {rows.map((r, idx) => {
            const live = r.status === "rendering";
            return (
              <Reveal as="li" key={r.id} y={22} delay={idx * 60} className="relative">
                <span aria-hidden="true" className={`absolute -left-[31px] top-6 h-3 w-3 rounded-full ring-4 ring-[#0a0a0b] sm:-left-[43px] ${tone[r.status]} ${live ? "pulse-dot" : ""}`} />
                <article className={`${panel} flex gap-4 p-3 transition-shadow sm:gap-5 sm:p-4 ${live ? "!ring-warn/40 shadow-[0_24px_60px_-30px_rgba(240,180,60,0.4)]" : ""}`}>
                  {/* the shot */}
                  <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden sm:w-32">
                    <Still scene={r.scene} className={`!rounded-none h-full w-full ${r.status === "draft" ? "opacity-30 grayscale" : ""} ${r.status === "queued" ? "opacity-70" : ""}`} />
                    <div className="absolute inset-0 grid place-items-center">
                      {live && (
                        <span className="relative grid h-14 w-14 place-items-center bg-black/55 backdrop-blur-sm" style={{ borderRadius: 999 }}>
                          <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90" aria-hidden="true"><circle cx="22" cy="22" r="19" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" /><circle cx="22" cy="22" r="19" fill="none" stroke="#f0532b" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 19 * (Math.min(99, r.progress) / 100)} 200`} /></svg>
                          <span className="font-mono text-[11px] text-white">{Math.min(99, Math.round(r.progress))}</span>
                        </span>
                      )}
                      {r.status === "done" && <span className="grid h-10 w-10 place-items-center rounded-full bg-ok text-ink"><Icon name="check" size={18} /></span>}
                      {r.status === "draft" && <Icon name="plus" size={22} className="text-white/60" />}
                    </div>
                    <span className="absolute left-2 top-1 font-display text-4xl leading-none sm:text-5xl" style={{ color: "transparent", WebkitTextStroke: "1.2px rgba(255,255,255,0.85)" }}>{r.ep}</span>
                  </div>

                  {/* the script */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <span className={`${mono} text-silver`}>Ep. {r.ep}</span>
                      <span className="chip text-[11px]"><Icon name="clock" size={10} /> {r.publish}</span>
                      <span className="ml-auto flex items-center gap-2" aria-label={`Status: ${r.status}`}>
                        <span className="flex gap-1" aria-hidden="true">{steps.map((st, i) => <span key={st} className={`h-1 w-4 rounded-full ${i <= steps.indexOf(r.status) ? tone[r.status] : "bg-white/10"}`} />)}</span>
                        <span className={`${mono} ${r.status === "done" ? "text-ok" : live ? "text-warn" : "text-dim"}`}>{live ? "Rendering" : r.status}</span>
                      </span>
                    </div>
                    <label className="sr-only" htmlFor={`p${r.id}`}>Prompt for episode {r.ep}</label>
                    <textarea
                      id={`p${r.id}`}
                      rows={3}
                      value={r.prompt}
                      disabled={live || r.status === "done"}
                      onChange={(e) => update(r.id, { prompt: e.target.value, status: e.target.value.trim() ? (r.status === "draft" ? "queued" : r.status) : "draft" })}
                      placeholder="Describe this episode's shot…"
                      className="mt-2.5 w-full flex-1 resize-none bg-transparent font-mono text-[13px] leading-relaxed text-bone outline-none placeholder:text-dim disabled:text-silver"
                    />
                    <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                      <span className="chip text-[11px]">{r.secs}s</span>
                      <span className="chip text-[11px]">9:16</span>
                      <span className={`${mono} ml-auto text-dim`}>{r.secs * rate} credits</span>
                      {!live && (
                        <button type="button" aria-label={`Remove episode ${r.ep}`} onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} className="text-dim transition-colors hover:text-safelight">
                          <Icon name="trash" size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ol>

        {/* the run */}
        <aside className="h-fit xl:sticky xl:top-20">
          <div className={`${panel} relative overflow-hidden p-6`}>
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-safelight/15 blur-3xl" />
            <p className={`${mono} relative text-dim`}>This run</p>
            <p className="relative mt-3 font-display text-[4rem] leading-none">{total}<span className="ml-2 text-xs text-dim">credits</span></p>
            {/* the reel fills as episodes finish */}
            <div className="relative mt-5">
              <div className="h-2 overflow-hidden bg-white/10"><div className="h-full bg-gradient-to-r from-[#ff8a3d] to-safelight shadow-[0_0_12px_rgba(240,83,43,0.7)] transition-[width] duration-500" style={{ width: `${finishedPct}%` }} /></div>
              <p className={`${mono} mt-2 text-dim`}>{done} of {rows.length} finished</p>
            </div>
            <dl className="relative mt-5 grid grid-cols-2 gap-px bg-white/10">
              {[["To render", String(todo.length)], ["Finished", String(done)], ["Balance after", (842 - total).toLocaleString()], ["Est. time", `~${Math.max(1, todo.length * 2)} min`]].map(([k, v]) => (
                <div key={k} className="bg-[#111113] px-4 py-3"><dt className={`${mono} text-dim`}>{k}</dt><dd className="mt-1 font-display text-xl leading-none">{v}</dd></div>
              ))}
            </dl>
            <button type="button" disabled={running || todo.length === 0} onClick={() => setRunning(true)} className="btn btn-primary relative mt-5 w-full py-4 text-[15px] shadow-[0_10px_40px_-10px_rgba(240,83,43,0.9)] disabled:opacity-60 disabled:shadow-none">
              <Icon name="spark" size={16} />
              {running ? "Rolling…" : "Generate all"}
            </button>
            <p className="relative mt-3 text-xs leading-relaxed text-dim">Credits are only taken as each clip starts rendering. Cancel any time.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
