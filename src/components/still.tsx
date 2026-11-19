import { useId, type ReactNode } from "react";
import type { SceneKey } from "@/lib/mock";

/*
  Generated "frames". There is no footage in the mock, so each scene is drawn as layered shapes with
  grain and a vignette (see .still in globals.css). They are meant to read as stills from a video
  model, which is what makes the cards in the library, explore and templates feel populated.
*/

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Grad({ id, stops, dir = "v" }: { id: string; stops: [string, string, ...string[]]; dir?: "v" | "h" }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={dir === "h" ? 1 : 0} y2={dir === "v" ? 1 : 0}>
      {stops.map((c, i) => (
        <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />
      ))}
    </linearGradient>
  );
}

function Glow({ id, color, o = 0.6 }: { id: string; color: string; o?: number }) {
  return (
    <radialGradient id={id}>
      <stop offset="0" stopColor={color} stopOpacity={o} />
      <stop offset="1" stopColor={color} stopOpacity="0" />
    </radialGradient>
  );
}

function Person({ x, y, s = 1, fill = "#000", hat = false, skirt = false }: { x: number; y: number; s?: number; fill?: string; hat?: boolean; skirt?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <circle cx="0" cy="-27" r="3.3" />
      {hat && <rect x="-3.6" y="-33.5" width="7.2" height="4.4" rx="0.8" />}
      {hat && <rect x="-5" y="-30" width="10" height="1.2" />}
      {skirt ? (
        <path d="M-3.6 -23 Q0 -25 3.6 -23 L4 -15 L9 0 L-9 0 L-4 -15 Z" />
      ) : (
        <>
          <path d="M-5 -23 Q0 -25.5 5 -23 L6 -8 L-6 -8 Z" />
          <rect x="-4.2" y="-8" width="3.4" height="8" />
          <rect x="0.8" y="-8" width="3.4" height="8" />
        </>
      )}
    </g>
  );
}

type SceneProps = { u: string };

function Alley({ u }: SceneProps) {
  const r = rng(7);
  const rain = Array.from({ length: 70 }, () => ({ x: r() * 330, y: r() * 220 - 30 }));
  return (
    <>
      <defs>
        <Grad id={`${u}a`} stops={["#06121a", "#14323f"]} />
        <Grad id={`${u}b`} stops={["#0d2530", "#04090c"]} />
        <Glow id={`${u}c`} color="#ff5a36" />
        <Glow id={`${u}d`} color="#5fe0d0" o={0.5} />
      </defs>
      <rect width="320" height="180" fill={`url(#${u}a)`} />
      <path d="M0 0H92V122H0Z" fill="#091117" />
      <path d="M228 0H320V122H228Z" fill="#091117" />
      <rect x="100" y="36" width="44" height="86" fill="#0d1a22" />
      <rect x="176" y="22" width="46" height="100" fill="#0c1820" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={106 + (i % 2) * 18} y={44 + i * 14} width="8" height="5" fill="#ffd27a" opacity={i % 3 === 0 ? 0.7 : 0.18} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={184 + (i % 2) * 20} y={32 + i * 18} width="9" height="6" fill="#ffd27a" opacity={i % 2 ? 0.55 : 0.15} />
      ))}
      <ellipse cx="66" cy="62" rx="48" ry="58" fill={`url(#${u}c)`} />
      <rect x="62" y="28" width="5" height="64" rx="1" fill="#ff7a54" />
      <ellipse cx="256" cy="62" rx="40" ry="46" fill={`url(#${u}d)`} />
      <rect x="253" y="40" width="4" height="46" rx="1" fill="#8ff2e4" />
      <rect y="120" width="320" height="60" fill={`url(#${u}b)`} />
      <rect x="62" y="122" width="5" height="52" fill="#ff5a36" opacity="0.32" />
      <rect x="253" y="122" width="4" height="40" fill="#5fe0d0" opacity="0.28" />
      <ellipse cx="160" cy="150" rx="20" ry="3" fill="#000" opacity="0.5" />
      <g fill="#000">
        <path d="M138 88 Q160 64 182 88 Z" />
        <rect x="159.4" y="86" width="1.2" height="12" />
        <path d="M154 96 Q160 93 166 96 L168 122 L152 122 Z" />
        <rect x="155" y="122" width="3.6" height="14" />
        <rect x="161.4" y="122" width="3.6" height="14" />
      </g>
      <g className="rain" stroke="#a8dbe9" strokeWidth="0.55" opacity="0.5">
        {rain.map((p, i) => (
          <line key={i} x1={p.x} y1={p.y} x2={p.x - 2.2} y2={p.y + 9} />
        ))}
      </g>
    </>
  );
}

