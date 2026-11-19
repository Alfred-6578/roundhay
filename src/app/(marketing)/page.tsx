import Link from "next/link";
import { Icon } from "@/components/icons";
import { MediaSlot } from "@/components/media-slot";
import { BustStage } from "@/components/bust-stage";
import { Features } from "@/components/features";
import { ClosingSection } from "@/components/closing-section";
import { MadeRail } from "@/components/made-rail";
import { ModelsSection } from "@/components/models-section";
import { Reveal } from "@/components/reveal";

export default function LandingPage() {
  return (
    <>
      {/* Hero: copy on the left, the statue on the right with the product's own controls floating around it. */}
      <section className="relative isolate overflow-hidden bg-[#f8f6f1]">
        <div className="pointer-events-none absolute -right-24 bottom-[-8rem] -z-10 h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(closest-side,rgba(255,77,31,0.2),rgba(255,140,90,0.08)_60%,transparent)]" />
        <div className="mx-auto grid max-w-[1500px] items-center gap-6 px-5 pb-10 pt-0 sm:px-8 sm:pb-16 sm:pt-10 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1fr_1.08fr] lg:gap-4 lg:px-12 lg:pb-12 lg:pt-6">
          <div className="z-10 sm:relative max-sm:mt-1">
            <p className="enter-rise [--d:0.05s] inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold shadow-[0_1px_0_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.05)]">
              <span className="h-2 w-2 rounded-full bg-safelight" /> AI video for series, not one-offs
            </p>
            <h1 className="enter-rise [--d:0.15s] hero-h mt-7 text-[clamp(2.8rem,5.9vw,5.6rem)] text-ink max-sm:absolute max-sm:left-5 max-sm:top-[2.4rem] max-sm:mt-0 max-sm:whitespace-nowrap max-sm:text-[min(3.1rem,12.6vw)]">
              Cast once<span className="-ml-[0.07em]">.</span><br />
              <span className="text-safelight max-sm:text-[#f8f6f1] max-sm:[-webkit-text-stroke:3px_var(--safelight)] max-sm:tracking-[0.005em] max-sm:[paint-order:stroke_fill] max-sm:[stroke-linejoin:round]">Shoot forever<span className="-ml-[0.07em]">.</span></span>
            </h1>
            <p className="enter-rise [--d:0.3s] mt-6 max-w-md text-lg leading-relaxed text-ink/60 max-sm:mt-4 max-sm:text-base max-sm:leading-relaxed">
              Roundhay remembers your characters, sets and style, so episode 40 looks like episode 1. Write the week on Sunday, publish all week.
            </p>
            <div className="enter-rise [--d:0.42s] mt-8 flex flex-wrap items-center gap-5 max-sm:mt-5">
              <Link href="/signup" className="btn btn-primary px-8 py-4 text-[15px] shadow-[0_12px_30px_rgba(255,77,31,0.35)]">
                Start creating <Icon name="arrow" size={16} />
              </Link>
              <Link href="/#how" aria-label="See how it works" className="group relative flex h-[5.5rem] w-[5.5rem] shrink-0 items-center justify-center sm:hidden">
                <svg viewBox="0 0 100 100" className="absolute inset-0 [animation:dial_20s_linear_infinite] motion-reduce:[animation:none]" aria-hidden="true">
                  <defs><path id="howring" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" /></defs>
                  <text fontSize="9.2" fontWeight="600" fill="currentColor" className="uppercase text-ink">
                    <textPath href="#howring" textLength="235" lengthAdjust="spacing">See how it works · See how it works · </textPath>
                  </text>
                </svg>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition-transform group-active:scale-95">
                  <Icon name="play" size={14} className="ml-0.5 text-safelight" fill="currentColor" strokeWidth={0} />
                </span>
              </Link>
              <Link href="/#how" className="group flex items-center gap-3 text-left max-sm:hidden">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-transform group-hover:scale-105">
                  <Icon name="play" size={15} className="ml-0.5 text-safelight" fill="currentColor" strokeWidth={0} />
                </span>
                <span>
                  <span className="block text-sm font-semibold">See how it works</span>
                  <span className="block text-xs text-ink/50">Cast, camera, queue</span>
                </span>
              </Link>
            </div>

            <dl className="enter-rise [--d:0.54s] mt-12 hidden max-w-xl sm:grid grid-cols-4 divide-x divide-ink/10">
              {[["5", "Models"], ["12 s", "Per clip"], ["4K", "Max export"], ["40+", "Episodes per cast"]].map(([n, l]) => (
                <div key={l} className="px-3 first:pl-0 sm:px-4 sm:first:pl-0">
                  <dt className="font-display text-2xl sm:text-3xl">{n}</dt>
                  <dd className="mt-1 text-[11px] leading-tight text-ink/50">{l}</dd>
                </div>
              ))}
            </dl>

            <Link href="/explore" className="enter-rise [--d:0.66s] mt-10 hidden w-fit items-center gap-4 rounded-3xl bg-white/70 p-3 pr-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-md transition-colors hover:bg-white lg:flex">
              <span className="block h-16 w-16 overflow-hidden rounded-2xl"><MediaSlot slot="hero-latest" fallback="alley" /></span>
              <span>
                <span className="block text-sm font-semibold">Night Feed, episode 14</span>
                <span className="block text-xs text-ink/50">Same narrator, forty episodes in.</span>
              </span>
              <span className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/5"><Icon name="arrow" size={15} /></span>
            </Link>
          </div>

          {/* On a phone (under 640px) the statue comes first, cropped to head and ring, so the hero fits one screen. */}
          <div className="max-sm:relative max-sm:z-20 max-sm:order-first max-sm:-mx-5 max-sm:h-[min(122vw,32rem)] max-sm:overflow-hidden max-sm:[mask-image:linear-gradient(to_bottom,#000_86%,transparent)] max-sm:[&>div]:mt-[10%] lg:contents">
          <BustStage>
            {[
              { target: "face", cls: "right-[-2%] top-[6%] lg:right-[-7%]", icon: "lock" as const, title: "Cast", text: "Face and wardrobe held across 14 episodes" },
              { target: "ring", cls: "right-[-4%] top-[30%] lg:right-[-10%]", icon: "m-orbit" as const, title: "Camera: orbit", text: "Pick the move, not a prompt." },
              { target: "publish", cls: "right-[0%] top-[80%] lg:right-[-5%]", icon: "queue" as const, title: "Batch", text: "Ep. 15 renders, then publishes Thu 18:00" },
            ].map((c) => (
              <div key={c.title} data-callout data-target={c.target} className={`enter-fade [--d:0.5s] absolute z-30 hidden w-[13.75rem] items-center gap-3 rounded-[22px] border border-white/80 bg-white/65 p-3.5 shadow-[0_14px_44px_rgba(40,20,10,0.1)] backdrop-blur-xl sm:flex ${c.cls}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-safelight text-white"><Icon name={c.icon} size={17} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{c.title}</span>
                  <span className="block text-[11px] leading-snug text-ink/55">{c.text}</span>
                </span>
              </div>
            ))}
          </BustStage>
          </div>
        </div>
      </section>

      {/* Curved carousel of clips */}
      <MadeRail />

      {/* One line that sells: the gap between a clip and a channel. */}
      <section className="px-4 pb-4 pt-24 text-center sm:px-8 sm:pb-8 sm:pt-32">
        <h2 className="display mx-auto max-w-7xl text-[clamp(2rem,3.9vw,3.9rem)] leading-[1.05]">
          <Reveal as="span" className="block sm:text-balance max-sm:whitespace-nowrap max-sm:text-[6.6vw]">Anyone can make a clip.</Reveal>
          <Reveal as="span" delay={140} className="block text-balance text-safelight max-sm:mt-1 max-sm:text-[8.8vw]">Roundhay makes the series.</Reveal>
        </h2>
        <Reveal as="p" delay={300} y={16} className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-ink/45 max-sm:text-[2.5vw] max-sm:tracking-[0.08em]">Same character · Chosen camera · Posted on schedule</Reveal>
      </section>

      {/* Three ideas, played rather than described. */}
      <Features />

      <ModelsSection />

      <ClosingSection />
    </>
  );
}
