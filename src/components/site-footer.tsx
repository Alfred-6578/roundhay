import Link from "next/link";
import { Icon } from "@/components/icons";
import { Logo, Wordmark } from "@/components/logo";
import { Reveal } from "@/components/reveal";

// The end credits: each group of links is a credits line (label, dotted leader, names), and the name runs along
// the bottom, cropped by the edge of the page.
const credits = [
  { role: "Product", links: [["Create", "/signup"], ["Explore", "/explore"], ["Models", "/models"], ["Pricing", "/pricing"]] },
  { role: "Help", links: [["Help centre", "/help"], ["Templates", "/templates"], ["Contact", "/help"]] },
  { role: "Account", links: [["Log in", "/login"], ["Sign up", "/signup"], ["Billing", "/settings/billing"]] },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-ink/10 bg-[#f8f6f1]">
      <div className="mx-auto max-w-[1500px] px-5 pt-14 sm:px-8 sm:pt-20 lg:px-12">
        {/* who we are, and the way back up */}
        <Reveal className="flex items-start justify-between gap-6">
          <div>
            <Logo size={30} tone="ink" />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-ink/60">AI video for series, not one-offs.</p>
          </div>
          <a href="#" aria-label="Back to top" className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-transform hover:-translate-y-0.5">
            <Icon name="arrow" size={18} className="-rotate-90" />
          </a>
        </Reveal>

        {/* the credits */}
        <dl className="mx-auto mt-14 max-w-4xl space-y-6 sm:mt-20 sm:space-y-7">
          {credits.map((c, i) => (
            <Reveal key={c.role} delay={i * 110} y={18} className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 sm:w-24 sm:shrink-0">{c.role}</dt>
              <span aria-hidden="true" className="hidden flex-1 -translate-y-1.5 border-b-2 border-dotted border-ink/20 sm:block" />
              <dd>
                <ul className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xl font-semibold tracking-tight sm:justify-end sm:text-[1.7rem]">
                  {c.links.map(([label, href], n) => (
                    <li key={label} className="flex items-baseline gap-2">
                      {n > 0 && <span aria-hidden="true" className="font-normal text-ink/25">/</span>}
                      <Link href={href} className="transition-colors hover:text-safelight">{label}</Link>
                    </li>
                  ))}
                </ul>
              </dd>
            </Reveal>
          ))}
        </dl>

        <div className="mt-14 flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Roundhay</span>
          <span>Named for the Roundhay Garden Scene · Leeds, 1888</span>
        </div>
      </div>

      {/* the name, cropped by the page edge */}
      <Reveal y={0} scale={0.96} edge="0px" className="mt-6 origin-bottom px-3 sm:mt-10 sm:px-6">
        <p aria-hidden="true" className="flex select-none justify-center text-[12.6vw] leading-[0.78] -mb-[0.13em]"><Wordmark tone="ink" /></p>
      </Reveal>
    </footer>
  );
}
