import { usageBreakdown, usageByDay } from "@/lib/mock";

const mono = "font-mono text-[10px] uppercase tracking-[0.16em] text-dim";
const panel = "rounded-[6px] bg-[linear-gradient(165deg,#19191c,#0f0f11)] ring-1 ring-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";
const total = usageBreakdown.reduce((n, u) => n + u.credits, 0);
const max = Math.max(...usageByDay);
const colours = ["#f0532b", "#ff8a3d", "#e8d49a", "#8a8f98"];

function Head({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-5 flex items-end gap-4">
      <span className="font-mono text-[11px] text-safelight">{n}</span>
      <h2 className="font-display text-2xl leading-none">{title}</h2>
      <span className="mb-1 h-px flex-1 bg-line" />
    </div>
  );
}

export default function UsageSettingsPage() {
  return (
    <div className="space-y-14">
      <section className="grid gap-3 sm:grid-cols-3">
        {[["Used this cycle", total.toLocaleString(), "of 1,500 credits", true], ["Clips made", "96", "34 re-rolled", false], ["Seconds rendered", "612", "avg 6.4s per clip", false]].map(([l, v, s, big]) => (
          <div key={l as string} className={`${panel} relative overflow-hidden p-6`}>
            {big && <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-safelight/15 blur-3xl" />}
            <p className={`${mono} relative`}>{l as string}</p>
            <p className="relative mt-3 font-display text-[3rem] leading-none">{v as string}</p>
            <p className="relative mt-2 text-xs text-dim">{s as string}</p>
            {big && <div className="relative mt-4 h-1.5 overflow-hidden bg-white/10"><div className="h-full bg-gradient-to-r from-[#ff8a3d] to-safelight" style={{ width: `${(total / 1500) * 100}%` }} /></div>}
          </div>
        ))}
      </section>

      <section>
        <Head n="01" title="Credits per day" />
        <div className={`${panel} p-5 sm:p-6`}>
          <div className="relative">
            {[0, 1, 2, 3].map((i) => <span key={i} aria-hidden="true" className="absolute inset-x-0 border-t border-dashed border-white/[0.07]" style={{ top: `${(i / 3) * 100}%` }} />)}
            <div className="relative flex h-56 items-end gap-2 sm:gap-3" role="img" aria-label="Credits used each day for the last 14 days">
              {usageByDay.map((v, i) => {
                const last = i === usageByDay.length - 1;
                return (
                  <div key={i} className="group relative flex h-full flex-1 items-end">
                    <div className={`w-full rounded-t-[4px] transition-colors ${last ? "bg-gradient-to-t from-safelight to-[#ff8a3d] shadow-[0_0_20px_rgba(240,83,43,0.5)]" : "bg-gradient-to-t from-white/10 to-white/30 group-hover:from-white/25 group-hover:to-white/55"}`} style={{ height: `${(v / max) * 100}%` }} />
                    <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 bg-bone px-2 py-0.5 font-mono text-[11px] text-ink group-hover:block">{v}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={`${mono} mt-4 flex justify-between`}><span>Nov 4</span><span>Nov 17</span></div>
        </div>
      </section>

      <section>
        <Head n="02" title="Where it went" />
        <div className={`${panel} p-5 sm:p-6`}>
          <div className="flex h-3 gap-1" role="img" aria-label="Share of credits by type">
            {usageBreakdown.map((u, i) => <span key={u.label} className="h-full" style={{ width: `${(u.credits / total) * 100}%`, background: colours[i] }} />)}
          </div>
          <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {usageBreakdown.map((u, i) => (
              <li key={u.label} className="flex items-center gap-3 text-sm">
                <span className="h-3 w-3 shrink-0" style={{ background: colours[i] }} />
                <span className="flex-1">{u.label}</span>
                <span className="font-mono text-[13px] text-silver">{u.credits} · {Math.round((u.credits / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
