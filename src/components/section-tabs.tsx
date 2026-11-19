"use client";

import { useEffect, useState } from "react";

// A bar of anchor links that sticks under the header and lights up the section you are in.
export function SectionTabs({ items }: { items: { id: string; label: string }[] }) {
  const [on, setOn] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        // of the sections currently crossing the middle band of the screen, the one nearest the top wins
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setOn(hit.target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="Models" className="sticky top-[67px] z-40 border-y border-ink/10 bg-[#f8f6f1]/85 backdrop-blur-md">
      <div className="px-5 sm:px-8 lg:px-12"><ul className="mx-auto flex max-w-[1500px] gap-1 overflow-x-auto py-2.5 [scrollbar-width:none]">
        {items.map((i) => (
          <li key={i.id} className="shrink-0">
            <a
              href={`#${i.id}`}
              aria-current={on === i.id ? "true" : undefined}
              className={`block rounded-full px-4 py-2 text-sm font-semibold transition-colors ${on === i.id ? "bg-ink text-paper" : "text-ink/55 hover:text-ink"}`}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul></div>
    </nav>
  );
}
