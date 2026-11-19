import type { Metadata } from "next";
import { HelpCenter } from "@/components/help-center";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "Help — Roundhay" };

export default function HelpPage() {
  return (
    <section className="px-5 pb-20 pt-14 sm:px-8 lg:px-12 sm:pt-20">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-safelight">Help centre</p>
          <h1 className="display mt-5 text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.95]">Stuck on<br /><span className="text-ink/30">a shot?</span></h1>
        </Reveal>
        <HelpCenter />
      </div>
    </section>
  );
}