function Dunes({ u }: SceneProps) {
  return (
    <>
      <defs>
        <Grad id={`${u}a`} stops={["#e98f56", "#f7c78a", "#fde7b8"]} />
        <Glow id={`${u}b`} color="#fff1c8" o={0.9} />
        <Grad id={`${u}c`} stops={["#fde7b8", "#e98f56"]} />
      </defs>
      <rect width="320" height="180" fill={`url(#${u}a)`} />
      <circle cx="205" cy="82" r="60" fill={`url(#${u}b)`} />
      <circle cx="205" cy="82" r="13" fill="#fff7de" />
      <path d="M0 112 Q70 92 140 110 T 270 102 T 320 108 V180H0Z" fill="#d98a52" />
      <path d="M0 132 Q80 104 170 128 T 320 120 V180H0Z" fill="#b25c2d" />
      <path d="M0 156 Q100 128 210 152 T 320 144 V180H0Z" fill="#6e3419" />
      <path d="M0 100 H320 V118 H0Z" fill={`url(#${u}c)`} opacity="0.35" />
      <Person x={140} y={118} s={0.34} fill="#2d1409" />
      <Person x={150} y={118} s={0.3} fill="#2d1409" />
      <ellipse cx="240" cy="168" rx="26" ry="3.5" fill="#2d1409" opacity="0.35" />
    </>
  );
}

function Bottle({ u }: SceneProps) {
  return (
    <>
      <defs>
        <Glow id={`${u}a`} color="#d89a52" o={0.55} />
        <Grad id={`${u}b`} stops={["#8a4a12", "#f0b04c", "#b8651a", "#5a2d0a"]} dir="h" />
        <Grad id={`${u}c`} stops={["#2b2118", "#0b0806"]} />
      </defs>
      <rect width="320" height="180" fill="#080605" />
      <ellipse cx="160" cy="78" rx="120" ry="90" fill={`url(#${u}a)`} />
      <rect x="86" y="142" width="148" height="30" fill={`url(#${u}c)`} />
      <ellipse cx="160" cy="142" rx="74" ry="9" fill="#2a2016" />
      <ellipse cx="160" cy="141" rx="74" ry="8" fill="none" stroke="#6b5438" strokeWidth="0.8" />
      <rect x="153" y="52" width="14" height="22" fill="#6b3a10" />
      <rect x="150" y="42" width="20" height="12" rx="2" fill="#dcba72" />
      <rect x="140" y="72" width="40" height="68" rx="7" fill={`url(#${u}b)`} />
      <rect x="146" y="90" width="28" height="28" fill="#efe3c1" opacity="0.92" />
      <g stroke="#3a2a14" strokeWidth="1.2">
        <line x1="150" y1="98" x2="170" y2="98" />
        <line x1="150" y1="104" x2="166" y2="104" />
        <line x1="150" y1="110" x2="169" y2="110" />
      </g>
      <rect x="144" y="76" width="3" height="58" rx="1.5" fill="#fff" opacity="0.4" />
      <ellipse cx="160" cy="145" rx="22" ry="3" fill="#000" opacity="0.6" />
      <g className="sweep" opacity="0.09">
        <rect x="-60" y="-10" width="26" height="200" fill="#fff" transform="skewX(-18)" />
      </g>
    </>
  );
}

