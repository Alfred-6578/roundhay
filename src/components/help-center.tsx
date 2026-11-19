"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { faqs, type FaqTopic } from "@/lib/mock";

const topics: { id: FaqTopic; icon: IconName; title: string; body: string }[] = [
  { id: "cast", icon: "lock", title: "Cast and consistency", body: "Lock a character, keep a set, fix a drifting face." },
  { id: "prompts", icon: "spark", title: "Writing prompts", body: "What to describe, what to leave out, how to ask for a move." },
  { id: "batch", icon: "queue", title: "Batch and scheduling", body: "Queue a week, set publish dates, handle failed renders." },
  { id: "credits", icon: "coin", title: "Credits and billing", body: "How cost works, refunds, changing plan, licensing." },
  { id: "editor", icon: "scissors", title: "Editor and exports", body: "Trim, caption, reframe to 9:16, 1:1 and 16:9." },
  { id: "api", icon: "key", title: "API and integrations", body: "Keys, webhooks, publishing to YouTube and TikTok." },
  { id: "about", icon: "film", title: "About Roundhay", body: "Where the name comes from." },
];

const ideas = ["character keeps changing", "refund", "export 9:16", "api key"];

export function HelpCenter() {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<FaqTopic | "all">("all");

  // every word you type has to appear in the question, the answer or the topic's name
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const inSearch = useMemo(
    () =>
      faqs.filter((f) => {
        const hay = `${f.q} ${f.a} ${topics.find((t) => t.id === f.topic)?.title ?? ""}`.toLowerCase();
        return words.every((w) => hay.includes(w));
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q]
  );
  const shown = inSearch.filter((f) => topic === "all" || f.topic === topic);
  const count = (id: FaqTopic | "all") => (id === "all" ? inSearch.length : inSearch.filter((f) => f.topic === id).length);

  return (
    <>
      {/* ask */}
      <Reveal delay={100} className="mt-10 max-w-2xl">
        <label className="relative block">
          <span className="sr-only">Search help</span>
          <Icon name="search" size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search, for example “character keeps changing”"
            className="field field-paper !rounded-full py-5 pl-14 pr-6 text-base shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
          />
        </label>
        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink/50">
          Try
          {ideas.map((i) => (
            <button key={i} type="button" onClick={() => setQ(i)} className="rounded-full bg-paper-2 px-3 py-1.5 text-[13px] font-medium text-ink/70 transition-colors hover:bg-paper-line hover:text-ink">{i}</button>
          ))}
        </p>
      </Reveal>

      {/* topics, and what is in them */}
      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
        <Reveal delay={150} y={20} className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">Topics</p>
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0 [scrollbar-width:none]">
            {([{ id: "all" as const, icon: "grid" as IconName, title: "Everything", body: "" }, ...topics]).map((t) => {
              const on = topic === t.id;
              const n = count(t.id);
              return (
                <li key={t.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setTopic(t.id)}
                    aria-pressed={on}
                    className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${on ? "bg-ink text-paper" : "text-ink/70 hover:bg-paper-2"} ${n === 0 ? "opacity-40" : ""}`}
                  >
                    <Icon name={t.icon} size={17} className={on ? "text-safelight" : "text-ink/45"} />
                    <span className="flex-1 whitespace-nowrap text-sm font-semibold">{t.title}</span>
                    <span className={`font-mono text-xs ${on ? "text-paper/55" : "text-ink/35"}`}>{n}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {topic !== "all" && <p className="mt-4 hidden max-w-[15rem] text-sm leading-relaxed text-ink/50 lg:block">{topics.find((t) => t.id === topic)?.body}</p>}
        </Reveal>

        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45" aria-live="polite">
            {shown.length} {shown.length === 1 ? "answer" : "answers"}{q.trim() ? ` for “${q.trim()}”` : ""}
          </p>
          {shown.length > 0 ? (
            <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
              {shown.map((f) => {
                const t = topics.find((x) => x.id === f.topic);
                return (
                  <li key={f.q}>
                    <details className="group py-6">
                      <summary className="flex cursor-pointer items-start justify-between gap-6 text-lg font-semibold">
                        <span>
                          {f.q}
                          {t && <span className="mt-1.5 flex items-center gap-1.5 text-xs font-normal text-ink/40"><Icon name={t.icon} size={12} /> {t.title}</span>}
                        </span>
                        <Icon name="plus" size={20} className="mt-1 shrink-0 transition-transform group-open:rotate-45" />
                      </summary>
                      <p className="mt-3 max-w-2xl leading-relaxed text-ink/65">{f.a}</p>
                    </details>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-4 rounded-3xl bg-paper-2 p-8 sm:p-10">
              <p className="font-display text-2xl">Nothing matches that.</p>
              <p className="mt-2 max-w-md text-ink/55">Try fewer or different words, or ask us directly. A person replies within a working day.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={() => { setQ(""); setTopic("all"); }} className="btn btn-line-ink">Clear search</button>
                <a href="mailto:help@roundhay.example" className="btn btn-ink">Write to us</a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* a person */}
      <Reveal y={28} className="mt-20 grid gap-8 rounded-[28px] bg-ink p-7 text-paper sm:rounded-[36px] sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/50"><span className="h-2 w-2 rounded-full bg-ok" /> A person replies within a working day</p>
          <h2 className="display mt-4 text-[clamp(2rem,4.4vw,3.8rem)] leading-[1]">Still stuck on the shot?</h2>
          <p className="mt-4 max-w-md text-paper/55">Send us the clip and what you expected. The clip&apos;s link is enough: we can see the prompt, the camera and the cast.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <a href="mailto:help@roundhay.example" className="btn btn-primary px-7 py-4">Write to us <Icon name="arrow" size={15} /></a>
          <Link href="/pricing" className="btn btn-line-light px-7 py-4">Questions about plans</Link>
        </div>
      </Reveal>
    </>
  );
}
