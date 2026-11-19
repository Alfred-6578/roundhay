import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { aspectClass, StatusDot } from "@/components/bits";
import { ClipCard } from "@/components/clip-card";
import { Player } from "@/components/player";
import { Reveal } from "@/components/reveal";
import { Portrait, Still } from "@/components/still";
import { castById, clipById, clips, modelById, projectById } from "@/lib/mock";

export function generateStaticParams() {
  return clips.map((c) => ({ id: c.id }));
}

const mono = "font-mono text-[10px] uppercase tracking-[0.16em] text-dim";
const panel = "rounded-[6px] bg-[linear-gradient(165deg,#19191c,#0f0f11)] ring-1 ring-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";

function Corners() {
  const c = "absolute h-6 w-6 border-white/80";
  return (
    <span aria-hidden="true" className="pointer-events-none absolute -inset-3">
      <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
    </span>
  );
}

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clip = clipById(id);
  if (!clip) notFound();
  const model = modelById(clip.model);
  const project = projectById(clip.project);
  const more = clips.filter((c) => c.id !== clip.id && c.project === clip.project && c.status === "ready").slice(0, 3);
  const maxW = clip.aspect === "9:16" ? "min(340px, 70vw)" : clip.aspect === "1:1" ? "min(560px, 100%)" : "100%";

  return (
    <div className="relative isolate overflow-hidden">
      {/* the shot's own light */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[78vh] overflow-hidden">
        <Still scene={clip.scene} className="!rounded-none h-full w-full scale-125 opacity-40 blur-3xl saturate-150" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,8,9,0.2),#0a0a0b_92%)]" />
      </div>

      <div className="mx-auto max-w-[1500px] px-5 pb-20 pt-6 lg:px-8">
        <Link href="/library" className={`${mono} inline-flex items-center gap-2 !text-silver hover:!text-bone`}>
          <Icon name="back" size={14} /> Library
        </Link>

        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="min-w-0">
            <Reveal y={18}>
              <p className={`${mono} flex flex-wrap items-center gap-x-3 gap-y-1`}>
                <span>{project?.name}</span><span className="text-line-2">/</span><span>{clip.when}</span><span className="text-line-2">/</span><StatusDot status={clip.status} progress={clip.progress} />
              </p>
              <h1 className="display mt-3 text-[clamp(2rem,4.8vw,4.4rem)] leading-[0.97]">{clip.title}</h1>
            </Reveal>

            {/* the screening */}
            <Reveal delay={80} y={24} className="mt-8">
              <div className="relative mx-auto" style={{ maxWidth: maxW }}>
                <div className="relative overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)] ring-1 ring-white/15">
                  <Player scene={clip.scene} seconds={Math.max(clip.seconds, 2)} className={`${aspectClass(clip.aspect)} !rounded-none`} />
                </div>
                <Corners />
              </div>
            </Reveal>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
              <button type="button" className="btn btn-primary shadow-[0_10px_40px_-12px_rgba(240,83,43,0.9)]"><Icon name="remix" size={16} /> Remix</button>
              <button type="button" className="btn btn-ghost !bg-white/10"><Icon name="download" size={16} /> Download</button>
              <button type="button" className="btn btn-ghost !bg-white/10"><Icon name="scene" size={16} /> Reframe</button>
              <button type="button" aria-label="More" className="btn btn-ghost !bg-white/10"><Icon name="dots" size={16} /></button>
            </div>
          </div>

          {/* the slate */}
          <Reveal as="aside" delay={140} y={24} className="min-w-0 space-y-4">
            <section className={`${panel} overflow-hidden`}>
              <div aria-hidden="true" className="h-4 bg-[repeating-linear-gradient(-45deg,#ece5d3_0_14px,#0a0a0b_14px_28px)]" />
              <dl className="grid grid-cols-2 divide-x divide-y divide-white/10 border-b border-white/10">
                {[["Production", project?.name ?? "—"], ["Scene", clip.id.toUpperCase()], ["Take", `${clip.versions} of ${clip.versions}`], ["Model", model.name]].map(([k, v]) => (
                  <div key={k} className="px-4 py-3">
                    <dt className={mono}>{k}</dt>
                    <dd className="mt-1 truncate font-display text-lg leading-tight">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="p-5">
                <p className={mono}>Script</p>
                <p className="mt-3 border-l-2 border-safelight pl-4 font-mono text-[13px] leading-relaxed text-bone/90">{clip.prompt}</p>
                <button type="button" className={`${mono} mt-4 inline-flex items-center gap-1.5 !text-silver hover:!text-bone`}><Icon name="copy" size={12} /> Copy prompt</button>
              </div>
            </section>

            {clip.cast.length > 0 && (
              <section className={`${panel} p-5`}>
                <p className={mono}>In the shot</p>
                <ul className="mt-4 space-y-3">
                  {clip.cast.map((cid) => {
                    const c = castById(cid)!;
                    return (
                      <li key={cid} className="flex items-center gap-4">
                        <span className="relative block h-12 w-12 shrink-0 rounded-full p-[2.5px]" style={{ background: `conic-gradient(from 200deg, hsl(${c.hue} 85% 58%), hsl(${(c.hue + 40) % 360} 80% 40%), hsl(${c.hue} 85% 58%))`, boxShadow: `0 0 20px -6px hsl(${c.hue} 85% 55% / 0.7)` }}>
                          <Portrait hue={c.hue} className="h-full w-full !rounded-full ring-2 ring-[#131315]" />
                        </span>
                        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{c.name}</span><span className="block text-xs text-dim">{c.role}</span></span>
                        <Icon name="lock" size={14} className="text-safelight" />
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <section className={`${panel} overflow-hidden`}>
              <p className={`${mono} px-5 pt-5`}>Settings</p>
              <dl className="mt-4 grid grid-cols-2 gap-px bg-white/10">
                {[["Camera", clip.camera], ["Length", clip.kind === "Image" ? "Still" : `${clip.seconds}s`], ["Shape", clip.aspect], ["Resolution", clip.res], ["Seed", String(clip.seed)], ["Cost", `${clip.credits} credits`]].map(([k, v]) => (
                  <div key={k} className="bg-[#111113] px-5 py-3.5">
                    <dt className={mono}>{k}</dt>
                    <dd className="mt-1 font-mono text-[13px]">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className={`${panel} p-5`}>
              <p className={mono}>Takes · {clip.versions}</p>
              <ul className="relative mt-4 flex gap-3 overflow-x-auto bg-black px-3 py-5">
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1.5 h-[6px] bg-[repeating-linear-gradient(to_right,transparent_0_6px,rgba(236,229,211,0.22)_6px_12px)]" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-1.5 h-[6px] bg-[repeating-linear-gradient(to_right,transparent_0_6px,rgba(236,229,211,0.22)_6px_12px)]" />
                {Array.from({ length: Math.min(clip.versions, 4) }, (_, i) => (
                  <li key={i} className="w-24 shrink-0">
                    <Still scene={clip.scene} className={`!rounded-none aspect-video w-full ring-2 ${i === 0 ? "ring-safelight" : "opacity-60 ring-transparent"}`} />
                    <p className="mt-1.5 font-mono text-[10px] text-dim">{i === 0 ? "Current" : `T${String(clip.versions - i).padStart(2, "0")}`}</p>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </div>

        {more.length > 0 && (
          <Reveal as="section" className="mt-16">
            <div className="flex items-center gap-4">
              <h2 className="font-display text-2xl">More from {project?.name}</h2>
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((c) => <ClipCard key={c.id} clip={c} showProject={false} variant="frame" />)}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
