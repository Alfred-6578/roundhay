import { SettingsTabs } from "@/components/settings-tabs";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-6 lg:px-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Night Feed · Creator plan</p>
      <h1 className="display mt-3 text-[clamp(2.6rem,6vw,5rem)] leading-[0.94]">
        Run the studio.<br />
        <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(236,229,211,0.85)" }}>Your way.</span>
      </h1>
      <SettingsTabs />
      <div className="mt-10">{children}</div>
    </div>
  );
}
