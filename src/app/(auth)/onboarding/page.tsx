"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";

const uses = [
  { id: "faceless", label: "Faceless channel", blurb: "Narrated series, a recurring character", img: 1 },
  { id: "shorts", label: "Shorts and TikTok", blurb: "Fast, vertical first", img: 8 },
  { id: "ads", label: "Ads and product", blurb: "Product shots and loops", img: 3 },
  { id: "broll", label: "B-roll for edits", blurb: "Landscapes and atmosphere", img: 2 },
];
const shapes = [
  { id: "9:16", label: "Vertical", blurb: "Shorts, Reels, TikTok", w: "w-5", h: "h-9" },
  { id: "16:9", label: "Wide", blurb: "YouTube, film", w: "w-9", h: "h-5" },
  { id: "1:1", label: "Square", blurb: "Feeds, ads", w: "w-7", h: "h-7" },
];
const paces = ["1–2 a week", "3–5 a week", "6–10 a week", "Every day"];
const STEPS = ["What you make", "Your pace", "Ready"];

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${on ? "bg-ink text-paper" : "bg-paper-2 text-ink/70 hover:bg-paper-line"}`}>{children}</button>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [use, setUse] = useState<string | null>(null);
  const [shape, setShape] = useState<string | null>(null);
  const [pace, setPace] = useState<string | null>(null);
  const chosen = uses.find((u) => u.id === use);
  const canNext = step === 0 ? !!use : step === 1 ? !!shape && !!pace : true;

  return (
    <>
      <div className="mb-5">
        <div className="flex gap-1.5" aria-hidden="true">
          {STEPS.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-ink" : "bg-ink/12"}`} />)}
        </div>
        <p className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">
          <span>Step {step + 1} of {STEPS.length} · {STEPS[step]}</span>
          {step < 2 && <Link href="/dashboard" className="normal-case tracking-normal text-ink/50 underline-offset-4 hover:text-ink hover:underline">Skip</Link>}
        </p>
      </div>

      <div key={step} className="enter-rise" style={{ ["--d" as string]: "0s", animationDuration: "0.55s" }}>
        {step === 0 && (
          <>
            <h1 className="display text-[2.2rem] leading-[1] sm:text-4xl">What are you making?</h1>
            <p className="mt-3 text-ink/60 [@media(max-height:700px)]:hidden">This picks your starting templates. Change it any time.</p>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {uses.map((u) => {
                const on = use === u.id;
                return (
                  <li key={u.id}>
                    <button type="button" aria-pressed={on} onClick={() => setUse(u.id)} className={`group relative block w-full overflow-hidden rounded-3xl text-left transition-all ${on ? "ring-[3px] ring-ink ring-offset-2 ring-offset-paper" : "ring-1 ring-ink/10 hover:ring-ink/30"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/media/rail/rail-${u.img}.jpg`} alt="" className="aspect-[4/5] w-full object-cover [@media(max-height:900px)]:aspect-[3/2] transition-transform duration-700 group-hover:scale-[1.04]" />
                      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/5" />
                      <span className={`absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full transition-all ${on ? "scale-100 bg-safelight opacity-100" : "scale-75 opacity-0"}`}><Icon name="check" size={13} className="text-white" /></span>
                      <span className="absolute inset-x-0 bottom-0 p-3.5 text-paper">
                        <span className="block text-[15px] font-semibold leading-tight">{u.label}</span>
                        <span className="mt-0.5 block text-xs text-paper/65">{u.blurb}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="display text-[2.2rem] leading-[1] sm:text-4xl">How do you publish?</h1>
            <p className="mt-3 text-ink/60 [@media(max-height:700px)]:hidden">So your first batch is the right shape and size.</p>
            <p className="mb-2.5 mt-5 text-sm font-medium">Format</p>
            <ul className="grid grid-cols-3 gap-2.5">
              {shapes.map((s) => {
                const on = shape === s.id;
                return (
                  <li key={s.id}>
                    <button type="button" aria-pressed={on} onClick={() => setShape(s.id)} className={`flex w-full flex-col items-center gap-3 rounded-3xl px-2 py-4 text-center transition-colors ${on ? "bg-ink text-paper" : "bg-paper-2 hover:bg-paper-line"}`}>
                      <span className="grid h-10 place-items-center"><span className={`${s.w} ${s.h} rounded-[5px] border-2 ${on ? "border-safelight" : "border-ink/40"}`} /></span>
                      <span><span className="block text-sm font-semibold">{s.label}</span><span className={`mt-0.5 block text-[11px] leading-tight ${on ? "text-paper/60" : "text-ink/50"}`}>{s.blurb}</span></span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mb-2.5 mt-5 text-sm font-medium">Clips you want to post</p>
            <div className="flex flex-wrap gap-2">{paces.map((p) => <Chip key={p} on={pace === p} onClick={() => setPace(p)}>{p}</Chip>)}</div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="display text-[2.2rem] leading-[1] sm:text-4xl">You&rsquo;re ready</h1>
            <p className="mt-3 text-ink/60 [@media(max-height:700px)]:hidden">Your studio is set up. First thing to do: save a character so every clip looks like the same person.</p>
            <div className="mt-5 overflow-hidden rounded-3xl bg-ink text-paper">
              <div className="flex items-center gap-4 p-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/media/rail/rail-${chosen?.img ?? 1}.jpg`} alt="" className="h-20 w-16 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{chosen?.label ?? "Your studio"}</p>
                  <p className="mt-0.5 text-sm text-paper/55">{shape ?? "9:16"} · {pace ?? "3–5 a week"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm">
                <span className="text-paper/60">Starting balance</span>
                <span className="font-display text-lg">100 credits</span>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/70">
              {["Templates for your kind of channel are ready", "Failed renders are refunded automatically", "Upgrade only when you run out"].map((t) => (
                <li key={t} className="flex gap-3"><span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-safelight/15"><Icon name="check" size={11} className="text-safelight" /></span>{t}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3">
        {step > 0 && <button type="button" onClick={() => setStep((s) => s - 1)} className="btn btn-line-ink px-6 py-4">Back</button>}
        {step < 2 ? (
          <button type="button" disabled={!canNext} onClick={() => setStep((s) => s + 1)} className={`btn flex-1 py-4 ${canNext ? "btn-ink" : "cursor-not-allowed bg-ink/10 text-ink/40"}`}>Continue <Icon name="arrow" size={15} /></button>
        ) : (
          <Link href="/dashboard" className="btn btn-primary flex-1 py-4">Open your studio <Icon name="arrow" size={15} /></Link>
        )}
      </div>
    </>
  );
}
