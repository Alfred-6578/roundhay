import type { ReactNode } from "react";

// The carousel's category marks. One drawn glyph per kind of film, each built from the subject of its clip,
// on a 24 grid: bone line work plus one orange accent (the thing that is lit, poured, moving or playing).
// The badge is a small lens dial: a ring of film-counter ticks around a dark disc, which turns slowly when
// the card is the active one.

export type GlyphName = "voice" | "dunes" | "bottle" | "clap" | "ghost" | "door" | "city" | "stack" | "lens";

const A = "text-safelight"; // accent colour class; the accent shapes use currentColor

const glyphs: Record<GlyphName, ReactNode> = {
  // faceless channels: a voice, drawn as its waveform, with the loudest bar lit
  voice: (
    <>
      <path d="M3.5 10.5v3M7 8v8M14 6.5v11M17.5 9v6M21 10.5v3" />
      <path d="M10.5 4v16" className={A} strokeWidth="2.4" stroke="currentColor" />
    </>
  ),
  // travel b-roll: low sun over two dunes
  dunes: (
    <>
      <circle cx="16.5" cy="8.5" r="3.2" className={A} fill="currentColor" stroke="none" />
      <path d="M2.5 18.5c3.4-5.2 6.6-5.2 9.6-.8 2.3 3.1 5.8 2.7 9.4-1.7" />
      <path d="M2.5 21.5h19" opacity=".5" />
    </>
  ),
  // product ads: a dropper bottle with its oil
  bottle: (
    <>
      <path d="M10.4 8.6V5.2a1.6 1.6 0 013.2 0v3.4" />
      <path d="M9 8.6h6M8.2 11.2h7.6a1.2 1.2 0 011.2 1.2v6.9a2.2 2.2 0 01-2.2 2.2H9.2A2.2 2.2 0 017 19.3v-6.9a1.2 1.2 0 011.2-1.2z" />
      <path d="M7.4 15.4h9.2v3.9a1.8 1.8 0 01-1.8 1.8H9.2a1.8 1.8 0 01-1.8-1.8z" className={A} fill="currentColor" stroke="none" opacity=".95" />
    </>
  ),
  // short film: the clapperboard, its stick striped
  clap: (
    <>
      <path d="M3.6 7.6l16.7-3.8.8 3.7-16.7 3.9z" />
      <path d="M8.4 8.4l1.1-2.7M12.6 7.5l1.1-2.7M16.8 6.5l1.1-2.7" className={A} stroke="currentColor" strokeWidth="2" />
      <path d="M4.4 11.4h16.2v9.1H4.4z" />
      <path d="M8 15.5h8" opacity=".5" />
    </>
  ),
  // animation: a bouncing ball, two ghost frames behind it (onion skin)
  ghost: (
    <>
      <path d="M5 16.5C8 5.5 16 5.5 19 16.5" strokeDasharray="1.6 2.6" opacity=".55" />
      <circle cx="5" cy="17" r="2" opacity=".4" />
      <circle cx="12" cy="7.6" r="2.2" opacity=".7" />
      <circle cx="19" cy="16.6" r="2.7" className={A} fill="currentColor" stroke="none" />
      <path d="M2.5 21.5h19" opacity=".5" />
    </>
  ),
  // micro drama: a door left open, the light from the other room spilling out
  door: (
    <>
      <path d="M12.8 6.4H18v14.8h-5.2z" className={A} fill="currentColor" stroke="none" opacity=".9" />
      <path d="M6 21.2V4.2h12v17M6 4.2l6.8 2.2v14.8L6 21.2" />
      <path d="M2.5 21.2h19" opacity=".5" />
    </>
  ),
  // city b-roll: three towers, the evening windows coming on
  city: (
    <>
      <path d="M3 21V11.5h5V21M8 21V4.5h6.2V21M14.2 21v-9.5h6.8V21M2 21h20" />
      <path d="M10.2 8h1.8M10.2 11.6h1.8M10.2 15.2h1.8M16.4 14.8h1.8M4.6 15.4h1.8" className={A} stroke="currentColor" strokeWidth="1.9" />
    </>
  ),
  // series: episodes stacked, the newest playing
  stack: (
    <>
      <rect x="9" y="3.5" width="11.5" height="8.5" rx="1.2" opacity=".4" />
      <rect x="6.5" y="6.5" width="11.5" height="8.5" rx="1.2" opacity=".7" />
      <rect x="4" y="9.5" width="11.8" height="10.5" rx="1.3" />
      <path d="M8.7 12.6v4.8l4.1-2.4z" className={A} fill="currentColor" stroke="none" />
    </>
  ),
  // true crime: a lens over a thumbprint
  lens: (
    <>
      <circle cx="10.4" cy="10.4" r="6.6" />
      <path d="M15.3 15.3L21 21" strokeWidth="2.2" />
      <path d="M7 11.6a3.4 3.4 0 016.8 0M8.9 11.6a1.5 1.5 0 013 0" className={A} stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10.4" cy="11.6" r=".9" className={A} fill="currentColor" stroke="none" />
    </>
  ),
};

export function RailGlyph({ name, on }: { name: GlyphName; on: boolean }) {
  return (
    <span className="relative -mt-6 grid h-12 w-12 place-items-center">
      {/* the dial: film-counter ticks around the disc */}
      <svg viewBox="0 0 48 48" className={`absolute inset-0 ${on ? "text-safelight [animation:dial_16s_linear_infinite] motion-reduce:[animation:none]" : "text-white/25"}`} aria-hidden="true">
        <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeDasharray="0.9 3.35" />
      </svg>
      <span className={`absolute inset-[5px] rounded-full border bg-night transition-shadow ${on ? "border-safelight/70 shadow-[0_0_26px_rgba(255,77,31,.5),inset_0_0_14px_rgba(255,77,31,.14)]" : "border-white/12"}`} />
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`relative ${on ? "text-white" : "text-bone"}`} aria-hidden="true">
        {glyphs[name]}
      </svg>
    </span>
  );
}
