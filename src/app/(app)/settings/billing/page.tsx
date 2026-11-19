import { Icon } from "@/components/icons";

const mono = "font-mono text-[10px] uppercase tracking-[0.16em] text-dim";
const panel = "rounded-[6px] bg-[linear-gradient(165deg,#19191c,#0f0f11)] ring-1 ring-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";

const packs = [{ c: 500, p: 10 }, { c: 1500, p: 25, tag: "Popular" }, { c: 5000, p: 70, tag: "Best value" }];
const invoices = [["Nov 1, 2026", "INV-1042", "$29.00"], ["Oct 1, 2026", "INV-0987", "$29.00"], ["Sep 1, 2026", "INV-0931", "$29.00"], ["Aug 1, 2026", "INV-0876", "$29.00"]];
const used = 658, total = 1500;
const C = 2 * Math.PI * 44;

function Head({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="mb-5 flex items-end gap-4">
      <span className="font-mono text-[11px] text-safelight">{n}</span>
      <div><h2 className="font-display text-2xl leading-none">{title}</h2>{note && <p className="mt-1.5 text-xs text-dim">{note}</p>}</div>
      <span className="mb-1 h-px flex-1 bg-line" />
    </div>
  );
}

export default function BillingSettingsPage() {
  const left = total - used;
  return (
    <div className="space-y-14">
      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {/* the plan */}
        <div className={`${panel} relative overflow-hidden p-6 sm:p-8`}>
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-safelight/20 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className={mono}>Current plan</p>
              <p className="display mt-3 text-[clamp(2.8rem,6vw,4.6rem)] leading-[0.94]">Creator</p>
              <p className="mt-3 text-silver"><span className="font-display text-2xl text-bone">$29</span> / month · renews Dec 1, 2026</p>
            </div>
            <div className="relative h-[116px] w-[116px] shrink-0">
              <svg viewBox="0 0 104 104" className="-rotate-90 drop-shadow-[0_0_14px_rgba(240,83,43,0.45)]" aria-hidden="true">
                <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff8a3d" /><stop offset="1" stopColor="#f0532b" /></linearGradient></defs>
                <circle cx="52" cy="52" r="44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
                <circle cx="52" cy="52" r="44" fill="none" stroke="url(#bg)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${C * (left / total)} ${C}`} />
              </svg>
              <span className="absolute inset-0 grid place-items-center text-center"><span className="font-display text-[1.8rem] leading-none">{left}<span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] text-dim">left</span></span></span>
            </div>
          </div>
          <p className={`${mono} relative mt-6`}>{used} of {total.toLocaleString()} credits used this month</p>
          <div className="relative mt-7 flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary btn-sm">Change plan</button>
            <button type="button" className="btn btn-ghost btn-sm !bg-white/10 text-silver">Cancel</button>
          </div>
        </div>

        {/* the card */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[1.7/1] w-full max-w-sm overflow-hidden rounded-[10px] p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/15" style={{ background: "linear-gradient(135deg,#2a2a2f,#101012 60%,#26150f)" }}>
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-safelight/25 blur-3xl" />
            <div className="relative flex items-start justify-between">
              <span className="h-8 w-11 rounded-[5px] bg-gradient-to-br from-[#e8d49a] to-[#a98a3c]" />
              <span className="font-mono text-sm font-bold italic tracking-wider text-white">VISA</span>
            </div>
            <p className="relative mt-7 font-mono text-lg tracking-[0.2em] text-white">•••• •••• •••• 4242</p>
            <div className="relative mt-4 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-white/55"><span>Night Feed</span><span>08 / 28</span></div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm w-fit !bg-white/10">Update card</button>
        </div>
      </section>

      <section>
        <Head n="01" title="Top up credits" note="Top-ups never expire and are used after your monthly credits." />
        <ul className="grid gap-3 sm:grid-cols-3">
          {packs.map((k) => (
            <li key={k.c} className={`${panel} relative p-6 ${k.tag === "Best value" ? "!ring-safelight/50" : ""}`}>
              {k.tag && <span className={`absolute right-4 top-4 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${k.tag === "Best value" ? "bg-safelight text-white" : "bg-white/10 text-silver"}`}>{k.tag}</span>}
              <p className="font-display text-5xl leading-none">{k.c.toLocaleString()}</p>
              <p className={`${mono} mt-2`}>credits</p>
              <p className="mt-5 text-xs text-dim">${(k.p / k.c).toFixed(3)} a credit</p>
              <button type="button" className={`btn btn-sm mt-3 w-full ${k.tag === "Best value" ? "btn-primary" : "btn-ghost !bg-white/10"}`}>${k.p}</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Head n="02" title="Invoices" />
        <ul className={`${panel} divide-y divide-white/[0.06]`}>
          {invoices.map(([d, n, a]) => (
            <li key={n} className="flex items-center gap-4 px-5 py-4 sm:px-6">
              <span className="grid h-9 w-9 shrink-0 place-items-center bg-white/[0.06] text-silver" style={{ borderRadius: 999 }}><Icon name="download" size={14} /></span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{d}</span><span className="block font-mono text-[11px] text-dim">{n}</span></span>
              <span className="hidden rounded-full bg-ok/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ok sm:block">Paid</span>
              <span className="w-16 text-right font-mono text-sm">{a}</span>
              <button type="button" className="font-mono text-[11px] uppercase tracking-[0.1em] text-silver hover:text-bone">PDF</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
