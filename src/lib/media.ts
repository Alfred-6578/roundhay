// Real footage goes here. Every picture on the site is a "slot": until a slot has a file registered
// below, the page shows a drawn stand-in. Put the file in /public/media and add one line. No other
// code changes. See public/media/README.txt for the slot names.
export type MediaFile = { src: string; poster?: string };

export const media: Record<string, MediaFile> = {
  // hero: { src: "/media/hero.mp4", poster: "/media/hero.jpg" },
  // The nine cards of the "Shot on Roundhay" carousel: 600x720 (5:6), 6-10 s, silent, 150-630 KB each.
  ...Object.fromEntries(
    Array.from({ length: 9 }, (_, i) => [`rail-${i + 1}`, { src: `/media/rail/rail-${i + 1}.mp4`, poster: `/media/rail/rail-${i + 1}.jpg` }])
  ),
};

// The hero bust: transparent frames of the same statue, ordered from looking furthest to the viewer's
// left through to furthest right. "centre" is the index of the straight-on frame. If the frames only cover
// one side (for example only left turns), the statue glances that way and returns to centre. The page
// picks the frame from the cursor position. Empty frames means the drawn stand-in is shown.
export const bust: { frames: string[]; centre: number; mirrorRight: boolean } = {
  // 1-6 turn up to about 55 degrees to the viewer's left, 7 is straight on, 8-13 turn about 40 degrees right.
  frames: Array.from({ length: 13 }, (_, i) => `/media/bust/bust-${i + 1}.webp`),
  centre: 6,
  // Only needed when there are no right-turn frames: reuses the left ones flipped (the toga then jumps shoulders).
  mirrorRight: false,
};

// Where the face is in each bust frame, as fractions of the frame, so the "locked" box can follow the head.
// cx is the face centre per frame; the box is w wide and runs from top to bottom (measured from the visor in each frame).
export const faceTrack = { cx: [0.4334, 0.4391, 0.4469, 0.4566, 0.4681, 0.4811, 0.4954, 0.5109, 0.5274, 0.5447, 0.5626, 0.581, 0.5995], w: 0.31, top: 0.31, bottom: 0.66 };
