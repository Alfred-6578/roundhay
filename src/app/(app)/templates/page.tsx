"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Still } from "@/components/still";
import { modelById, templates } from "@/lib/mock";

const cats = ["All", "Faceless", "Narrative", "Commerce", "B-roll", "Animation"] as const;
const mono = "font-mono text-[10px] uppercase tracking-[0.16em]";
// Alternating shapes make the wall feel hand-laid instead of a table.
const shapes = ["aspect-[4/5]", "aspect-[1/1]", "aspect-[5/6]", "aspect-[4/3]"];

export default function TemplatesPage() {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const list = templates.filter((t) => cat === "All" || t.category === cat);
  const [feature, ...rest] = list;
  const fm = feature ? modelById(feature.model) : null;

  return (
    <div className="mx-auto max-w-[1500px] px-5 pb-20 pt-6 lg:px-8">
      <Reveal y={20}>
        <p className={`${mono} text-dim`}>{templates.length} setups, from other channels</p>
        <h1 className="display mt-3 text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.94]">
          Start from<br />
          <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(236,229,211,0.85)" }}>something that works.</span>
        </h1>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-silver">A template is a working prompt, model, shape, length and camera move. Start from one and swap in your own cast.</p>
      </Reveal>

      <div className="no-scrollbar -mx-5 mt-8 overflow-x-auto px-5 lg:mx-0 lg:px-0">
        <div className="flex w-max gap-1 rounded-[6px] bg-white/[0.06] p-1" role="group" aria-label="Category">
          {cats.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={`rounded-[4px] px-4 py-1.5 text-[12px] font-semibold transition-colors ${cat === c ? "bg-bone text-ink" : "text-silver hover:text-bone"}`}>{c}</button>
          ))}
        </div>
      </div>

      {feature && fm && (
        <Reveal key={feature.id} y={24} className="mt-8">
          <Link href="/create" className="group relative isolate block overflow-hidden rounded-[6px] bg-[#0a0a0b] ring-1 ring-white/10 transition-shadow hover:shadow-[0_30px_80px_-30px_rgba(240,83,43,0.45)]">
            <Still scene={feature.scene} className="!absolute !rounded-none inset-y-0 right-0 -z-10 h-full w-full transition-transform duration-1000 group-hover:scale-105 md:w-[68%]" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#0a0a0b_30%,rgba(10,10,11,0.65)_52%,rgba(10,10,11,0.1)),linear-gradient(to_top,rgba(8,8,9,0.8),transparent_50%)]" />
            <div className="flex min-h-[26rem] flex-col justify-between gap-10 p-6 sm:p-10 md:min-h-[30rem]">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-safelight px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white">Most used</span>
                <span className="font-display text-5xl leading-none sm:text-6xl" style={{ color: "transparent", WebkitTextStroke: "1.3px rgba(255,255,255,0.85)" }}>{feature.uses}</span>
              </div>
              <div className="max-w-xl">
                <h2 className="display text-[clamp(2.2rem,5vw,4.4rem)] leading-[0.96] text-white">{feature.name}</h2>
                <p className="mt-4 text-white/75">{feature.blurb}</p>
                <dl className="mt-6 inline-grid grid-cols-4 divide-x divide-white/15 border border-white/15 bg-black/35 backdrop-blur">
                  {[["Model", fm.name], ["Shape", feature.aspect], ["Length", `${feature.seconds}s`], ["Type", feature.category]].map(([k, v]) => (
                    <div key={k} className="px-3.5 py-2.5 sm:px-5"><dt className={`${mono} text-white/45`}>{k}</dt><dd className="mt-1 font-mono text-[12px] text-white">{v}</dd></div>
                  ))}
                </dl>
                <div className="mt-7 flex items-center gap-5">
                  <span className="btn btn-primary shadow-[0_10px_40px_-10px_rgba(240,83,43,0.9)]">Use template <Icon name="arrow" size={15} /></span>
                  <span className={`${mono} text-white/50`}>by @{feature.by}</span>
                </div>
              </div>
            </div>
          </Link>
        </Reveal>
      )}

      <div className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {rest.map((t, i) => (
          <Reveal key={t.id} y={26} delay={(i % 3) * 70} className="mb-5 break-inside-avoid">
            <Link href="/create" className="group relative block overflow-hidden rounded-[6px] ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:ring-safelight/60 hover:shadow-[0_24px_60px_-24px_rgba(240,83,43,0.5)]">
              <div className={`relative ${shapes[i % shapes.length]}`}>
                <Still scene={t.scene} className="!rounded-none absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/35" />
                <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white backdrop-blur-md">{t.category}</span>
                <span className="absolute right-3 top-2 font-display text-3xl leading-none" style={{ color: "transparent", WebkitTextStroke: "1.2px rgba(255,255,255,0.85)" }}>{t.uses}</span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-xl leading-tight text-white">{t.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/65">{t.blurb}</p>
                  <div className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white/55">
                    <span>{modelById(t.model).name}</span><span>·</span><span>{t.aspect}</span><span>·</span><span>{t.seconds}s</span>
                  </div>
                </div>
                {/* revealed on hover */}
                <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-safelight px-4 py-3 text-sm font-semibold text-white transition-transform duration-300 group-hover:translate-y-0">Use template <Icon name="arrow" size={15} /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
