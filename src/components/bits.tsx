import type { Aspect, Status } from "@/lib/mock";

const STATUS: Record<Status, { label: string; cls: string }> = {
  ready: { label: "Ready", cls: "text-ok" },
  rendering: { label: "Rendering", cls: "text-warn" },
  queued: { label: "Queued", cls: "text-silver" },
  failed: { label: "Failed", cls: "text-safelight" },
};

export function StatusDot({ status, progress }: { status: Status; progress?: number }) {
  const s = STATUS[status];
  return (
    <span className={`eyebrow inline-flex items-center gap-1.5 ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full bg-current ${status === "rendering" ? "pulse-dot" : ""}`} />
      {s.label}
      {status === "rendering" && progress != null ? ` ${progress}%` : ""}
    </span>
  );
}

export function aspectClass(a: Aspect) {
  return a === "9:16" ? "aspect-[9/16]" : a === "1:1" ? "aspect-square" : "aspect-video";
}

export function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function Meter({ value, max = 100, className = "" }: { value: number; max?: number; className?: string }) {
  return (
    <div className={`h-1 w-full overflow-hidden bg-line ${className}`}>
      <div className="h-full bg-safelight" style={{ width: `${Math.min(100, (value / max) * 100)}%`, animation: "fill 0.9s ease-out" }} />
    </div>
  );
}