function Subway({ u }: SceneProps) {
  return (
    <>
      <defs>
        <Grad id={`${u}a`} stops={["#14463d", "#050d0b"]} />
        <Glow id={`${u}b`} color="#ffe9a8" o={0.85} />
      </defs>
      <rect width="320" height="180" fill="#06100e" />
      <path d="M0 0L128 66V112L0 180Z" fill="#0d211d" />
      <path d="M320 0L192 66V112L320 180Z" fill="#0b1c18" />
      <path d="M0 0H320L192 66H128Z" fill="#081410" />
      <path d="M0 180L128 112H192L320 180Z" fill={`url(#${u}a)`} />
      <ellipse cx="160" cy="88" rx="62" ry="40" fill={`url(#${u}b)`} />
      <rect x="140" y="72" width="40" height="36" fill="#fff3c9" />
      {[[160, 12, 44], [160, 38, 26], [160, 54, 14], [160, 62, 8]].map(([x, y, w], i) => (
        <ellipse key={i} cx={x} cy={y} rx={w / 2} ry={Math.max(1.4, w / 12)} fill="#dff5b8" opacity={0.85 - i * 0.12} className={i === 1 ? "flicker" : ""} />
      ))}
      <g stroke="#4c8576" strokeWidth="1" opacity="0.8">
        <line x1="108" y1="180" x2="154" y2="112" />
        <line x1="212" y1="180" x2="166" y2="112" />
      </g>
      <rect x="148" y="114" width="24" height="66" fill="#ffe9a8" opacity="0.18" />
      <Person x={160} y={116} s={0.8} fill="#000" />
      <ellipse cx="160" cy="146" rx="16" ry="2.5" fill="#000" opacity="0.5" />
    </>
  );
}

function Door({ u }: SceneProps) {
  return (
    <>
      <defs>
        <Grad id={`${u}a`} stops={["#fff4d2", "#f6b866"]} />
        <Glow id={`${u}b`} color="#ffd48a" o={0.8} />
      </defs>
      <rect width="320" height="180" fill="#050403" />
      <ellipse cx="160" cy="90" rx="110" ry="78" fill={`url(#${u}b)`} />
      <path d="M0 0L120 48V132L0 180Z" fill="#0b0806" />
      <path d="M320 0L200 48V132L320 180Z" fill="#0a0705" />
      <path d="M0 180L120 132H200L320 180Z" fill="#150e08" />
      <rect x="120" y="48" width="80" height="84" fill={`url(#${u}a)`} />
      <g className="beam">
        <path d="M120 132H200L270 180H50Z" fill="#ffd48a" opacity="0.5" />
      </g>
      <Person x={160} y={134} s={1.25} fill="#000" />
    </>
  );
}

function Table({ u }: SceneProps) {
  return (
    <>
      <defs>
        <Grad id={`${u}a`} stops={["#1c120a", "#070504"]} />
        <Glow id={`${u}b`} color="#ffbe6a" o={0.55} />
        <clipPath id={`${u}w`}><rect x="214" y="22" width="68" height="62" /></clipPath>
      </defs>
      <rect width="320" height="180" fill={`url(#${u}a)`} />
      <rect x="214" y="22" width="68" height="62" fill="#18283a" />
      <g clipPath={`url(#${u}w)`}>
        <g className="rain" stroke="#8fb8d8" strokeWidth="0.6" opacity="0.5">
          {Array.from({ length: 22 }, (_, i) => (
            <line key={i} x1={214 + ((i * 17) % 70)} y1={10 + ((i * 29) % 80)} x2={212 + ((i * 17) % 70)} y2={19 + ((i * 29) % 80)} />
          ))}
        </g>
      </g>
      <rect x="214" y="22" width="68" height="62" fill="none" stroke="#050403" strokeWidth="3" />
      <line x1="248" y1="22" x2="248" y2="84" stroke="#050403" strokeWidth="2" />
      <polygon points="152,40 168,40 236,142 84,142" fill={`url(#${u}b)`} opacity="0.55" />
      <line x1="160" y1="0" x2="160" y2="28" stroke="#3a2a1a" strokeWidth="0.8" />
      <path d="M143 41 L177 41 L168 27 L152 27 Z" fill="#d1913f" className="flicker" />
      <rect x="64" y="126" width="192" height="6" fill="#3d2815" />
      <rect x="64" y="126" width="192" height="1.5" fill="#d9a05a" opacity="0.8" />
      <rect x="76" y="132" width="5" height="40" fill="#1a110a" />
      <rect x="239" y="132" width="5" height="40" fill="#1a110a" />
      {[[108, 1], [212, -1]].map(([x, d]) => (
        <g key={x}>
          <rect x={x - 5 + d * 14} y="92" width="3" height="34" fill="#1f150c" />
          <circle cx={x} cy="86" r="8" fill="#000" />
          <path d={`M${x - 15} 126 Q${x - 14} 98 ${x} 98 Q${x + 14} 98 ${x + 15} 126Z`} fill="#000" />
          <path d={`M${x + d * 8} 80 A8 8 0 0 ${d > 0 ? 1 : 0} ${x + d * 6.5} 92`} fill="none" stroke="#ffbe6a" strokeWidth="1.1" opacity="0.8" />
        </g>
      ))}
    </>
  );
}

