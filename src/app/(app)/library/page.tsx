"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { fmtTime, StatusDot } from "@/components/bits";
import { ClipCard } from "@/components/clip-card";
import { Reveal } from "@/components/reveal";
import { Still } from "@/components/still";
import { clips, modelById, projects, type Clip } from "@/lib/mock";

const kinds = ["All", "Video", "Image"] as const;
const sorts = ["Newest", "Longest", "Most credits"] as const;
const mono = "font-mono text-[10px] uppercase tracking-[0.16em] text-dim";

// Which part of the timeline a clip belongs to, from its "when" label.
function bucket(c: Clip) {
  const w = c.when.toLowerCase();
  if (w.includes("just") || w.includes("queue") || w.includes("hour")) return "Today";
  if (w.includes("yesterday")) return "Yesterday";
  return "Earlier";
}

function Seg<T extends string>({ items, value, onChange, label }: { items: readonly T[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="flex bg-white/[0.06] p-1 rounded-[6px]" role="group" aria-label={label}>
      {items.map((k) => (
        <button key={k} type="button" aria-pressed={value === k} onClick={() => onChange(k)} className={`rounded-[4px] px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${value === k ? "bg-bone text-ink" : "text-silver hover:text-bone"}`}>{k}</button>
      ))}
    </div>
  );
}

export default function LibraryPage() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<(typeof kinds)[number]>("All");
  const [project, setProject] = useState<string>("all");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const out = clips.filter(
      (c) =>
        (kind === "All" || c.kind === kind) &&
        (project === "all" || c.project === project) &&
        (!s || c.title.toLowerCase().includes(s) || c.prompt.toLowerCase().includes(s))
    );
    if (sort === "Longest") out.sort((a, b) => b.seconds - a.seconds);
    if (sort === "Most credits") out.sort((a, b) => b.credits - a.credits);
    return out;
  }, [q, kind, project, sort]);

  // Newest groups the clips by day; other sorts show one plain run.
  const groups = useMemo(() => {
    if (sort !== "Newest") return [{ name: sort === "Longest" ? "Longest first" : "Most credits first", items: list }];
    return ["Today", "Yesterday", "Earlier"].map((name) => ({ name, items: list.filter((c) => bucket(c) === name) })).filter((g) => g.items.length);
  }, [list, sort]);

  const used = clips.reduce((n, c) => n + c.credits, 0);
  const countFor = (id: string) => clips.filter((c) => c.project === id).length;

  return (
    <div className="mx-auto max-w-[1500px] px-5 pb-20 pt-6 lg:px-8">
      <Reveal y={20} className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className={mono}>{clips.length} shots · {used.toLocaleString()} credits spent</p>
          <h1 className="display mt-3 text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.94]">
            Every shot<br />
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(236,229,211,0.85)" }}>you&rsquo;ve made.</span>
          </h1>
        </div>
        <label className="relative w-full sm:w-80">
          <span className="sr-only">Search the library</span>
          <Icon name="search" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search titles and prompts" className="field !rounded-[6px] !border-white/10 bg-white/[0.06] py-3 pl-10 text-[13px]" />
        </label>
      </Reveal>

      {/* projects as reels: pick one to filter */}
      <Reveal delay={80} y={20} className="no-scrollbar -mx-5 mt-8 overflow-x-auto px-5 py-2 lg:-mx-8 lg:px-8 xl:mx-0 xl:px-0">
        <ul className="flex gap-3 xl:grid xl:grid-cols-5">
          {[{ id: "all", name: "Everything", scene: "skyline" as const, count: clips.length }, ...projects.map((p) => ({ id: p.id, name: p.name, scene: p.scene, count: countFor(p.id) }))].map((p) => {
            const on = project === p.id;
            return (
              <li key={p.id} className="w-44 shrink-0 xl:w-auto">
                <button type="button" aria-pressed={on} onClick={() => setProject(p.id)} className={`group relative block aspect-[16/9] w-full overflow-hidden rounded-[6px] text-left ring-1 transition-all duration-300 ${on ? "ring-2 ring-safelight shadow-[0_18px_50px_-20px_rgba(240,83,43,0.7)]" : "opacity-65 ring-white/10 hover:opacity-100"}`}>
                  <Still scene={p.scene} className="!rounded-none h-full w-full transition-transform duration-700 group-hover:scale-105" />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
                  <span className="absolute left-3 top-2 font-display text-3xl leading-none" style={{ color: "transparent", WebkitTextStroke: "1.2px rgba(255,255,255,0.85)" }}>{String(p.count).padStart(2, "0")}</span>
                  <span className="absolute inset-x-0 bottom-0 p-3"><span className="block text-[13px] font-semibold leading-tight text-white">{p.name}</span></span>
                </button>
              </li>
            );
          })}
        </ul>
      </Reveal>

      {/* controls */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Seg items={kinds} value={kind} onChange={setKind} label="Type" />
        <Seg items={sorts} value={sort} onChange={setSort} label="Sort" />
        <div className="ml-auto flex bg-white/[0.06] p-1 rounded-[6px]" role="group" aria-label="View">
          {([["grid", "Grid"], ["list", "List"]] as const).map(([v, l]) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`rounded-[4px] px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${view === v ? "bg-bone text-ink" : "text-silver hover:text-bone"}`}>{l}</button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-14 border border-dashed border-line-2 py-20 text-center rounded-[6px]">
          <p className="font-display text-2xl">Nothing matches that.</p>
          <p className="mt-2 text-sm text-dim">Try fewer filters, or search for a word from the prompt.</p>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {groups.map((g) => (
            <section key={g.name}>
              <div className="mb-5 flex items-center gap-4">
                <h2 className="font-display text-2xl">{g.name}</h2>
                <span className="h-px flex-1 bg-line" />
                <span className={mono}>{g.items.length} {g.items.length === 1 ? "shot" : "shots"}</span>
              </div>
              {view === "grid" ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {g.items.map((c, i) => (
                    <Reveal key={c.id} y={22} delay={(i % 4) * 60}><ClipCard clip={c} /></Reveal>
                  ))}
                </div>
              ) : (
                <ul className="divide-y divide-line border-y border-line">
                  {g.items.map((c) => (
                    <li key={c.id}>
                      <Link href={`/library/${c.id}`} className="group grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4 py-3 transition-colors hover:bg-white/[0.03] sm:grid-cols-[132px_minmax(0,1fr)_auto] lg:grid-cols-[132px_minmax(0,1.4fr)_minmax(0,1fr)_88px_88px_110px]">
                        <span className="relative block aspect-[16/10] overflow-hidden ring-1 ring-white/10"><Still scene={c.scene} className="!rounded-none h-full w-full transition-transform duration-500 group-hover:scale-105" /></span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">{c.title}</span>
                          <span className="mt-0.5 block truncate text-xs text-dim">{c.prompt}</span>
                        </span>
                        <span className="hidden min-w-0 lg:block"><span className="block truncate text-sm text-silver">{modelById(c.model).name}</span><span className={mono}>{c.aspect} · {c.res}</span></span>
                        <span className="hidden font-mono text-xs text-silver lg:block">{c.kind === "Video" ? fmtTime(c.seconds) : "Still"}</span>
                        <span className="hidden font-mono text-xs text-silver lg:block">{c.credits} cr</span>
                        <span className="hidden justify-self-end sm:block"><StatusDot status={c.status} progress={c.progress} /></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
