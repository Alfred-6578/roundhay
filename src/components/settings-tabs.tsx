"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/settings/account", label: "Account" },
  { href: "/settings/billing", label: "Plan & billing" },
  { href: "/settings/usage", label: "Usage" },
];

export function SettingsTabs() {
  const path = usePathname();
  return (
    <nav className="no-scrollbar -mx-5 mt-8 overflow-x-auto px-5 lg:mx-0 lg:px-0" aria-label="Settings">
      <div className="flex w-max gap-1 rounded-[6px] bg-white/[0.06] p-1">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} aria-current={path === t.href ? "page" : undefined} className={`rounded-[4px] px-4 py-1.5 text-[12px] font-semibold transition-colors ${path === t.href ? "bg-bone text-ink" : "text-silver hover:text-bone"}`}>
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
