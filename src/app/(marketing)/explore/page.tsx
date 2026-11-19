import type { Metadata } from "next";
import { ExploreGallery } from "@/components/explore-gallery";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "Explore — Roundhay" };

export default function ExplorePage() {
  return (
    <section className="px-4 pb-24 pt-14 sm:px-8 sm:pt-20">
      <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-safelight">This week on Roundhay</p>
          <h1 className="display mt-5 text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.95]">Explore</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/60">What everyone else shot this week. Hover any clip to watch it, then open it to see the prompt and camera behind it and remix it with your own cast.</p>
        </div>
        <dl className="grid shrink-0 grid-cols-3 gap-8 border-t border-ink/15 pt-5 text-left lg:gap-10">
          {[["48k", "clips shot"], ["2.1k", "remixes"], ["312", "channels"]].map(([n, l]) => (
            <div key={l}>
              <dt className="font-display text-3xl sm:text-4xl">{n}</dt>
              <dd className="mt-1 text-xs text-ink/50">{l} this week</dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <div className="mt-12">
        <ExploreGallery />
      </div>
    </section>
  );
}
