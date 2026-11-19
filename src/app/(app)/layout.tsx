import Link from "next/link";
import { AppNav, MobileTabs } from "@/components/app-nav";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { Meter } from "@/components/bits";
import { stats } from "@/lib/mock";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-night text-bone">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col justify-between border-r border-white/[0.06] p-4 lg:flex">
        <div className="min-h-0 flex-1 overflow-y-auto pb-4 scrollbar-thin">
          <Link href="/dashboard" className="block px-3 pt-2"><Logo size={26} /></Link>
          <button type="button" className="mt-6 flex w-full items-center gap-3 rounded-[6px] bg-white/[0.05] p-1.5 pr-4 text-left ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.09]">
            <span className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-safelight text-sm font-bold text-white">N</span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">Night Feed</span>
            <Icon name="chevron" size={14} className="rotate-90 text-dim" />
          </button>
          <AppNav />
        </div>
        <div>
          <div className="rounded-[6px] bg-[linear-gradient(165deg,#19191c,#0f0f11)] p-4 ring-1 ring-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <p className="font-display text-3xl leading-[1.08]">{stats.creditsLeft.toLocaleString()}</p>
            <p className="mt-1.5 text-xs text-dim">of {stats.creditsTotal.toLocaleString()} credits · resets Dec 1</p>
            <Meter value={stats.creditsTotal - stats.creditsLeft} max={stats.creditsTotal} className="mt-3 !rounded-full" />
            <Link href="/settings/billing" className="btn btn-light btn-sm mt-4 w-full">Add credits</Link>
          </div>
          <Link href="/settings/account" className="mt-2 flex items-center gap-3 rounded-[6px] px-4 py-2.5 text-sm text-silver hover:bg-white/[0.05] hover:text-bone"><Icon name="gear" size={17} /> Settings</Link>
          <Link href="/help" className="flex items-center gap-3 rounded-[6px] px-4 py-2.5 text-sm text-silver hover:bg-white/[0.05] hover:text-bone"><Icon name="help" size={17} /> Help</Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/[0.06] bg-night/85 px-5 py-3 backdrop-blur-md lg:px-8">
          <Link href="/dashboard" className="lg:hidden"><Logo size={22} /></Link>
          <label className="relative hidden max-w-md flex-1 sm:block">
            <span className="sr-only">Search</span>
            <Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" />
            <input type="search" placeholder="Search clips, cast, templates" className="field !rounded-[6px] !border-transparent bg-white/[0.06] py-2.5 pl-10 text-[13px]" />
          </label>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/batch" className="chip hidden !rounded-[6px] sm:inline-flex"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-warn" />2 rendering</Link>
            <Link href="/create" className="btn btn-primary btn-sm !rounded-[6px]"><Icon name="plus" size={15} /> New clip</Link>
            <button type="button" aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center rounded-[6px] bg-white/[0.06] text-silver transition-colors hover:bg-white/[0.1] hover:text-bone">
              <Icon name="bell" size={16} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-safelight" />
            </button>
          </div>
        </header>
        <main className="flex-1 pb-24 lg:pb-0">{children}</main>
        <MobileTabs />
      </div>
    </div>
  );
}