function Lighthouse({ u }: SceneProps) {
  return (
    <>
      <defs>
        <Grad id={`${u}a`} stops={["#04070d", "#162a44", "#31496a"]} />
        <Grad id={`${u}b`} stops={["#0b1d30", "#02060a"]} />
        <Glow id={`${u}c`} color="#e9eef8" o={0.5} />
        <linearGradient id={`${u}d`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff0b8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff0b8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${u}a)`} />
      <circle cx="252" cy="34" r="28" fill={`url(#${u}c)`} />
      <circle cx="252" cy="34" r="8" fill="#eef2fb" />
      <ellipse cx="90" cy="46" rx="70" ry="9" fill="#0a1424" opacity="0.8" />
      <ellipse cx="240" cy="64" rx="60" ry="7" fill="#0a1424" opacity="0.7" />
      <rect y="120" width="320" height="60" fill={`url(#${u}b)`} />
      <g stroke="#9bb6d6" strokeWidth="0.6" opacity="0.35">
        {[128, 136, 146, 158, 170].map((y, i) => (
          <path key={y} d={`M${10 + i * 40} ${y} q12 -3 24 0 t24 0 t24 0`} fill="none" />
        ))}
      </g>
      <g className="beam">
        <path d="M161 57 L320 24 V92 Z" fill={`url(#${u}d)`} />
        <path d="M161 57 L40 40 V76 Z" fill={`url(#${u}d)`} opacity="0.5" />
      </g>
      <path d="M104 180 L130 130 L192 128 L222 180Z" fill="#05070b" />
      <path d="M151 130 L157 64 H165 L171 130Z" fill="#e8e3d6" />
      <path d="M153 106 L154.4 92 H167.6 L169 106Z" fill="#b8402a" />
      <rect x="155" y="52" width="12" height="11" fill="#ffe6a0" className="flicker" />
      <path d="M153 52 L161 44 L169 52Z" fill="#1a1612" />
    </>
  );
}

function Skyline({ u }: SceneProps) {
  const r = rng(21);
  const blds = Array.from({ length: 17 }, (_, i) => ({ x: i * 19 - 4, w: 16 + r() * 8, h: 40 + r() * 80 }));
  return (
    <>
      <defs>
        <Grad id={`${u}a`} stops={["#1f1648", "#8a3f78", "#f0845c", "#ffc37a"]} />
        <Glow id={`${u}b`} color="#ffd9a0" o={0.8} />
      </defs>
      <rect width="320" height="180" fill={`url(#${u}a)`} />
      <ellipse cx="170" cy="130" rx="130" ry="50" fill={`url(#${u}b)`} />
      {blds.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={170 - b.h} width={b.w} height={b.h + 10} fill={i % 2 ? "#0c0a1a" : "#120e22"} />
          {Array.from({ length: Math.floor(b.h / 10) }, (_, k) =>
            r() > 0.62 ? <rect key={k} x={b.x + 3 + (k % 2) * 6} y={170 - b.h + 6 + k * 9} width="3.2" height="3.6" fill="#ffd27a" opacity="0.85" /> : null
          )}
        </g>
      ))}
      <rect y="172" width="320" height="8" fill="#07060f" />
      <rect x="168" y="48" width="1.4" height="34" fill="#0c0a1a" />
      <circle cx="168.7" cy="46" r="1.6" fill="#ff5a36" className="pulse-dot" />
    </>
  );
}

