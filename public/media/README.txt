Drop video files here (mp4, H.264, no audio needed, ideally under 8 MB each for the hero and rails).
Then register each in src/lib/media.ts, one line per slot, e.g.:

  hero: { src: "/media/hero.mp4", poster: "/media/hero.jpg" },

Until a slot has a file, the page shows the drawn stand-in frame.
Slots: hero, rail-1 ... rail-9, cast, camera, batch, cta, auth.
For the app, clip slots are "clip-c01" ... "clip-c12".

HERO BUST (the statue that follows the cursor)
Generate 7 frames of the SAME statue, identical framing, lighting and size, head turning in steps:
frame 1 looking about 35 degrees to the viewer's left, frame 4 straight on, frame 7 about 35 degrees right.
Export each as a transparent PNG (background removed), about 1200 x 1400, and list them in bustFrames in src/lib/media.ts.

Prompt to start from:
  Marble bust of a Roman statue, head and shoulders, short sculpted curls, wearing sleek futuristic
  visor goggles in glowing orange across the eyes, polished white marble with fine grey veining,
  soft studio light from the upper left, plain light grey background, centred, photoreal sculpture,
  shallow depth of field. Turn the head [35 degrees left / straight on / 35 degrees right].
Tip: generate the straight-on frame first, then use it as the reference image for the others so the face and drape stay identical.


RAIL CARDS (done)
The nine carousel cards are public/media/rail/rail-1..9 (.mp4 + .jpg poster, 600x720, silent), registered in src/lib/media.ts.
Originals live outside public in source-media/ (nine-cards/ and the two bust videos), so they are not served.
