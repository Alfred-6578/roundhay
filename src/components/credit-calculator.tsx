"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { models, plans } from "@/lib/mock";

// What each plan can spend in a month, and which models it includes.
const limits: Record<string, { credits: number; models: string[] | "all" }> = {
  starter: { credits: 100, models: ["wan", "seedance"] },
  creator: { credits: 1500, models: "all" },
  studio: { credits: 8000, models: "all" },
};
const WEEKS = 4.33;

// "How much will I shoot?" turned into credits, and the plan that covers it.
export function CreditCalculator() {
  const [id, setId] = useState("seedance");
  const [seconds, setSeconds] = useState(8);
  const [perWeek, setPerWeek] = useState(4);
  const m = models.find((x) => x.id === id) ?? models[0];
  const len = Math.min(seconds, m.maxSeconds);

  const month = Math.round(m.creditsPerSecond * len * perWeek * WEEKS);
  const footage = Math.round(len * perWeek * WEEKS);
  const covers = (planId: string) => {
    const l = limits[planId];
    return month <= l.credits && (l.models === "all" || l.models.includes(id));
  };
  const pick = plans.find((p) => covers(p.id));
  const over = !pick;
  const mins = footage >= 120 ? `${(footage / 60).toFixed(1).replace(/\.0$/, "")} minutes` : `${footage} seconds`;

  return (
    <div className="grid gap-3 lg:grid-cols-[1.05fr_1fr]">
      {/* what you shoot */}
      <div className="rounded-[28px] bg-paper-2 p-6 sm:rounded-[36px] sm:p-10">
        <fieldset>
          <legend className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">Model</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {models.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setId(x.id)}
                aria-pressed={x.id === id}
                className={`rounded-2xl px-3 py-3 text-left transition-colors ${x.id === id ? "bg-ink text-paper" : "bg-paper text-ink/70 hover:bg-white"}`}
              >
                <span className="block text-sm font-semibold leading-tight">{x.name}</span>
                <span className={`mt-1 block font-mono text-[11px] ${x.id === id ? "text-paper/55" : "text-ink/40"}`}>{x.creditsPerSecond} credits / s</span>
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-9 block">
          <span className="flex items-baseline justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">Length of a clip</span>
            <span className="font-display text-2xl">{len} s</span>
          </span>
          <input type="range" min={4} max={m.maxSeconds} step={1} value={len} onChange={(e) => setSeconds(+e.target.value)} className="range mt-3 w-full" aria-label="Seconds per clip" />
          <span className="mt-1 flex justify-between text-xs text-ink/40"><span>4 s</span><span>{m.maxSeconds} s</span></span>
        </label>

        <label className="mt-8 block">
          <span className="flex items-baseline justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">Clips a week</span>
            <span className="font-display text-2xl">{perWeek}</span>
          </span>
          <input type="range" min={1} max={60} step={1} value={perWeek} onChange={(e) => setPerWeek(+e.target.value)} className="range mt-3 w-full" aria-label="Clips per week" />
          <span className="mt-1 flex justify-between text-xs text-ink/40"><span>1</span><span>60</span></span>
        </label>
      </div>

      {/* what it comes to */}
      <div className="flex flex-col rounded-[28px] bg-ink p-6 text-paper sm:rounded-[36px] sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/45">You would use about</p>
        <p className="mt-3 flex items-baseline gap-3">
          <span className="display text-[clamp(3.4rem,8vw,5.5rem)] leading-none">{month.toLocaleString("en-US")}</span>
          <span className="text-paper/55">credits a month</span>
        </p>
        <p className="mt-2 text-sm text-paper/50">About {mins} of footage.</p>

        <ul className="mt-8 space-y-3">
          {plans.map((p) => {
            const l = limits[p.id];
            const fits = covers(p.id);
            const pct = Math.min(100, (month / l.credits) * 100);
            const cameraOk = l.models === "all" || l.models.includes(id);
            return (
              <li key={p.id}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className={fits ? "font-semibold text-paper" : "text-paper/45"}>{p.name}</span>
                  <span className={`font-mono text-xs ${fits ? "text-paper/80" : "text-paper/35"}`}>
                    {!cameraOk ? "not on this model" : month > l.credits ? `${l.credits.toLocaleString("en-US")} credits, too few` : `${Math.round(pct)}% of ${l.credits.toLocaleString("en-US")}`}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full transition-[width] duration-500 ${fits ? "bg-safelight" : "bg-white/25"}`} style={{ width: `${cameraOk ? pct : 0}%` }} />
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-9">
          {pick ? (
            <>
              <p className="text-paper/70">That fits <span className="font-semibold text-paper">{pick.name}</span> at <span className="font-semibold text-paper">{pick.price}</span> a month.</p>
              <Link href="/signup" className="btn btn-light mt-4 px-7 py-4">{pick.cta} <Icon name="arrow" size={15} /></Link>
            </>
          ) : (
            <>
              <p className="text-paper/70">That is more than Studio includes in a month. We can set up extra credits for you.</p>
              <Link href="/help" className="btn btn-light mt-4 px-7 py-4">Talk to us <Icon name="arrow" size={15} /></Link>
            </>
          )}
          {over && <span className="sr-only">Over the largest plan</span>}
        </div>
      </div>
    </div>
  );
}
