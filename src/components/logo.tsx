import { useId } from "react";

type Tone = "bone" | "ink";

// (The drawing's box is its true extent: ring, beads and shadows span x 2.4-41.8, y 5.0-42.4 in these units, so nothing is
// cropped; the glow may spill outside it. In the wordmark the ring band's height, 33.4 units, equals 0.75em, the measured cap height of Unbounded; the beads then
// overshoot a little, as a round letter does.)
// The ring: four figures walking a circle, like the lawn in the first film, one of them the ember. Here it is an
// orbit in perspective, lit from the top left. The ring is tilted and the figures nearer to us are bigger and
// brighter, the ones behind smaller and darker. It is drawn back to front: far half of the ring, the figure behind,
// near half of the ring, the figures at the sides, the figure in front.
const CX = 22, CY = 22.6, RX = 15.4, RY = 14, TILT = (-12 * Math.PI) / 180;

function pt(deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  const x = RX * Math.cos(a), y = RY * Math.sin(a);
  return [CX + x * Math.cos(TILT) - y * Math.sin(TILT), CY + x * Math.sin(TILT) + y * Math.cos(TILT)];
}
function arc(from: number, to: number): string {
  const n = 28;
  return Array.from({ length: n + 1 }, (_, i) => {
    const [x, y] = pt(from + ((to - from) * i) / n);
    return `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
}

export function Orbit({ tone = "bone", className = "", style }: { tone?: Tone; className?: string; style?: React.CSSProperties }) {
  const uid = useId().replace(/:/g, "");
  const ink = tone === "ink";
  const ring = ink ? { hi: "#6d6d75", mid: "#2a2a2f", lo: "#0d0d0e", back: "#3a3a41" } : { hi: "#ffffff", mid: "#e6e1d7", lo: "#b3ad9f", back: "#948e80" };
  const ball = ink ? { hi: "#8b8b94", mid: "#2a2a2f", lo: "#0a0a0b" } : { hi: "#ffffff", mid: "#e0dbd0", lo: "#a69f90" };
  const figures: { deg: number; r: number; ember?: boolean; depth: number }[] = [
    { deg: 270, r: 3.9, ember: true, depth: 0 }, // behind
    { deg: 180, r: 4.5, depth: 1 },
    { deg: 0, r: 4.5, depth: 1 },
    { deg: 90, r: 5.3, depth: 2 }, // in front
  ];
  const sphere = (f: (typeof figures)[number]) => {
    const [x, y] = pt(f.deg);
    return (
      <g key={f.deg} opacity={f.depth === 0 ? 0.92 : 1}>
        {f.ember && <circle cx={x} cy={y} r={f.r * 2.1} fill={`url(#${uid}glow)`} />}
        <ellipse cx={x + 0.5} cy={y + f.r * 0.85} rx={f.r * 0.95} ry={f.r * 0.3} fill="#000" opacity={ink ? 0.22 : 0.18} />
        <circle cx={x} cy={y} r={f.r} fill={`url(#${uid}${f.ember ? "e" : "s"})`} />
        <circle cx={x - f.r * 0.32} cy={y - f.r * 0.38} r={f.r * 0.22} fill="#fff" opacity={f.ember ? 0.7 : ink ? 0.45 : 0.9} />
      </g>
    );
  };
  return (
    <svg viewBox="1.6 4.2 41 39" aria-hidden="true" className={`overflow-visible ${className}`} style={style}>
      <defs>
        <linearGradient id={`${uid}r`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor={ring.hi} />
          <stop offset="0.45" stopColor={ring.mid} />
          <stop offset="1" stopColor={ring.lo} />
        </linearGradient>
        <radialGradient id={`${uid}s`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={ball.hi} />
          <stop offset="0.5" stopColor={ball.mid} />
          <stop offset="1" stopColor={ball.lo} />
        </radialGradient>
        <radialGradient id={`${uid}e`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffc7a8" />
          <stop offset="0.45" stopColor="#ff5a24" />
          <stop offset="1" stopColor="#b02b07" />
        </radialGradient>
        <radialGradient id={`${uid}glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff4d1f" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff4d1f" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* far half of the ring: thinner, darker, as if seen from inside */}
      <path d={arc(180, 360)} fill="none" stroke={ring.back} strokeWidth="4.2" strokeLinecap="round" opacity={ink ? 0.9 : 0.95} />
      {sphere(figures[0])}
      {/* near half: thicker, glossy, with a highlight along its top edge */}
      <path d={arc(0, 180)} fill="none" stroke={`url(#${uid}r)`} strokeWidth="6.4" strokeLinecap="round" />
      <path d={arc(10, 170)} fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity={ink ? 0.38 : 0.85} transform="translate(-0.5 -1.6)" />
      {sphere(figures[1])}
      {sphere(figures[2])}
      {sphere(figures[3])}
    </svg>
  );
}

// The symbol on its own (favicons, app icons, anywhere there is no room for the name).
export function Mark({ size = 28, tone = "bone" }: { size?: number; tone?: Tone }) {
  return <Orbit tone={tone} className="shrink-0" style={{ width: size, height: size * (39 / 41) }} />;
}

// ROUNDHAY, with the orbit as the O. Everything is in em, so it takes its size from the font size of whatever it
// sits in (the nav, a heading, the giant word in the footer) and the O always matches the height of the letters.
export function Wordmark({ tone = "bone", className = "" }: { tone?: Tone; className?: string }) {
  const c = tone === "bone" ? "#f3f0ea" : "#0d0d0e";
  return (
    <span
      role="img"
      aria-label="Roundhay"
      className={`group inline-flex items-baseline uppercase ${className}`}
      style={{ color: c, fontFamily: "var(--font-wordmark), var(--font-jakarta), sans-serif", fontWeight: 800, letterSpacing: "0.01em" }}
    >
      <span aria-hidden="true">R</span>
      <Orbit tone={tone} className="mx-[0.02em] inline-block h-[0.875em] w-[0.92em] shrink-0 transition-transform duration-700 ease-out group-hover:rotate-[20deg] motion-reduce:transition-none" style={{ marginBottom: "-0.075em" }} />
      <span aria-hidden="true">UNDHAY</span>
    </span>
  );
}

export function Logo({ size = 28, tone = "bone", className = "" }: { size?: number; tone?: Tone; className?: string }) {
  return (
    <span className={`inline-flex items-center leading-none ${className}`} style={{ fontSize: size * 0.62 }}>
      <Wordmark tone={tone} />
    </span>
  );
}
