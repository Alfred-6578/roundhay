"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { fmtTime } from "@/components/bits";
import { Still } from "@/components/still";
import type { SceneKey } from "@/lib/mock";

// A pretend player: the frame drifts while "playing" and the playhead moves. There is no video yet.
export function Player({ scene, seconds, className = "" }: { scene: SceneKey; seconds: number; className?: string }) {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((v) => (v + 0.1 >= seconds ? 0 : v + 0.1)), 100);
    return () => clearInterval(id);
  }, [playing, seconds]);

  return (
    <div className={`relative w-full ${className}`}>
      <Still scene={scene} playing={playing} className="h-full w-full" />
      <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)} className="absolute inset-0 z-10 flex items-center justify-center">
        {!playing && (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bone text-ink">
            <Icon name="play" size={24} className="ml-1" fill="currentColor" strokeWidth={0} />
          </span>
        )}
      </button>
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 bg-gradient-to-t from-night/95 to-transparent px-3 pb-3 pt-10">
        <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)} className="text-bone">
          <Icon name={playing ? "pause" : "play"} size={16} fill="currentColor" strokeWidth={0} />
        </button>
        <input type="range" aria-label="Seek" min={0} max={seconds * 10} value={t * 10} onChange={(e) => setT(Number(e.target.value) / 10)} className="h-[3px] flex-1 accent-[#f0532b]" />
        <span className="eyebrow text-[11px]">{fmtTime(t)} / {fmtTime(seconds)}</span>
      </div>
    </div>
  );
}
