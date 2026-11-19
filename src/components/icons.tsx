import type { SVGProps } from "react";

const paths = {
  home: "M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5",
  queue: "M4 6h16M4 12h16M4 18h10",
  scissors: "M6 7.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM6 21.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8 6l12 12M8 18L20 6",
  compass: "M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z",
  gear: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z",
  help: "M12 21a9 9 0 100-18 9 9 0 000 18zM9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1.1-1.5 2.2M12 17h.01",
  play: "M7 4.5v15l12-7.5z",
  pause: "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z",
  plus: "M12 5v14M5 12h14",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-5-5",
  heart: "M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z",
  remix: "M17 3l4 4-4 4M3 11V9a2 2 0 012-2h16M7 21l-4-4 4-4M21 13v2a2 2 0 01-2 2H3",
  download: "M12 4v11M7 11l5 5 5-5M5 20h14",
  lock: "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 017 0v3",
  bell: "M6 16V11a6 6 0 1112 0v5l1.5 2h-15zM10 21h4",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
  chevron: "M9 6l6 6-6 6",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  coin: "M12 21a9 9 0 100-18 9 9 0 000 18zM14.5 9.5c-.4-.9-1.4-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2.1-.6-2.5-1.5M12 6.5v1.5M12 16v1.5",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.5h.01",
  film: "M4 4h16v16H4zM8 4v16M16 4v16M4 8h4M4 12h4M4 16h4M16 8h4M16 12h4M16 16h4",
  upload: "M12 16V5M7 9l5-5 5 5M5 20h14",
  trash: "M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",
  copy: "M9 9h11v11H9zM5 15V5h10",
  wand: "M5 19L17 7M14 4l1 2.5L17.5 7.5 15 8.5 14 11l-1-2.5L10.5 7.5 13 6.5zM19 13l.6 1.4L21 15l-1.4.6L19 17l-.6-1.4L17 15l1.4-.6z",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  back: "M19 12H5M11 6l-6 6 6 6",
  dots: "M6 12h.01M12 12h.01M18 12h.01",
  scene: "M3 6h18v12H3zM3 10h18",
  mic: "M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3zM6 11a6 6 0 0012 0M12 17v4",
  text: "M5 6h14M12 6v13M9 19h6",
  music: "M9 18V6l10-2v12M9 18a3 3 0 11-6 0 3 3 0 016 0zM19 16a3 3 0 11-6 0 3 3 0 016 0z",
  key: "M14 10a4 4 0 11-3.9 3L4 19v-3h3v-2h2l1.5-1.5A4 4 0 0114 10z",
  // camera moves
  "m-static": "M5 7h14v10H5zM12 12h.01",
  "m-dolly-in": "M4 4l5 5M20 4l-5 5M4 20l5-5M20 20l-5-5M9 9h6v6H9z",
  "m-dolly-out": "M9 9L4 4M15 9l5-5M9 15l-5 5M15 15l5 5M9 9h6v6H9z",
  "m-pan-left": "M20 12H5M10 6l-6 6 6 6",
  "m-pan-right": "M4 12h15M14 6l6 6-6 6",
  "m-tilt-up": "M12 20V5M6 11l6-6 6 6",
  "m-orbit": "M4 12a8 4 0 1016 0 8 4 0 10-16 0zM12 12h.01M18 7l2-1-1 2",
  "m-crane": "M5 19h6V9h8M15 5l4 4-4 4",
  "m-handheld": "M3 12l3-3 3 3 3-3 3 3 3-3 3 3M3 17l3-3 3 3 3-3 3 3 3-3 3 3",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 18, className, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`shrink-0 ${className ?? ""}`} {...rest}>
      <path d={paths[name]} />
    </svg>
  );
}
