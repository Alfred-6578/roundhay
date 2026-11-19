import Link from "next/link";
import { Icon } from "@/components/icons";
import { ClipCard } from "@/components/clip-card";
import { MediaSlot } from "@/components/media-slot";
import { Reveal } from "@/components/reveal";
import { Portrait, Still } from "@/components/still";
import { activity, cast, clips, projects, stats, usageByDay } from "@/lib/mock";

const card = "rounded-[6px] bg-[linear-gradient(165deg,#19191c,#0f0f11)] ring-1 ring-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";
const eyebrow = "font-mono text-[10px] uppercase tracking-[0.16em] text-dim";

function Head({ title, href, link }: { title: string; href?: string; link?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="font-display text-2xl">{title}</h2>
      {href && <Link href={href} className="text-sm text-silver hover:text-bone">{link}</Link>}
    </div>
  );
}

export default function DashboardPage() {
  const active = clips.filter((c) => c.status === "rendering" || c.status === "queued");
  const done = clips.filter((c) => c.status === "ready" && c.kind === "Video");
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const used = stats.creditsTotal - stats.creditsLeft;
  const pct = stats.creditsLeft / stats.creditsTotal;
  const C = 2 * Math.PI * 26;
  const peak = Math.max(...usageByDay);
  const queued = clips.filter((c) => c.status === "queued" || c.status === "rendering").slice(0, 3);

  return (
    <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-6 lg:px-8">
      <Reveal as="section" y={20} className="relative isolate overflow-hidden rounded-[6px] bg-black ring-1 ring-white/10">
        <video className="absolute inset-0 -z-10 h-full w-full object-cover opacity-80" src="/media/rail/rail-4.mp4" poster="/media/rail/rail-4.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(8,8,9,0.92)_8%,rgba(8,8,9,0.35)_55%,rgba(8,8,9,0.55))]" />
        <div className="flex min-h-[27rem] flex-col justify-between gap-10 p-5 sm:min-h-[31rem] sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip !bg-black/40 backdrop-blur"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-warn" />2 rendering</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">{today} · Night Feed · Ep. 15</span>
          </div>
          <div>
            <h1 className="display text-[clamp(2.6rem,7.4vw,6.6rem)] leading-[0.94] text-white">
              What are we<br />
              <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.9)" }}>shooting?</span>
            </h1>
            {/* the slate: the prompt is the main object */}
            <form action="/create" className="mt-7 max-w-3xl overflow-hidden rounded-[6px] bg-black/45 ring-1 ring-white/15 backdrop-blur-xl">
              <div className="flex items-center gap-2 border-b border-white/10 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-safelight" /> Scene · Take {stats.clipsThisWeek + 1}
              </div>
              <label htmlFor="quick" className="sr-only">Describe a shot</label>
              <textarea id="quick" name="prompt" rows={2} placeholder="Mara steps off the last train into an empty station, steam curling along the platform…" className="w-full resize-none bg-transparent px-5 pt-4 font-mono text-[15px] leading-relaxed text-white outline-none placeholder:text-white/40" />
              <div className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-1">
                <span className="chip">Seedance 2.0</span>
                <span className="chip">9:16</span>
                <span className="chip">8 s</span>
                <span className="chip"><Icon name="lock" size={11} /> Mara Quill</span>
                <span className="chip max-sm:hidden"><Icon name="m-dolly-in" size={11} /> Dolly in</span>
                <span className="ml-auto font-mono text-xs text-white/50">80 credits</span>
                <button type="submit" className="btn btn-primary shadow-[0_10px_40px_-12px_rgba(240,83,43,0.9)]"><Icon name="spark" size={16} /> Roll camera</button>
              </div>
            </form>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          {/* the numbers */}
          <ul className="mt-0 grid gap-3 sm:grid-cols-2">
            {/* credits */}
            <li className={`${card} flex items-center gap-5 p-5`}>
              <div className="relative h-[104px] w-[104px] shrink-0">
                <svg viewBox="0 0 104 104" className="-rotate-90 drop-shadow-[0_0_14px_rgba(240,83,43,0.45)]" aria-hidden="true">
                  <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff8a3d" /><stop offset="1" stopColor="#f0532b" /></linearGradient></defs>
                  <circle cx="52" cy="52" r="44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
                  <circle cx="52" cy="52" r="44" fill="none" stroke="url(#cg)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${C * pct} ${C}`} />
                </svg>
                <span className="absolute inset-0 grid place-items-center text-center"><span className="font-display text-[1.7rem] leading-none">{stats.creditsLeft}<span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] text-dim">credits</span></span></span>
              </div>
              <div className="min-w-0">
                <p className={eyebrow}>Film stock left</p>
                <p className="mt-2 text-sm text-silver">About <span className="font-semibold text-bone">{Math.floor(stats.creditsLeft / 80)} clips</span> like the one above.</p>
                <p className="mt-1 text-xs text-dim">{used.toLocaleString()} of {stats.creditsTotal.toLocaleString()} used · resets Dec 1</p>
                <Link href="/settings/billing" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-safelight hover:underline">Add credits <Icon name="arrow" size={12} /></Link>
              </div>
            </li>
            {/* clips this week */}
            <li className={`${card} p-5`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-[2.4rem] leading-none">{stats.clipsThisWeek}</p>
                  <p className={`${eyebrow} mt-2`}>Clips this week</p>
                </div>
                <span className="rounded-full bg-safelight/15 px-2.5 py-1 font-mono text-[10px] text-safelight">+6 vs last</span>
              </div>
              <div className="mt-4 flex h-14 items-end gap-1.5" aria-label="Credits used per day, last 14 days" role="img">
                {usageByDay.map((v, i) => (
                  <span key={i} title={`${v} credits`} className={`flex-1 rounded-t-[4px] ${i === usageByDay.length - 1 ? "bg-gradient-to-t from-safelight to-[#ff8a3d] shadow-[0_0_14px_rgba(240,83,43,0.6)]" : "bg-gradient-to-t from-white/10 to-white/30"}`} style={{ height: `${Math.max(10, (v / peak) * 100)}%` }} />
                ))}
              </div>
            </li>
            {/* queue */}
            <li className={`${card} p-5`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-[2.4rem] leading-none">{stats.queueDepth}</p>
                  <p className={`${eyebrow} mt-2`}>In the queue</p>
                </div>
                <div className="flex -space-x-3">
                  {queued.map((c) => (
                    <span key={c.id} className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-[#131315]"><Still scene={c.scene} className="h-full w-full !rounded-none" /></span>
                  ))}
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-night-3 font-mono text-[11px] text-silver ring-2 ring-[#131315]">+{Math.max(0, stats.queueDepth - queued.length)}</span>
                </div>
              </div>
              <p className="mt-4 truncate text-sm text-silver">Next: <span className="text-bone">{queued[0]?.title ?? "nothing waiting"}</span></p>
              <Link href="/batch" className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-safelight hover:underline">Open queue <Icon name="arrow" size={12} /></Link>
            </li>
            {/* next publish */}
            <li className="relative isolate overflow-hidden rounded-[6px] p-5 ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/rail/rail-9.jpg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">Next publish</p>
              <p className="mt-3 font-display text-[2.4rem] leading-none text-white">Thu 18:00</p>
              <p className="mt-2 text-sm text-white/75">Ep. 15 · Night Feed</p>
              <div className="mt-4 flex gap-2"><span className="chip !bg-black/40 backdrop-blur">YouTube</span><span className="chip !bg-black/40 backdrop-blur">9:16</span></div>
            </li>
          </ul>

          {active.length > 0 && (
            <Reveal as="section" className="mt-10">
              <Head title="On set now" />
              <div className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {active.map((c) => <ClipCard key={c.id} clip={c} variant="monitor" />)}
              </div>
            </Reveal>
          )}

          <Reveal as="section" className="mt-10">
            <Head title="Recent" href="/library" link="See all" />
            <div className="no-scrollbar -mx-5 -my-3 mt-1 flex gap-4 overflow-x-auto px-5 py-3 lg:-mx-8 lg:px-8 xl:mx-0 xl:px-0">
              {done.slice(0, 7).map((c) => <ClipCard key={c.id} clip={c} variant="frame" className="w-72 shrink-0 sm:w-80" />)}
            </div>
          </Reveal>

          <Reveal as="section" className="mt-10">
            <Head title="Projects" href="/library" link="Library" />
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 pt-6 sm:gap-x-6 2xl:grid-cols-4">
              {projects.map((p) => (
                <Link key={p.id} href="/library" className="group relative block">
                  {/* the cards behind: the project is a stack of episodes */}
                  <span aria-hidden="true" className="absolute inset-x-[10%] -top-4 bottom-0 rounded-[6px] bg-white/[0.07] ring-1 ring-white/10 transition-transform duration-500 group-hover:-translate-y-2" />
                  <span aria-hidden="true" className="absolute inset-x-[5%] -top-2 bottom-0 rounded-[6px] bg-white/[0.12] ring-1 ring-white/10 transition-transform duration-500 group-hover:-translate-y-1" />
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-night-2 ring-1 ring-white/15 sm:aspect-[5/4] 2xl:aspect-[4/5]">
                    <MediaSlot slot={`project-${p.id}`} fallback={p.scene} className="!rounded-none transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
                    <span className="absolute left-4 top-3 font-display text-[3.4rem] leading-none sm:text-[4.4rem]" style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.85)" }}>{String(p.clips).padStart(2, "0")}</span>
                    <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 sm:p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">clips · {p.episodes}</p>
                      <p className="mt-1 font-display text-lg leading-tight sm:text-2xl">{p.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>

        {/* side rail: the cast and what happened */}
        <aside className="min-w-0 space-y-8 xl:sticky xl:top-20 xl:self-start">
          <section className={`${card} p-5`}>
            <Head title="Your cast" href="/cast" link="Manage" />
            <p className="mt-1 text-xs text-dim">{cast.length} faces locked. They look the same in every shot.</p>
            <ul className="mt-5 grid grid-cols-3 gap-x-3 gap-y-5">
              {cast.map((c) => (
                <li key={c.id} className="text-center">
                  <span className="relative mx-auto block h-[68px] w-[68px] rounded-full p-[3px]" style={{ background: `conic-gradient(from 200deg, hsl(${c.hue} 85% 58%), hsl(${(c.hue + 40) % 360} 80% 40%), hsl(${c.hue} 85% 58%))`, boxShadow: `0 0 24px -6px hsl(${c.hue} 85% 55% / 0.7)` }}>
                    <Portrait hue={c.hue} className="h-full w-full !rounded-full ring-2 ring-[#131315]" />
                    <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-night ring-2 ring-[#131315]"><Icon name="lock" size={11} className="text-safelight" /></span>
                  </span>
                  <p className="mt-2.5 text-xs font-medium text-bone">{c.short}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-dim">{c.episodes} eps</p>
                </li>
              ))}
              <li className="text-center">
                <Link href="/cast" className="mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-full border border-dashed border-line-2 text-silver transition-colors hover:border-bone hover:text-bone"><Icon name="plus" size={18} /></Link>
                <p className="mt-2.5 text-xs text-silver">Add</p>
              </li>
            </ul>
          </section>

          <section className={`${card} p-5`}>
            <Head title="Activity" />
            <ol className="mt-5 space-y-1">
              {activity.map((a, i) => (
                <li key={i}>
                  <Link href={a.href} className="group flex items-start gap-3 rounded-[6px] p-2.5 transition-colors hover:bg-white/[0.04]">
                    <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${i === 0 ? "bg-safelight/15 text-safelight" : "bg-white/[0.06] text-silver"}`}><Icon name={(["check", "lock", "queue", "spark"] as const)[i % 4]} size={14} /></span>
                    <span className="min-w-0">
                      <span className="block text-sm leading-snug text-bone">{a.text}</span>
                      <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-dim">{a.t}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}