function Forest({ u }: SceneProps) {
  const r = rng(5);
  const back = Array.from({ length: 24 }, (_, i) => ({ x: i * 14 - 6, h: 60 + r() * 60 }));
  const mid = Array.from({ length: 16 }, (_, i) => ({ x: i * 21 - 8, h: 90 + r() * 60 }));
  return (
    <>
      <defs>
        <Grad id={`${u}a`} stops={["#0b1d1e", "#3d6b62", "#a9c9b8"]} />
        <linearGradient id={`${u}f`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d6eadc" stopOpacity="0" />
          <stop offset="0.5" stopColor="#d6eadc" stopOpacity="0.4" />
          <stop offset="1" stopColor="#d6eadc" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${u}a)`} />
      {back.map((t, i) => (
        <path key={i} d={`M${t.x} 140 L${t.x + 9} ${140 - t.h} L${t.x + 18} 140Z`} fill="#27504a" opacity="0.7" />
      ))}
      <rect y="92" width="320" height="42" fill={`url(#${u}f)`} />
      {mid.map((t, i) => (
        <path key={i} d={`M${t.x} 160 L${t.x + 12} ${160 - t.h} L${t.x + 24} 160Z`} fill="#133330" />
      ))}
      <path d="M150 0H190L232 180H110Z" fill="#eaf6d6" opacity="0.13" className="beam" />
      <rect x="40" y="0" width="12" height="180" fill="#07100f" />
      <rect x="268" y="0" width="16" height="180" fill="#06100e" />
      <rect y="150" width="320" height="30" fill="#07100f" />
      <Person x={160} y={160} s={1.1} fill="#000" />
      <rect x="157.6" y="132" width="4.8" height="2.4" fill="#f0532b" />
    </>
  );
}

function Ridges({ u }: SceneProps) {
  const r = rng(11);
  const stars = Array.from({ length: 22 }, () => ({ x: r() * 320, y: r() * 60, o: 0.3 + r() * 0.6 }));
  return (
    <>
      <defs>
        <Grad id={`${u}a`} stops={["#16223f", "#5a5f93", "#e9a79a", "#fde0b0"]} />
        <Glow id={`${u}b`} color="#ffe0b0" o={0.95} />
      </defs>
      <rect width="320" height="180" fill={`url(#${u}a)`} />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="0.6" fill="#fff" opacity={s.o} />
      ))}
      <circle cx="232" cy="96" r="62" fill={`url(#${u}b)`} />
      <path d="M0 110 L50 80 L84 100 L130 64 L176 104 L224 78 L270 106 L320 86 V180H0Z" fill="#8e8fc0" opacity="0.7" />
      <path d="M130 64 L142 76 L134 74 L128 82 L120 74Z" fill="#fff" opacity="0.7" />
      <path d="M0 132 L60 98 L110 126 L168 90 L228 128 L282 100 L320 122 V180H0Z" fill="#4e5287" />
      <path d="M168 90 L180 102 L172 100 L166 108 L158 100Z" fill="#fff" opacity="0.6" />
      <path d="M0 156 L70 126 L130 152 L200 120 L260 150 L320 134 V180H0Z" fill="#232a55" />
      <path d="M0 172 L90 150 L170 168 L250 148 L320 164 V180H0Z" fill="#0d1230" />
    </>
  );
}

