"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Clip } from "@/components/clip";
import { Reveal } from "@/components/reveal";
import { Still } from "@/components/still";
import { castById, clipById, posts, type Post } from "@/lib/mock";

const cats = ["All", "Faceless", "Narrative", "Commerce", "B-roll", "Animation"] as const;
const sorts = ["Trending", "Most remixed", "New"] as const;
const ratio = { "9:16": "9 / 16", "16:9": "16 / 9", "1:1": "1 / 1" } as const;

// The real footage we have, by scene. A scene with no clip (the 1888 garden) shows its drawn frame instead.
const rail: Partial<Record<Post["scene"], number>> = { alley: 9, dunes: 2, bottle: 3, subway: 4, lighthouse: 5, door: 6, skyline: 7, table: 1, forest: 8 };
const src = (n: number) => ({ mp4: `/media/rail/rail-${n}.mp4`, jpg: `/media/rail/rail-${n}.jpg` });

// A tile: the poster, and the clip starts as soon as the pointer is on it. The clip is not even requested until then.
function Tile({ p, delay }: { p: Post; delay: number }) {
  const n = rail[p.scene];
  const [armed, setArmed] = useState(false);
  const [hot, setHot] = useState(false);
  return (
    <Reveal as="article" delay={delay} y={26} className="group mb-7 break-inside-avoid">
      <Link
        href="/signup"
        className="relative block overflow-hidden rounded-[22px] bg-night ring-1 ring-ink/10"
        style={{ aspectRatio: ratio[p.aspect] }}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") { setArmed(true); setHot(true); } }}
        onPointerLeave={() => setHot(false)}
        onFocus={() => { setArmed(true); setHot(true); }}
        onBlur={() => setHot(false)}
      >
        {n ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src(n).jpg} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            {armed && <Clip src={src(n).mp4} poster={src(n).jpg} play={hot} className={`absolute inset-0 transition-opacity duration-500 ${hot ? "opacity-100" : "opacity-0"}`} />}
          </>
        ) : (
          <Still scene={p.scene} playing className="absolute inset-0 h-full w-full" />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 opacity-70 transition-opacity group-hover:opacity-100" />
        <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">{p.category}</span>
        <span className="absolute bottom-3 left-3 z-10 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="btn btn-light btn-sm"><Icon name="remix" size={13} /> Remix</span>
        </span>
      </Link>
      <h3 className="mt-3 text-[15px] font-semibold leading-snug">{p.title}</h3>
      <p className="mt-1 flex items-center justify-between gap-3 text-xs text-ink/50">
        <span className="min-w-0 truncate">@{p.by} · {p.model}</span>
        <span className="flex shrink-0 items-center gap-3">
          <span className="flex items-center gap-1"><Icon name="heart" size={11} /> {p.likes}</span>
          <span className="flex items-center gap-1"><Icon name="remix" size={11} /> {p.remixes}</span>
        </span>
      </p>
    </Reveal>
  );
}

// The clip of the week, with the prompt and camera behind it, because that is what people come here to take.
function Pick() {
  const post = posts[0];
  const clip = clipById("c01");
  const mara = castById("mara");
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const copy = async () => {
    try { await navigator.clipboard.writeText(clip?.prompt ?? ""); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };
  return (
    <div ref={root} className="grid items-center gap-10 rounded-[28px] bg-ink p-5 text-paper sm:gap-14 sm:rounded-[36px] sm:p-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:p-10">
      <Reveal y={30} scale={0.97} className="relative mx-auto w-full max-w-[20rem] lg:max-w-none">
        <div className="relative aspect-[5/6] overflow-hidden rounded-[18px] bg-night-2 ring-1 ring-white/15">
          <Clip src={src(9).mp4} poster={src(9).jpg} play={visible} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          <p className="absolute left-3 top-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/85"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-safelight" /> Rec</p>
        </div>
      </Reveal>
      <div>
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full bg-safelight/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-safelight"><span className="h-1.5 w-1.5 rounded-full bg-safelight" /> Pick of the week</p>
          <h2 className="display mt-5 text-[clamp(2rem,4.4vw,3.8rem)] leading-[1]">{post.title}</h2>
          <p className="mt-3 text-paper/55">@{post.by} · {post.model} · {clip?.seconds} s · {clip?.res}</p>
        </Reveal>
        <Reveal delay={110} y={20} className="mt-7 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/45">The prompt</p>
            <button type="button" onClick={copy} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white/20">
              <Icon name={copied ? "check" : "copy"} size={12} /> {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-3 font-mono text-[13.5px] leading-relaxed text-paper/85">{clip?.prompt}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"><Icon name="m-dolly-in" size={12} className="text-safelight" /> {clip?.camera}</span>
            {mara && <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"><Icon name="lock" size={12} className="text-safelight" /> Cast: {mara.name}</span>}
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"><Icon name="heart" size={12} /> {post.likes}</span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"><Icon name="remix" size={12} /> {post.remixes}</span>
          </div>
        </Reveal>
        <Reveal delay={200} y={20} className="mt-7 flex flex-wrap items-center gap-4">
          <Link href="/signup" className="btn btn-primary px-7 py-4">Remix with your cast <Icon name="arrow" size={15} /></Link>
          <Link href="/models#seedance" className="text-[15px] font-semibold underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-safelight">Shot on {post.model}</Link>
        </Reveal>
      </div>
    </div>
  );
}

export function ExploreGallery() {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Trending");
  const list = posts.filter((p) => cat === "All" || p.category === cat);
  const num = (s: string) => parseFloat(s) * (s.includes("k") ? 1000 : 1);
  const sorted = sort === "Most remixed" ? [...list].sort((a, b) => num(b.remixes) - num(a.remixes)) : sort === "New" ? [...list].reverse() : list;
  const count = (c: (typeof cats)[number]) => (c === "All" ? posts.length : posts.filter((p) => p.category === c).length);

  return (
    <>
      <Pick />

      <div className="sticky top-[67px] z-30 -mx-4 mt-14 border-y border-ink/10 bg-[#f8f6f1]/85 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {cats.map((c) => (
            <button key={c} type="button" className="chip chip-paper px-4 py-2 text-[13px]" data-on={cat === c} onClick={() => setCat(c)}>
              {c} <span className="ml-1 text-ink/40">{count(c)}</span>
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-ink/15 lg:block" />
          <div className="flex flex-wrap gap-2 lg:ml-auto">
            {sorts.map((s) => <button key={s} type="button" className="chip chip-paper px-4 py-2 text-[13px]" data-on={sort === s} onClick={() => setSort(s)}>{s}</button>)}
          </div>
        </div>
      </div>

      <div key={`${cat}-${sort}`} className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
        {sorted.map((p, i) => <Tile key={p.id} p={p} delay={(i % 4) * 70} />)}
      </div>
      {sorted.length === 0 && <p className="py-20 text-center text-ink/50">Nothing in this category yet.</p>}
    </>
  );
}
