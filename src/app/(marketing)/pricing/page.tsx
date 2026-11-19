import type { Metadata } from "next";
import Link from "next/link";
import { CreditCalculator } from "@/components/credit-calculator";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { faqs, models, plans } from "@/lib/mock";

export const metadata: Metadata = { title: "Pricing — Roundhay" };

// How far each plan's credits go: on the cheapest model (for drafts) and on the dearest (for the keeper).
const sample = ["veo", "seedance", "wan"].map((id) => models.find((m) => m.id === id)!);
const credits: Record<string, number> = { starter: 100, creator: 1500, studio: 8000 };
const maxClips = Math.floor(credits.studio / (sample[2].creditsPerSecond * 8));

const rows: { group: string; items: [string, string, string, string][] }[] = [
  {
    group: "What you shoot",
    items: [
      ["Credits", "100 to start", "1,500 a month", "8,000 a month"],
      ["Longest export", "720p", "1080p", "4K"],
      ["Models", "Wan, Seedance", "All five", "All five"],
    ],
  },
  {
    group: "How you work",
    items: [
      ["Cast members", "3", "Unlimited", "Unlimited"],
      ["Batch queue", "—", "20 clips", "100 clips"],
      ["Seats", "1", "1", "5"],
    ],
  },
  {
    group: "What you can do with it",
    items: [
      ["Watermark", "Yes", "None", "None"],
      ["Commercial licence", "—", "Included", "Included"],
      ["API access", "—", "—", "Included"],
    ],
  },
];

function Cell({ v }: { v: string }) {
  if (v === "—") return <span className="text-ink/25">—</span>;
  if (v === "Included" || v === "None") return <span className="flex items-center gap-1.5 font-medium"><Icon name="check" size={14} className="text-safelight" /> {v}</span>;
  return <span className="font-medium">{v}</span>;
}

