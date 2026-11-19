import { Icon } from "@/components/icons";

const mono = "font-mono text-[10px] uppercase tracking-[0.16em] text-dim";
const panel = "rounded-[6px] bg-[linear-gradient(165deg,#19191c,#0f0f11)] ring-1 ring-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";
const input = "w-full rounded-[6px] bg-black/40 px-4 py-3 text-sm text-bone outline-none ring-1 ring-white/10 transition placeholder:text-dim hover:ring-white/25 focus:ring-white/50";

const prefs = [
  ["Email me when a batch finishes", "Get a note as soon as the last episode renders.", true],
  ["Email me when a render fails", "So you can re-roll it before the schedule slips.", true],
  ["Weekly summary of what I made", "Clips, credits and your most-watched shot.", false],
  ["Product news", "New models and features, once a month at most.", false],
] as const;

function Head({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="mb-5 flex items-end gap-4">
      <span className="font-mono text-[11px] text-safelight">{n}</span>
      <div><h2 className="font-display text-2xl leading-none">{title}</h2>{note && <p className="mt-1.5 text-xs text-dim">{note}</p>}</div>
      <span className="mb-1 h-px flex-1 bg-line" />
    </div>
  );
}

export default function AccountSettingsPage() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form className="space-y-12">
        <section>
          <Head n="01" title="Profile" />
          <div className={`${panel} p-5 sm:p-6`}>
            <div className="flex items-center gap-5">
              <span className="relative block h-20 w-20 shrink-0 rounded-full p-[3px]" style={{ background: "conic-gradient(from 200deg, #ff8a3d, #f0532b, #ff8a3d)", boxShadow: "0 0 30px -6px rgba(240,83,43,0.6)" }}>
                <span className="grid h-full w-full place-items-center rounded-full bg-night font-display text-2xl">NF</span>
              </span>
              <div>
                <p className="font-display text-xl leading-tight">Night Feed</p>
                <p className="mt-0.5 text-xs text-dim">@nightfeed</p>
                <button type="button" className="btn btn-ghost btn-sm mt-3 !bg-white/10">Change photo</button>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {[["Channel name", "Night Feed", "text"], ["Handle", "@nightfeed", "text"], ["Email", "hello@nightfeed.tv", "email"], ["Website", "nightfeed.tv", "text"]].map(([l, v, t]) => (
                <div key={l}>
                  <label className={`${mono} mb-2 block`}>{l}</label>
                  <input type={t} defaultValue={v} className={input} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <Head n="02" title="Defaults" note="What a new clip starts with." />
          <div className={`${panel} grid gap-5 p-5 sm:grid-cols-3 sm:p-6`}>
            {[["Model", ["Seedance 2.0", "Veo 3.1", "Kling 3.0", "Wan 3.0", "MiniMax H3"]], ["Shape", ["9:16", "16:9", "1:1"]], ["Length", ["8s", "6s", "10s", "12s"]]].map(([l, o]) => (
              <div key={l as string}>
                <label className={`${mono} mb-2 block`}>{l as string}</label>
                <select className={`${input} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`}>{(o as string[]).map((x) => <option key={x}>{x}</option>)}</select>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Head n="03" title="Email" />
          <ul className={`${panel} divide-y divide-white/[0.06]`}>
            {prefs.map(([l, d, on]) => (
              <li key={l}>
                <label className="flex cursor-pointer items-center justify-between gap-6 px-5 py-4 sm:px-6">
                  <span><span className="block text-sm font-medium">{l}</span><span className="mt-0.5 block text-xs text-dim">{d}</span></span>
                  <input type="checkbox" defaultChecked={on} className="peer sr-only" />
                  <span aria-hidden="true" className="relative h-6 w-11 shrink-0 rounded-full bg-white/15 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-safelight peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-white" />
                </label>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary shadow-[0_10px_40px_-12px_rgba(240,83,43,0.9)]">Save changes</button>
          <button type="reset" className="btn btn-ghost !bg-white/10">Cancel</button>
        </div>
      </form>

      <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
        <section className={`${panel} p-5`}>
          <div className="flex items-center justify-between"><h2 className={mono}>API key</h2><span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-silver">Studio</span></div>
          <p className="mt-4 flex items-center justify-between rounded-[6px] bg-black/50 px-3.5 py-3 font-mono text-xs ring-1 ring-white/10">
            rh_live_••••••••••8f2c
            <Icon name="copy" size={14} className="text-silver" />
          </p>
          <p className="mt-3 text-xs leading-relaxed text-dim">Studio plan only. Rotate it if it leaks.</p>
        </section>
        <section className="rounded-[6px] border border-safelight/40 bg-safelight/[0.05] p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-safelight">Danger zone</h2>
          <p className="mt-3 text-sm leading-relaxed text-silver">Deleting your workspace removes every clip, cast member and set. This can&rsquo;t be undone.</p>
          <button type="button" className="btn btn-ghost btn-sm mt-4 border-safelight/60 text-safelight">Delete workspace</button>
        </section>
      </aside>
    </div>
  );
}
