"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";

type Item = { href: string; label: string; icon: IconName; badge?: string };
const items: Item[] = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/create", label: "Create", icon: "spark" },
  { href: "/library", label: "Library", icon: "grid" },
  { href: "/cast", label: "Cast & sets", icon: "lock" },
  { href: "/batch", label: "Batch queue", icon: "queue", badge: "4" },
  { href: "/editor", label: "Editor", icon: "scissors" },
  { href: "/templates", label: "Templates", icon: "layers" },
  { href: "/explore", label: "Explore", icon: "compass" },
];

export function AppNav() {
  const path = usePathname();
  const active = (href: string) => path === href || path.startsWith(`${href}/`);
  return (
    <nav className="mt-6" aria-label="App">
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const on = active(item.href);
          return (
            <li key={item.href}>
              <Link href={item.href} aria-current={on ? "page" : undefined} className={`relative flex items-center gap-3 rounded-[6px] px-4 py-2.5 text-sm font-medium transition-colors ${on ? "bg-white/[0.09] text-bone" : "text-silver hover:bg-white/[0.05] hover:text-bone"}`}>
                {on && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-safelight shadow-[0_0_10px_rgba(240,83,43,0.8)]" />}
                <Icon name={item.icon} size={17} className={on ? "text-safelight" : ""} />
                {item.label}
                {item.badge && <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] ${on ? "bg-safelight text-white" : "bg-white/10 text-bone"}`}>{item.badge}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const tabs: Item[] = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/create", label: "Create", icon: "spark" },
  { href: "/library", label: "Library", icon: "grid" },
  { href: "/batch", label: "Queue", icon: "queue" },
  { href: "/settings/account", label: "Settings", icon: "gear" },
];

// Phones and tablets: the sidebar is hidden, so the same places sit in a tab bar.
export function MobileTabs() {
  const path = usePathname();
  return (
    <nav aria-label="App" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[8px] bg-night-3/90 px-2 pb-[env(safe-area-inset-bottom)] ring-1 ring-white/10 backdrop-blur-md lg:hidden">
      {tabs.map((t) => {
        const on = path === t.href || path.startsWith(`${t.href}/`);
        return (
          <Link key={t.href} href={t.href} aria-current={on ? "page" : undefined} className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${on ? "text-white" : "text-dim"}`}>
            {on && <span aria-hidden="true" className="absolute inset-x-5 top-0 h-[2px] rounded-full bg-safelight shadow-[0_0_8px_rgba(240,83,43,0.9)]" />}
            <Icon name={t.icon} size={19} className={on ? "text-safelight" : ""} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