export default function PricingPage() {
  const billing = faqs.filter((f) => f.topic === "credits");
  return (
    <>
      <section className="px-5 pb-4 pt-14 sm:px-8 lg:px-12 sm:pt-20">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-safelight">Pricing</p>
            <h1 className="display mt-5 text-[clamp(2.4rem,5.6vw,5rem)] leading-[0.98]">Pay for the seconds<br /><span className="text-ink/30">you shoot.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/60">Credits cover generation, and you see the cost before you press go. Cast, sets, batch, reframing and the editor come with every paid plan. Failed renders are refunded automatically.</p>
          </Reveal>
        </div>
      </section>

      {/* work it out */}
      <section className="px-5 py-8 sm:px-8 lg:px-12 sm:py-10">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="pb-6">
            <h2 className="font-display text-3xl sm:text-4xl">How much will you shoot?</h2>
            <p className="mt-2 max-w-lg text-ink/55">Move the sliders. We will tell you what it comes to and which plan covers it.</p>
          </Reveal>
          <Reveal delay={100} y={30}><CreditCalculator /></Reveal>
        </div>
      </section>

      {/* the plans */}
      <section className="px-5 pb-12 sm:px-8 lg:px-12 sm:pb-16">
        <div className="mx-auto grid max-w-[1500px] gap-3 lg:grid-cols-3 lg:items-stretch">
          {plans.map((p, i) => {
            const c = credits[p.id];
            const f = !!p.featured;
            const sub = f ? "text-paper/55" : "text-ink/55";
            const free = p.price === "$0";
            return (
              <Reveal key={p.id} delay={i * 110} y={30} className={`relative flex flex-col overflow-hidden rounded-[28px] p-7 sm:rounded-[36px] sm:p-9 ${f ? "bg-ink text-paper shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] lg:-my-4 lg:py-13" : "bg-paper-2"}`}>
                {f && <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-safelight/25 blur-3xl" />}
                {f && <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-safelight to-transparent" />}
                <div className="relative flex items-center justify-between">
                  <h2 className="font-display text-2xl">{p.name}</h2>
                  {f && <span className="rounded-full bg-safelight px-3 py-1 text-xs font-semibold text-white">Most chosen</span>}
                </div>
                <p className={`relative mt-2 text-sm ${sub}`}>{p.blurb}</p>
                <p className="relative mt-8 flex items-baseline gap-2">
                  <span className="display text-[4.4rem] leading-none sm:text-7xl">{p.price}</span>
                  <span className={`text-sm ${f ? "text-paper/50" : "text-ink/50"}`}>{free ? "to start" : "a month"}</span>
                </p>
                <p className={`relative mt-4 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ${f ? "bg-white/10" : "bg-paper"}`}>
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-safelight" />{p.credits}
                </p>

                {/* what the credits buy, in 8-second clips */}
                <div className={`relative mt-6 rounded-2xl p-4 ${f ? "bg-white/[0.07]" : "bg-paper"}`}>
                  <p className={`font-mono text-[10px] uppercase tracking-[0.16em] ${f ? "text-paper/45" : "text-ink/45"}`}>8-second clips you can make</p>
                  <ul className="mt-3 space-y-2.5">
                    {sample.map((m) => {
                      const locked = p.id === "starter" && !["wan", "seedance"].includes(m.id);
                      const n = locked ? 0 : Math.floor(c / (m.creditsPerSecond * 8));
                      const w = Math.max(n ? 6 : 0, Math.min(100, (n / maxClips) * 100));
                      return (
                        <li key={m.id} className="grid grid-cols-[5.2rem_1fr_2rem] items-center gap-3 text-xs">
                          <span className={sub}>{m.name.split(" ")[0]}</span>
                          <span className={`h-1.5 overflow-hidden rounded-full ${f ? "bg-white/10" : "bg-ink/10"}`}><span className="block h-full rounded-full bg-safelight" style={{ width: `${w}%` }} /></span>
                          <span className="text-right font-display text-base">{locked ? "—" : n}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <ul className={`relative mt-7 flex-1 space-y-3 border-t pt-7 text-sm ${f ? "border-white/15" : "border-ink/10"}`}>
                  {[`${p.res} exports`, p.chars, ...p.extras].map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className={`mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full ${f ? "bg-safelight/25" : "bg-safelight/15"}`}><Icon name="check" size={11} className="text-safelight" /></span>{x}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`btn relative mt-9 py-4 ${f ? "btn-primary" : "btn-ink"}`}>{p.cta}</Link>
              </Reveal>
            );
          })}
        </div>
        <p className="mx-auto mt-6 max-w-[1500px] px-2 text-center text-sm text-ink/50">Run out? Top-up packs start at $10 for 500 credits, and they never expire.</p>
      </section>

      {/* side by side */}
      <section className="px-5 pb-14 sm:px-8 lg:px-12 sm:pb-20">
        <div className="mx-auto max-w-[1500px]">
          <Reveal><h2 className="font-display text-3xl sm:text-4xl">Compare plans</h2></Reveal>
          <Reveal delay={100} y={24} className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[620px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr>
                  <th className="w-[34%] py-4" />
                  {plans.map((p) => (
                    <th key={p.id} className={`px-4 py-4 font-display text-lg ${p.featured ? "rounded-t-2xl border-t-2 border-safelight bg-safelight/[0.09]" : ""}`}>{p.name} <span className="ml-1 text-sm font-normal text-ink/45">{p.price}</span></th>
                  ))}
                </tr>
              </thead>
              {rows.map((g, gi) => (
                <tbody key={g.group}>
                  <tr>
                    <th colSpan={4} className="pb-2 pt-8 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink/45">{g.group}</th>
                  </tr>
                  {g.items.map(([k, a, b, c], ri) => {
                    const last = gi === rows.length - 1 && ri === g.items.length - 1;
                    return (
                      <tr key={k}>
                        <td className="border-b border-ink/10 py-4 pr-4 text-ink/65">{k}</td>
                        {[a, b, c].map((v, i) => (
                          <td key={i} className={`border-b border-ink/10 px-4 py-4 ${plans[i].featured ? `bg-safelight/[0.06] ${last ? "rounded-b-2xl" : ""}` : ""}`}><Cell v={v} /></td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              ))}
            </table>
          </Reveal>
        </div>
      </section>

      {/* the questions people ask about money */}
      <section className="border-t border-ink/10 px-5 py-14 sm:px-8 lg:px-12 sm:py-20">
        <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl">About credits and billing</h2>
            <p className="mt-3 max-w-xs text-ink/55">More answers are in <Link href="/help" className="underline decoration-ink/25 underline-offset-4 hover:decoration-safelight">the help centre</Link>.</p>
          </Reveal>
          <Reveal delay={100} y={24} className="divide-y divide-ink/10 border-y border-ink/10">
            {billing.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-6 text-lg font-semibold">
                  {f.q}
                  <Icon name="plus" size={20} className="shrink-0 transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink/65">{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