// The oldest surviving film is a lawn, a house and a few people walking in a circle.
function Garden({ u }: SceneProps) {
  const ring = "M232 150 A72 17 0 1 1 88 150 A72 17 0 1 1 232 150";
  return (
    <g className="flicker">
      <defs>
        <Grad id={`${u}a`} stops={["#7d6b50", "#c9b48c"]} />
        <Grad id={`${u}b`} stops={["#8d7a58", "#2e2418"]} />
      </defs>
      <rect width="320" height="180" fill={`url(#${u}a)`} />
      <circle cx="268" cy="62" r="34" fill="#2a2116" />
      <circle cx="236" cy="78" r="26" fill="#33291b" />
      <circle cx="292" cy="86" r="26" fill="#2a2116" />
      <rect x="18" y="52" width="122" height="62" fill="#241c13" />
      <path d="M10 54 L79 22 L148 54Z" fill="#17120b" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={30 + i * 28} y="66" width="14" height="18" fill="#d9c9a0" opacity={i === 1 ? 0.3 : 0.7} />
      ))}
      <rect x="62" y="92" width="14" height="22" fill="#120e08" />
      <rect y="112" width="320" height="68" fill={`url(#${u}b)`} />
      <g stroke="#2a2116" strokeWidth="1.2">
        {Array.from({ length: 40 }, (_, i) => (
          <line key={i} x1={i * 8 + 2} y1="104" x2={i * 8 + 2} y2="118" />
        ))}
        <line x1="0" y1="108" x2="320" y2="108" />
        <line x1="0" y1="114" x2="320" y2="114" />
      </g>
      <path d={ring} fill="none" stroke="#f1e6c8" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.35" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <Person x={0} y={0} s={1.1} fill="#0e0a06" hat={i % 2 === 0} skirt={i % 2 === 1} />
          <animateMotion dur="10s" repeatCount="indefinite" begin={`${-i * 2.5}s`} path={ring} />
        </g>
      ))}
    </g>
  );
}

const SCENES: Record<SceneKey, (p: SceneProps) => ReactNode> = {
  alley: Alley, dunes: Dunes, bottle: Bottle, subway: Subway, door: Door, table: Table,
  lighthouse: Lighthouse, skyline: Skyline, forest: Forest, ridges: Ridges, garden: Garden,
};

const PHOTOS: Partial<Record<SceneKey, string>> = {
  alley: "/media/rail/rail-1.jpg", dunes: "/media/rail/rail-2.jpg", bottle: "/media/rail/rail-3.jpg",
  subway: "/media/rail/rail-4.jpg", lighthouse: "/media/rail/rail-5.jpg", door: "/media/rail/rail-6.jpg",
  skyline: "/media/rail/rail-7.jpg", forest: "/media/rail/rail-8.jpg", table: "/media/rail/rail-9.jpg",
};

export function Still({ scene, className = "", playing = false }: { scene: SceneKey; className?: string; playing?: boolean }) {
  const u = `s${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const Scene = SCENES[scene];
  const photo = PHOTOS[scene];
  // Where there is a photo of the scene (the same frames as the home page), show that.
  if (photo) {
    return (
      <div className={`still ${playing ? "still-playing" : ""} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="" loading="lazy" decoding="async" className="still-art !absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`still ${playing ? "still-playing" : ""} ${className}`}>
      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g className="still-art">
          <Scene u={u} />
        </g>
      </svg>
    </div>
  );
}

// A cast member's headshot: halftone backdrop, silhouette, rim light in their colour.
export function Portrait({ hue, className = "" }: { hue: number; className?: string }) {
  const u = `p${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <div className={`still ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={`${u}a`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={`hsl(${hue} 45% 26%)`} />
            <stop offset="1" stopColor={`hsl(${hue} 50% 8%)`} />
          </linearGradient>
          <pattern id={`${u}h`} width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1" fill={`hsl(${hue} 60% 60%)`} opacity="0.18" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#${u}a)`} />
        <rect width="100" height="100" fill={`url(#${u}h)`} />
        <path d="M12 100 Q14 74 50 70 Q86 74 88 100Z" fill="#050403" />
        <circle cx="50" cy="46" r="15" fill="#050403" />
        <path d="M35 44 A15 15 0 0 1 50 31" fill="none" stroke={`hsl(${hue} 80% 62%)`} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12 100 Q14 74 38 70" fill="none" stroke={`hsl(${hue} 80% 62%)`} strokeWidth="1.2" opacity="0.7" />
      </svg>
    </div>
  );
}
