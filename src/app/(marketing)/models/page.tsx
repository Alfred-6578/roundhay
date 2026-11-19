import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { ModelStory, type Story } from "@/components/model-story";
import { Reveal } from "@/components/reveal";
import { SectionTabs } from "@/components/section-tabs";
import { clipById, models } from "@/lib/mock";

export const metadata: Metadata = {
  title: "Models — Roundhay",
  description: "Every top video model in one workspace: Veo, Kling, Seedance, Wan and MiniMax. Pick the model for each shot, and keep your cast, camera moves and schedule the same.",
};

// What each model is for, in words, with an example shot and the prompt that shows it. (The footage is placeholder until
// we have real output from each model.)
const look: Record<string, { clip: Story["clip"]; look: string; from: string; moves: string[] }> = {
  veo: {
    clip: { src: "/media/rail/rail-2.mp4", poster: "/media/rail/rail-2.jpg", of: "Travel b-roll" },
    look: "The one to use when a shot has to be right. Crisp, realistic and well lit, with sound made alongside the picture and resolution up to 4K. It costs the most, and for an ad, a hero shot or an establishing move it is worth it.",
    from: "c04",
    moves: ["Crane up", "Dolly in"],
  },
  kling: {
    clip: { src: "/media/rail/rail-4.mp4", poster: "/media/rail/rail-4.jpg", of: "Short film" },
    look: "A strong all-rounder when the shot has real movement in it: a person walking, a fast camera move, a crowd at the edge of the frame. It holds together where other models blur, at a price well below the top tier.",
    from: "c02",
    moves: ["Handheld", "Pan right"],
  },
  seedance: {
    clip: { src: "/media/rail/rail-9.mp4", poster: "/media/rail/rail-9.jpg", of: "Same character, new scene" },
    look: "Picture, speech and sound effects made together in one pass, and strong when you start from a reference image, which makes it a good fit for a series with a locked cast. It is where most channels on Roundhay start.",
    from: "c01",
    moves: ["Dolly in", "Handheld"],
  },
  wan: {
    clip: { src: "/media/rail/rail-7.mp4", poster: "/media/rail/rail-7.jpg", of: "City b-roll" },
    look: "Fast and light, with a good balance of speed and richness. Use it to find the shot before you spend: try six versions of a scene for the price of one on a bigger model, then send the one you like up.",
    from: "c08",
    moves: ["Pan right", "Static"],
  },
  minimax: {
    clip: { src: "/media/rail/rail-5.mp4", poster: "/media/rail/rail-5.jpg", of: "Animation" },
    look: "Takes text, a start and end frame, or several references, and goes up to 2K. A good fit when you already know how a shot should open and close, or want a stylised, less literal look.",
    from: "c07",
    moves: ["Tilt up"],
  },
};

const secs = (speed: string) => (speed.includes("min") ? parseFloat(speed.replace(/[^\d.]/g, "")) * 60 : parseFloat(speed.replace(/[^\d.]/g, "")));

const stories: Story[] = models.map((m, i) => ({
  model: m,
  n: String(i + 1).padStart(2, "0"),
  clip: look[m.id].clip,
  look: look[m.id].look,
  prompt: clipById(look[m.id].from)?.prompt ?? "",
  moves: look[m.id].moves,
}));

const compare = [
  { title: "Time to render", unit: (m: (typeof models)[number]) => m.speed, value: (m: (typeof models)[number]) => secs(m.speed), note: "Shorter is faster" },
  { title: "Credits a second", unit: (m: (typeof models)[number]) => String(m.creditsPerSecond), value: (m: (typeof models)[number]) => m.creditsPerSecond, note: "Lower is cheaper" },
  { title: "Longest clip", unit: (m: (typeof models)[number]) => `${m.maxSeconds} s`, value: (m: (typeof models)[number]) => m.maxSeconds, note: "Longer is more room" },
];

export default function ModelsPage() {
  return (
    <>
      <section className="px-5 pb-10 pt-14 sm:px-8 lg:px-12 sm:pb-14 sm:pt-20">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-safelight">The models</p>
            <h1 className="display mt-5 text-[clamp(2.6rem,6.6vw,6rem)] leading-[0.95]">
              Every top model.<br /><span className="text-ink/30">One cast.</span>
            </h1>
          </Reveal>
          <Reveal delay={120} className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-xl text-lg leading-relaxed text-ink/60">
              Roundhay does not make video models. It puts the leading ones from Google, Kuaishou, ByteDance, Alibaba and MiniMax in one workspace, so you can pick the right one for each shot while your cast, camera moves and schedule stay the same. The cost is shown before you press go.
            </p>
            <Link href="/pricing" className="btn btn-line-ink self-start">What a clip costs <Icon name="arrow" size={15} /></Link>
          </Reveal>
        </div>
      </section>

      <SectionTabs items={models.map((m) => ({ id: m.id, label: m.name }))} />

      {stories.map((s, i) => (
        <ModelStory key={s.model.id} s={s} flip={i % 2 === 1} />
      ))}

      {/* side by side */}
      <section className="bg-ink px-5 py-14 text-paper sm:px-8 lg:px-12 sm:py-20">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-safelight">Side by side</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,5vw,4.4rem)] leading-[1]">Pick the right one.</h2>
          </Reveal>
          <div className="mt-12 grid gap-12 lg:grid-cols-3 lg:gap-10">
            {compare.map((c, ci) => {
              const max = Math.max(...models.map(c.value));
              return (
                <Reveal key={c.title} delay={ci * 110} y={24}>
                  <h3 className="font-display text-2xl">{c.title}</h3>
                  <p className="mt-1 text-sm text-paper/45">{c.note}</p>
                  <ul className="mt-6 space-y-4">
                    {models.map((m) => (
                      <li key={m.id}>
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="text-paper/80">{m.name}</span>
                          <span className="font-mono text-paper">{c.unit(m)}</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-safelight-soft to-safelight" style={{ width: `${Math.max(6, (c.value(m) / max) * 100)}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 text-center sm:px-8 lg:px-12 sm:py-20">
        <Reveal>
          <h2 className="display mx-auto max-w-4xl text-[clamp(2.2rem,5.4vw,4.6rem)] leading-[1]">Not sure?<br /><span className="text-safelight">Start with a draft.</span></h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-ink/60">Draft on the fastest, cheapest model for a few credits, then send the shot you like to a bigger one.</p>
          <Link href="/signup" className="btn btn-primary mt-9 px-9 py-[1.1rem] text-base shadow-[0_14px_40px_rgba(255,77,31,0.3)]">Try Roundhay <Icon name="arrow" size={16} /></Link>
          <p className="mx-auto mt-10 max-w-md text-xs leading-relaxed text-ink/40">Roundhay is an independent platform. Model names and logos belong to their makers.</p>
        </Reveal>
      </section>
    </>
  );
}
