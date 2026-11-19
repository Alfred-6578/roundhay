"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";

type Item = { href: string; label: string; note: string };

// The phone menu: a panel that drops from under the header with big tappable rows.
export function MobileMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const [seenPath, setSeenPath] = useState(path);
  // Close when the page changes (state adjusted during render, not in an effect).
  if (seenPath !== path) {
    setSeenPath(path);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const step = (i: number) => ({ transitionDelay: open ? `${90 + i * 55}ms` : "0ms" });
  const rise = `transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`;

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-[34px] w-[34px] place-items-center rounded-full bg-ink/5 transition-colors active:bg-ink/10"
      >
        <span className={`absolute h-[1.5px] w-4 rounded-full bg-ink transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
        <span className={`absolute h-[1.5px] w-4 rounded-full bg-ink transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
      </button>

      {/* tap outside to close */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`absolute inset-x-0 top-full h-[100dvh] bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <nav
        id="mobile-menu"
        aria-label="Menu"
        aria-hidden={!open}
        className={`absolute inset-x-0 top-full overflow-hidden rounded-b-[28px] bg-ink text-paper shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] transition-[clip-path,visibility] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]"}`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-safelight/25 blur-3xl" />
        <ul className="relative px-5 pb-2 pt-3">
          {items.map((l, i) => {
            const active = path === l.href || path.startsWith(l.href + "/");
            return (
              <li key={l.href} className={rise} style={step(i)}>
                <Link
                  href={l.href}
                  tabIndex={open ? 0 : -1}
                  className="group flex items-center gap-4 border-b border-white/10 py-4 active:opacity-70"
                >
                  <span className="w-6 font-mono text-[11px] text-paper/35">0{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block font-display text-[1.7rem] leading-none ${active ? "text-safelight" : ""}`}>{l.label}</span>
                    <span className="mt-1.5 block text-[13px] text-paper/45">{l.note}</span>
                  </span>
                  <Icon name="arrow" size={18} className="-rotate-45 text-paper/40 transition-transform group-active:translate-x-0.5" />
                </Link>
              </li>
            );
          })}
        </ul>
        <div className={`relative flex items-center gap-3 px-5 pb-6 pt-4 ${rise}`} style={step(items.length)}>
          <Link href="/login" tabIndex={open ? 0 : -1} className="btn flex-1 justify-center border border-white/20 py-3.5 text-paper">Log in</Link>
          <Link href="/signup" tabIndex={open ? 0 : -1} className="btn btn-primary flex-[1.4] justify-center py-3.5">Get started <Icon name="arrow" size={15} /></Link>
        </div>
      </nav>
    </div>
  );
}
