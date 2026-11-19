import Link from "next/link";
import { Icon } from "@/components/icons";
import { fmtTime, StatusDot } from "@/components/bits";
import { MediaSlot } from "@/components/media-slot";
import { modelById, projectById, type Clip } from "@/lib/mock";

export function ClipCard({ clip, showProject = true, className = "", variant = "overlay" }: { clip: Clip; showProject?: boolean; className?: string; variant?: "overlay" | "monitor" | "frame" }) {
  const model = modelById(clip.model);
  const project = projectById(clip.project);
  const busy = clip.status !== "ready";
  const tc = `00:${String(Math.floor(clip.seconds)).padStart(2, "0")}:${String((clip.id.length * 7) % 24).padStart(2, "0")}`;

  // Dailies monitor: for clips still being made. Status on the picture, readout underneath.
  if (variant === "monitor") {
    const live = clip.status === "rendering";
    const corner = "absolute h-4 w-4 border-white/70";
    return (
      <Link href={`/library/${clip.id}`} className={`group block overflow-hidden rounded-[6px] bg-[#09090a] ring-1 ring-white/10 transition-all duration-500 hover:ring-safelight/60 hover:shadow-[0_24px_60px_-24px_rgba(240,83,43,0.5)] ${className}`}>
        <div className="relative aspect-[16/10] overflow-hidden">
          <div className="absolute inset-0 opacity-70 saturate-[.7] transition-all duration-700 group-hover:opacity-100 group-hover:saturate-100"><MediaSlot slot={`clip-${clip.id}`} fallback={clip.scene} className="!rounded-none" /></div>
          <span aria-hidden="true" className={`${corner} left-3 top-3 border-l-2 border-t-2`} />
          <span aria-hidden="true" className={`${corner} right-3 top-3 border-r-2 border-t-2`} />
          <span aria-hidden="true" className={`${corner} bottom-3 left-3 border-b-2 border-l-2`} />
          <span aria-hidden="true" className={`${corner} bottom-3 right-3 border-b-2 border-r-2`} />
          <span className={`absolute left-6 top-5 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] ${live ? "text-warn" : "text-white/70"}`}><span className={`h-2 w-2 rounded-full bg-current ${live ? "pulse-dot" : ""}`} />{live ? "Rec" : "Standby"}</span>
          <span className="absolute right-6 top-5 z-10 font-mono text-[10px] tracking-[0.12em] text-white/70">TC {tc}</span>
        </div>
        <div className="flex items-end justify-between gap-4 px-4 pb-3 pt-3.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{clip.title}</p>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-dim">{model.name} · {clip.aspect} · {clip.seconds}s</p>
          </div>
          <p className={`shrink-0 font-display text-2xl leading-none ${live ? "text-bone" : "text-dim"}`}>{live ? `${clip.progress ?? 0}%` : "Next"}</p>
        </div>
        <div className="h-[3px] bg-white/10"><div className="h-full bg-safelight shadow-[0_0_10px_rgba(240,83,43,0.9)]" style={{ width: `${live ? clip.progress ?? 0 : 0}%` }} /></div>
      </Link>
    );
  }

  // Film frame: a finished clip held in a strip of film, caption underneath.
  if (variant === "frame") {
    const holes = "pointer-events-none absolute inset-x-0 h-[6px] bg-[repeating-linear-gradient(to_right,transparent_0_6px,rgba(236,229,211,0.2)_6px_12px)]";
    return (
      <Link href={`/library/${clip.id}`} className={`group block ${className}`}>
        <div className="relative bg-[#070707] px-3 py-5 transition-colors duration-300 group-hover:bg-black">
          <span aria-hidden="true" className={`${holes} top-1.5`} />
          <span aria-hidden="true" className={`${holes} bottom-1.5`} />
          <div className="relative aspect-[16/10] overflow-hidden ring-1 ring-white/10 transition-shadow duration-300 group-hover:ring-safelight">
            <div className={clip.status === "failed" ? "h-full opacity-40 grayscale" : "h-full"}><MediaSlot slot={`clip-${clip.id}`} fallback={clip.scene} className="!rounded-none transition-transform duration-700 group-hover:scale-[1.04]" /></div>
            <span className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white">{fmtTime(clip.seconds)}</span>
            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink"><Icon name="play" size={16} className="ml-0.5" fill="currentColor" strokeWidth={0} /></span></span>
          </div>
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{clip.title}</p>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-dim">{showProject && project ? `${project.name} · ` : ""}{clip.when}</p>
          </div>
          <span className="shrink-0 border border-line-2 px-2 py-0.5 font-mono text-[10px] text-silver">{clip.aspect}</span>
        </div>
      </Link>
    );
  }
  return (
    <Link href={`/library/${clip.id}`} className={`group relative block aspect-[16/10] overflow-hidden rounded-[6px] bg-night-2 ring-1 ring-white/[0.08] transition-all duration-500 hover:-translate-y-1 hover:ring-safelight/60 hover:shadow-[0_24px_60px_-24px_rgba(240,83,43,0.55)] ${className}`}>
      <div className={`absolute inset-0 ${clip.status === "failed" ? "opacity-40 grayscale" : ""}`}>
        <MediaSlot slot={`clip-${clip.id}`} fallback={clip.scene} className="!rounded-none transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
      {busy && (
        <div className="absolute inset-x-0 bottom-[4.4rem] z-10 px-4">
          <StatusDot status={clip.status} progress={clip.progress} />
          {clip.status === "rendering" && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-safelight shadow-[0_0_12px_rgba(240,83,43,0.9)]" style={{ width: `${clip.progress ?? 0}%` }} /></div>
          )}
        </div>
      )}
      <span className="absolute left-3 top-3 z-10 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur-md">{clip.aspect}</span>
      <span className="absolute right-3 top-3 z-10 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[10px] text-white/80 backdrop-blur-md">{model.name}</span>
      {!busy && (
        <span className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-xl"><Icon name="play" size={18} className="ml-0.5" fill="currentColor" strokeWidth={0} /></span>
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-tight text-white">{clip.title}</p>
          <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-white/55">{showProject && project ? `${project.name} · ` : ""}{clip.when}</p>
        </div>
        {clip.kind === "Video" && !busy && <span className="shrink-0 font-mono text-[11px] text-white/80">{fmtTime(clip.seconds)}</span>}
      </div>
    </Link>
  );
}
