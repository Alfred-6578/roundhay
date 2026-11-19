import { Still } from "@/components/still";
import { media } from "@/lib/media";
import type { SceneKey } from "@/lib/mock";

// A place for a clip. Fills its parent: the parent sets the shape, radius and overflow-hidden.
export function MediaSlot({ slot, fallback, className = "", playing }: { slot: string; fallback: SceneKey; className?: string; playing?: boolean }) {
  const m = media[slot];
  if (m) {
    return <video className={`h-full w-full object-cover ${className}`} src={m.src} poster={m.poster} autoPlay muted loop playsInline preload="metadata" />;
  }
  return <Still scene={fallback} playing={playing} className={`h-full w-full ${className}`} />;
}
