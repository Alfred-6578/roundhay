import Link from "next/link";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Portrait, Still } from "@/components/still";
import { cast, projectById, type SceneKey } from "@/lib/mock";

const sets: { name: string; scene: SceneKey; used: number; project: string }[] = [
  { name: "Rain alley, east side", scene: "alley", used: 14, project: "night-feed" },
  { name: "Subway platform B", scene: "subway", used: 6, project: "night-feed" },
  { name: "Interview room", scene: "table", used: 9, project: "lagos-files" },
  { name: "Corridor and door", scene: "door", used: 4, project: "lagos-files" },
  { name: "Lagos rooftops, dusk", scene: "skyline", used: 7, project: "lagos-files" },
];

const mono = "font-mono text-[10px] uppercase tracking-[0.16em]";
const C = 2 * Math.PI * 17;

export default function CastPage() {
  return (
    <div className="mx-auto max-w-[1500px] px-5 pb-20 pt-6 lg:px-8">
      <Reveal y={20} className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className={`${mono} text-dim`}>{cast.length} cast · {sets.length} sets</p>
          <h1 className="display mt-3 text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.94]">
            Same faces.<br />
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(236,229,211,0.85)" }}>Every shot.</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-silver">Everything the models are told to keep the same. Add someone here once, and they show up in every clip you tag them in.</p>
        </div>
        <Link href="/create" className="btn btn-primary shadow-[0_10px_40px_-12px_rgba(240,83,43,0.9)]"><Icon name="plus" size={16} /> New cast member</Link>
      </Reveal>

      {/* the cast: casting cards, each lit in its own colour */}
      <section className="mt-12">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-2xl">Cast</h2>
          <span className="h-px flex-1 bg-line" />
          <span className={`${mono} text-dim`}>{cast.length} locked</span>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-6">
          {cast.map((c, i) => {
            const score = 96 - i * 3;
            return (
              <Reveal as="li" key={c.id} y={26} delay={i * 70}>
                <article className="group relative aspect-[2/3] overflow-hidden rounded-[6px] ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1.5 hover:ring-white/40" style={{ background: `radial-gradient(circle at 50% 28%, hsl(${c.hue} 55% 24%), hsl(${c.hue} 30% 9%) 70%)`, boxShadow: `0 30px 60px -40px hsl(${c.hue} 85% 55% / 0.55)` }}>
                  <Portrait hue={c.hue} className="!rounded-none absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
                  <span className={`${mono} absolute left-3 top-3 text-white/60`}>Cast {String(i + 1).padStart(2, "0")}</span>
                  {/* consistency ring */}
                  <span className="absolute right-3 top-2.5 grid h-11 w-11 place-items-center">
                    <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90" aria-hidden="true">
                      <circle cx="22" cy="22" r="17" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                      <circle cx="22" cy="22" r="17" fill="none" stroke={`hsl(${c.hue} 90% 62%)`} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${C * (score / 100)} ${C}`} />
                    </svg>
                    <span className="font-mono text-[10px] text-white">{score}</span>
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-display text-xl leading-tight text-white">{c.name}</p>
                      <Icon name="lock" size={12} className="shrink-0 text-safelight" />
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-white/65">{c.role}</p>
                    <p className="mt-3 truncate font-mono text-[10px] uppercase tracking-[0.08em] text-white/45">{c.episodes} clips · {projectById(c.project)?.name}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
          <Reveal as="li" y={26} delay={cast.length * 70}>
            <Link href="/create" className="group flex aspect-[2/3] flex-col items-center justify-center gap-3 rounded-[6px] border border-dashed border-white/25 p-4 text-center text-sm text-silver transition-colors hover:border-white hover:bg-white/[0.04] hover:text-bone">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white/[0.07] transition-colors group-hover:bg-safelight group-hover:text-white"><Icon name="plus" size={20} /></span>
              Upload a reference
              <span className="text-xs text-dim">or keep a frame from any clip</span>
            </Link>
          </Reveal>
        </ul>
      </section>

      {/* sets: the locations */}
      <section className="mt-16">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-2xl">Sets</h2>
          <span className="h-px flex-1 bg-line" />
          <span className={`${mono} text-dim`}>{sets.length} locations</span>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:grid-rows-2">
          {sets.map((s, i) => (
            <Reveal as="li" key={s.name} y={26} delay={i * 70} className={i === 0 ? "col-span-2 lg:row-span-2" : ""}>
              <article className="group relative h-full min-h-[11rem] overflow-hidden rounded-[6px] ring-1 ring-white/10 transition-all duration-500 hover:ring-safelight/60 hover:shadow-[0_24px_60px_-24px_rgba(240,83,43,0.5)]">
                <Still scene={s.scene} className="!rounded-none absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
                <span className={`${mono} absolute left-4 top-4 text-white/60`}>Loc {String(i + 1).padStart(2, "0")}</span>
                <span className="absolute right-4 top-3 font-display text-3xl leading-none" style={{ color: "transparent", WebkitTextStroke: "1.2px rgba(255,255,255,0.8)" }}>{String(s.used).padStart(2, "0")}</span>
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className={`font-display leading-tight text-white ${i === 0 ? "text-2xl sm:text-3xl" : "text-lg"}`}>{s.name}</p>
                  <p className={`${mono} mt-1.5 text-white/55`}>{s.used} clips · {projectById(s.project)?.name}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>
    </div>
  );
}
