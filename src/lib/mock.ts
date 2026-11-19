// Everything here is mock data for the interface: no backend yet. Shapes are kept close to what a
// real API would return so the screens can switch over without a redesign.

export type SceneKey =
  | "alley" | "dunes" | "bottle" | "subway" | "door" | "table"
  | "lighthouse" | "skyline" | "forest" | "ridges" | "garden";

export type Aspect = "9:16" | "16:9" | "1:1";
export type Status = "ready" | "rendering" | "queued" | "failed";

export type Model = {
  id: string; name: string; maker: string; blurb: string; maxSeconds: number; maxRes: string;
  creditsPerSecond: number; speed: string; best: string;
};

// Roundhay does not build video models: it brings leading ones from other makers into one workspace, and adds the cast,
// camera and scheduling layer on top. THE NUMBERS BELOW ARE PLACEHOLDERS. Length, resolution and render time must be
// checked against each provider before launch, and credits per second set from what each one costs us plus our margin.
// Versions change quickly (the sites we compared disagree), so change a name here and it changes everywhere.
export const models: Model[] = [
  { id: "veo", name: "Veo 3.1", maker: "Google", blurb: "The top-quality pick: crisp, realistic shots with sound, up to 4K.", maxSeconds: 8, maxRes: "4K", creditsPerSecond: 40, speed: "~2 min", best: "Hero shots, ads" },
  { id: "kling", name: "Kling 3.0", maker: "Kuaishou", blurb: "Photorealism with complicated motion: people, crowds, hands.", maxSeconds: 10, maxRes: "1080p", creditsPerSecond: 12, speed: "~2 min", best: "Realistic people and motion" },
  { id: "seedance", name: "Seedance 2.0", maker: "ByteDance", blurb: "Picture, voices and sound effects made together, and strong from a reference image.", maxSeconds: 15, maxRes: "1080p", creditsPerSecond: 10, speed: "~90 sec", best: "Series, characters, dialogue" },
  { id: "wan", name: "Wan 3.0", maker: "Alibaba", blurb: "Fast and light, a good balance of speed and richness.", maxSeconds: 10, maxRes: "1080p", creditsPerSecond: 6, speed: "~40 sec", best: "Drafts, iteration" },
  { id: "minimax", name: "MiniMax H3", maker: "MiniMax", blurb: "Up to 2K from text, start and end frames, or several references.", maxSeconds: 10, maxRes: "2K", creditsPerSecond: 9, speed: "~2 min", best: "Keyframes, stylised looks" },
];

export const cameraMoves = [
  { id: "static", label: "Static" },
  { id: "dolly-in", label: "Dolly in" },
  { id: "dolly-out", label: "Dolly out" },
  { id: "pan-left", label: "Pan left" },
  { id: "pan-right", label: "Pan right" },
  { id: "tilt-up", label: "Tilt up" },
  { id: "orbit", label: "Orbit" },
  { id: "crane", label: "Crane up" },
  { id: "handheld", label: "Handheld" },
] as const;

export type Character = { id: string; name: string; short: string; role: string; hue: number; episodes: number; project: string };
export const cast: Character[] = [
  { id: "mara", name: "Mara Quill", short: "Mara", role: "Narrator, Night Feed", hue: 18, episodes: 14, project: "night-feed" },
  { id: "okoye", name: "Det. Okoye", short: "Okoye", role: "Lead, The Lagos Files", hue: 200, episodes: 9, project: "lagos-files" },
  { id: "tomas", name: "Old Tomas", short: "Tomas", role: "Shopkeeper, recurring", hue: 42, episodes: 6, project: "night-feed" },
  { id: "pip", name: "Pip", short: "Pip", role: "Courier robot, mascot", hue: 160, episodes: 22, project: "kickscene" },
  { id: "ines", name: "Inês", short: "Inês", role: "Host, Wander Loop", hue: 330, episodes: 11, project: "wander-loop" },
];

export type Project = { id: string; name: string; blurb: string; scene: SceneKey; clips: number; episodes: string };
export const projects: Project[] = [
  { id: "night-feed", name: "Night Feed", blurb: "Daily noir shorts with a recurring narrator.", scene: "alley", clips: 48, episodes: "Ep. 14" },
  { id: "lagos-files", name: "The Lagos Files", blurb: "Detective series, 9 episodes in.", scene: "door", clips: 31, episodes: "Ep. 9" },
  { id: "kickscene", name: "Kickscene Ads", blurb: "Product loops for a sneaker label.", scene: "bottle", clips: 27, episodes: "12 spots" },
  { id: "wander-loop", name: "Wander Loop", blurb: "Slow travel b-roll for a weekly channel.", scene: "dunes", clips: 40, episodes: "Wk 11" },
];

export type Clip = {
  id: string; title: string; scene: SceneKey; project: string; kind: "Video" | "Image";
  seconds: number; aspect: Aspect; status: Status; progress?: number; model: string;
  cast: string[]; camera: string; prompt: string; when: string; credits: number; seed: number;
  res: string; versions: number;
};

export const clips: Clip[] = [
  { id: "c01", title: "Rain-soaked alley", scene: "alley", project: "night-feed", kind: "Video", seconds: 8, aspect: "9:16", status: "ready", model: "seedance", cast: ["mara"], camera: "Dolly in", prompt: "A rainy city street at night, neon reflections on wet asphalt, slow dolly in. Mara walks under a black umbrella, same coat as episode 12.", when: "2 hours ago", credits: 80, seed: 48213, res: "1080p", versions: 3 },
  { id: "c02", title: "Flooded subway platform", scene: "subway", project: "night-feed", kind: "Video", seconds: 10, aspect: "9:16", status: "rendering", progress: 64, model: "seedance", cast: ["mara"], camera: "Handheld", prompt: "Mara crosses a flooded subway platform, a train light flickering far down the tunnel, ankle-deep water catching the lamps.", when: "Just now", credits: 100, seed: 90177, res: "1080p", versions: 1 },
  { id: "c03", title: "The door into daylight", scene: "door", project: "night-feed", kind: "Video", seconds: 6, aspect: "9:16", status: "queued", model: "seedance", cast: ["mara"], camera: "Static", prompt: "Mara opens a door at the end of a dark corridor. Warm daylight floods in and she steps toward it.", when: "In queue", credits: 60, seed: 11240, res: "1080p", versions: 1 },
  { id: "c04", title: "Golden hour, Erg Chebbi", scene: "dunes", project: "wander-loop", kind: "Video", seconds: 12, aspect: "16:9", status: "ready", model: "veo", cast: [], camera: "Crane up", prompt: "Drone pass over Saharan dunes at golden hour, long shadows, a lone traveller on the ridge, warm haze.", when: "Yesterday", credits: 480, seed: 70022, res: "4K", versions: 2 },
  { id: "c05", title: "Amber bottle, studio spin", scene: "bottle", project: "kickscene", kind: "Video", seconds: 6, aspect: "1:1", status: "ready", model: "veo", cast: [], camera: "Orbit", prompt: "Glass amber bottle on a dark pedestal, slow orbit, a single softbox sweeping across the label, deep black background.", when: "Yesterday", credits: 240, seed: 33801, res: "1080p", versions: 4 },
  { id: "c06", title: "Two chairs, one lamp", scene: "table", project: "lagos-files", kind: "Video", seconds: 8, aspect: "16:9", status: "ready", model: "seedance", cast: ["okoye"], camera: "Dolly in", prompt: "Det. Okoye sits across a table from a stranger under a single hanging lamp. Rain on the window behind them.", when: "2 days ago", credits: 80, seed: 55190, res: "1080p", versions: 2 },
  { id: "c07", title: "Lighthouse, storm coming", scene: "lighthouse", project: "wander-loop", kind: "Video", seconds: 10, aspect: "16:9", status: "ready", model: "minimax", cast: [], camera: "Tilt up", prompt: "A lighthouse on black rock, beam sweeping through low cloud as the sea builds, painterly, heavy brush texture.", when: "2 days ago", credits: 90, seed: 20418, res: "1080p", versions: 1 },
  { id: "c08", title: "City at dusk, windows on", scene: "skyline", project: "lagos-files", kind: "Video", seconds: 8, aspect: "16:9", status: "ready", model: "wan", cast: [], camera: "Pan right", prompt: "Skyline at dusk, purple to orange sky, windows coming on one by one, a slow pan right across the rooftops.", when: "3 days ago", credits: 48, seed: 81776, res: "1080p", versions: 1 },
  { id: "c09", title: "Fog in the pines", scene: "forest", project: "wander-loop", kind: "Video", seconds: 12, aspect: "9:16", status: "ready", model: "veo", cast: ["ines"], camera: "Dolly in", prompt: "Inês walks into a pine forest at first light, fog between the trunks, shafts of pale light, quiet.", when: "4 days ago", credits: 480, seed: 64420, res: "4K", versions: 2 },
  { id: "c10", title: "Alpine ridge at 5 a.m.", scene: "ridges", project: "wander-loop", kind: "Video", seconds: 8, aspect: "16:9", status: "failed", model: "veo", cast: [], camera: "Crane up", prompt: "Layered alpine ridgelines in blue haze, first sun catching the snow, a crane move rising over the nearest ridge.", when: "4 days ago", credits: 0, seed: 14021, res: "4K", versions: 1 },
  { id: "c11", title: "Narrator reference frame", scene: "alley", project: "night-feed", kind: "Image", seconds: 0, aspect: "9:16", status: "ready", model: "seedance", cast: ["mara"], camera: "Static", prompt: "Reference portrait of Mara Quill, black wool coat, short dark hair, neon rim light from the left. Locked as a cast member.", when: "1 week ago", credits: 6, seed: 40111, res: "1080p", versions: 5 },
  { id: "c12", title: "Garden, 1888 (homage)", scene: "garden", project: "night-feed", kind: "Video", seconds: 2, aspect: "16:9", status: "ready", model: "minimax", cast: [], camera: "Static", prompt: "Four figures walk in a slow circle on a lawn, grainy silver-gelatin look, 12 frames per second, a house behind a fence.", when: "1 week ago", credits: 18, seed: 1888, res: "1080p", versions: 1 },
];

export const clipById = (id: string) => clips.find((c) => c.id === id);
export const modelById = (id: string) => models.find((m) => m.id === id) ?? models[0];
export const castById = (id: string) => cast.find((c) => c.id === id);
export const projectById = (id: string) => projects.find((p) => p.id === id);

export type Template = {
  id: string; name: string; blurb: string; category: "Faceless" | "Narrative" | "Commerce" | "B-roll" | "Animation";
  scene: SceneKey; aspect: Aspect; seconds: number; model: string; uses: string; by: string;
};
export const templates: Template[] = [
  { id: "t1", name: "Midnight narrator", blurb: "One character, a rainy city, slow pushes. The Night Feed look.", category: "Faceless", scene: "alley", aspect: "9:16", seconds: 8, model: "seedance", uses: "12.4k", by: "nightfeed" },
  { id: "t2", name: "Reddit story cold open", blurb: "Three moody b-roll cuts under a voiceover hook.", category: "Faceless", scene: "table", aspect: "9:16", seconds: 6, model: "wan", uses: "9.8k", by: "overheard.ai" },
  { id: "t3", name: "True crime recreation", blurb: "A consistent detective, interiors, slow dolly.", category: "Narrative", scene: "door", aspect: "16:9", seconds: 10, model: "seedance", uses: "6.1k", by: "casefile.gen" },
  { id: "t4", name: "Documentary b-roll pack", blurb: "Landscapes and weather for long-form voiceover.", category: "B-roll", scene: "ridges", aspect: "16:9", seconds: 12, model: "veo", uses: "8.7k", by: "wander.loop" },
  { id: "t5", name: "Product orbit", blurb: "Dark pedestal, softbox sweep, 360° spin.", category: "Commerce", scene: "bottle", aspect: "1:1", seconds: 6, model: "veo", uses: "15.2k", by: "clarastudio" },
  { id: "t6", name: "Sneaker studio loop", blurb: "Hard light, seamless loop, built for ad placements.", category: "Commerce", scene: "bottle", aspect: "9:16", seconds: 4, model: "wan", uses: "7.3k", by: "kickscene" },
  { id: "t7", name: "Painted lighthouse", blurb: "Heavy brush texture, storm light, no characters.", category: "Animation", scene: "lighthouse", aspect: "16:9", seconds: 8, model: "minimax", uses: "3.9k", by: "salt.and.ink" },
  { id: "t8", name: "City at dusk timelapse", blurb: "Windows turning on across a skyline.", category: "B-roll", scene: "skyline", aspect: "16:9", seconds: 8, model: "wan", uses: "5.5k", by: "rooftop.reel" },
  { id: "t9", name: "Fog and pines", blurb: "Quiet nature scene with a walking host.", category: "Narrative", scene: "forest", aspect: "9:16", seconds: 10, model: "veo", uses: "4.2k", by: "wander.loop" },
];

export type Post = { id: string; title: string; by: string; scene: SceneKey; aspect: Aspect; likes: string; remixes: string; model: string; category: Template["category"] };
export const posts: Post[] = [
  { id: "p1", title: "Rain-soaked alley, same narrator, ep. 14", by: "nightfeed", scene: "alley", aspect: "9:16", likes: "18.2k", remixes: "1.4k", model: "Seedance 2.0", category: "Faceless" },
  { id: "p2", title: "Golden hour over the Sahara", by: "wander.loop", scene: "dunes", aspect: "16:9", likes: "12.9k", remixes: "802", model: "Veo 3.1", category: "B-roll" },
  { id: "p3", title: "Amber bottle, one take", by: "clarastudio", scene: "bottle", aspect: "1:1", likes: "9.4k", remixes: "2.1k", model: "Veo 3.1", category: "Commerce" },
  { id: "p4", title: "The last train home", by: "casefile.gen", scene: "subway", aspect: "9:16", likes: "7.7k", remixes: "640", model: "Kling 3.0", category: "Narrative" },
  { id: "p5", title: "Lighthouse before the storm", by: "salt.and.ink", scene: "lighthouse", aspect: "16:9", likes: "6.3k", remixes: "391", model: "MiniMax H3", category: "Animation" },
  { id: "p6", title: "Door at the end of the hall", by: "overheard.ai", scene: "door", aspect: "9:16", likes: "5.8k", remixes: "1.1k", model: "Kling 3.0", category: "Faceless" },
  { id: "p7", title: "Skyline, windows coming on", by: "rooftop.reel", scene: "skyline", aspect: "16:9", likes: "4.9k", remixes: "288", model: "Wan 3.0", category: "B-roll" },
  { id: "p8", title: "Two chairs, one lamp", by: "casefile.gen", scene: "table", aspect: "16:9", likes: "4.4k", remixes: "517", model: "Seedance 2.0", category: "Narrative" },
  { id: "p9", title: "Fog in the pines", by: "wander.loop", scene: "forest", aspect: "9:16", likes: "3.8k", remixes: "204", model: "Veo 3.1", category: "B-roll" },
  { id: "p11", title: "Garden scene, after Le Prince", by: "frame.zero", scene: "garden", aspect: "16:9", likes: "2.6k", remixes: "932", model: "MiniMax H3", category: "Animation" },
];

export type Plan = {
  id: string; name: string; price: string; blurb: string; cta: string; featured?: boolean;
  credits: string; res: string; chars: string; extras: string[];
};
export const plans: Plan[] = [
  { id: "starter", name: "Starter", price: "$0", blurb: "Try the workflow before committing a channel to it.", cta: "Start free", credits: "100 credits to start", res: "720p", chars: "3 cast members", extras: ["Wan 3.0 and Seedance 2.0", "Watermark on exports", "Community support"] },
  { id: "creator", name: "Creator", price: "$29", blurb: "For a channel that publishes on a schedule.", cta: "Start 7-day trial", featured: true, credits: "1,500 credits / month", res: "1080p", chars: "Unlimited cast", extras: ["All five models", "Batch queue, up to 20 clips", "No watermark", "Priority rendering"] },
  { id: "studio", name: "Studio", price: "$149", blurb: "For teams running several channels at once.", cta: "Talk to us", credits: "8,000 credits / month", res: "4K", chars: "Unlimited cast", extras: ["Shared workspace, 5 seats", "Brand kits and shared sets", "API access", "Commercial licence and support"] },
];

export type FaqTopic = "cast" | "prompts" | "batch" | "credits" | "editor" | "api" | "about";
export const faqs: { topic: FaqTopic; q: string; a: string }[] = [
  { topic: "cast", q: "How do I keep the same character across clips?", a: "Save a reference image or any generated frame as cast. Add that cast member to a clip and the model is given their face, build and wardrobe as a reference, so episode 40 looks like episode 1. Models that work well from a reference image, like Seedance, are the best choice for a series." },
  { topic: "cast", q: "Can I use a photo of a real person as a character?", a: "Yes, if you have the right to their likeness. Upload up to six reference photos of the same person, and Roundhay builds a cast member from them. We don't allow likenesses of people who haven't agreed." },
  { topic: "prompts", q: "How should I write a prompt?", a: "Describe the shot like a script note: who is where, what they do, the light, the mood. Leave out the camera move (you pick that separately) and anything you can set once as cast or a set. Two or three sentences is plenty." },
  { topic: "prompts", q: "How do I ask for a camera move?", a: "You don't need to describe it. Choose a move from the list (dolly in, crane up, orbit, pan, handheld) and it is applied on top of your prompt. The same shot with a different move costs the same and takes seconds." },
  { topic: "batch", q: "Can I queue a whole week of episodes?", a: "Yes. Batch lets you write up to 20 prompts against the same cast and set, then renders them in order overnight. You can schedule each one to publish on a date." },
  { topic: "batch", q: "What happens if one clip in a batch fails?", a: "That clip is refunded and put back at the end of the queue, and the rest carry on. You get a note on the batch so you can check it in the morning." },
  { topic: "credits", q: "What is a credit worth?", a: "Credits are charged per second of footage, and the rate depends on the model. Wan 3.0 is 6 credits a second for drafts; Veo 3.1 is 40 a second for the top-quality final render. You see the exact cost before you press Generate." },
  { topic: "credits", q: "Are failed renders refunded?", a: "Always, automatically and in full. If a render fails, or comes back unusable because of an error on our side, the credits return to your balance within a minute." },
  { topic: "credits", q: "Who owns what I make?", a: "You do. Paid plans include a commercial licence. Starter clips carry a small watermark and are for personal use." },
  { topic: "editor", q: "What can I export?", a: "9:16 for Shorts, Reels and TikTok, 16:9 for YouTube, and 1:1 for feeds. Every clip can be reframed to the other shapes without regenerating it. MP4 on every plan; ProRes on Studio." },
  { topic: "editor", q: "Can I trim and add captions without leaving Roundhay?", a: "Yes. The editor trims, joins clips, adds captions from a script or an audio file, and reframes. Nothing in it uses credits, so cut as much as you like." },
  { topic: "api", q: "How do I get an API key?", a: "Keys are on the Studio plan. Open Settings, then API, and create one. Each key can be limited to a project, and webhooks tell your own system when a render is ready." },
  { topic: "api", q: "Can I publish straight to YouTube or TikTok?", a: "Yes. Connect an account once under Integrations, then set a publish date on any clip or batch episode. It posts at the time you chose, in the right shape for each platform." },
  { topic: "about", q: "Do you build your own video models?", a: "No. Roundhay brings leading models from Google, Kuaishou, ByteDance, Alibaba and MiniMax into one workspace, and adds the cast, camera moves and scheduling on top. You pick the model for each shot, and the credit cost is shown before you generate. Roundhay is an independent platform; model names belong to their makers." },
  { topic: "about", q: "Why is it called Roundhay?", a: "The Roundhay Garden Scene, shot in Leeds in October 1888 by Louis Le Prince, is the oldest surviving film. It lasts about two seconds. We figure everything since has been a reply." },
];

export const usageByDay = [42, 118, 96, 60, 148, 190, 84, 132, 70, 210, 156, 102, 88, 174];
export const usageBreakdown = [
  { label: "Text to video", credits: 294 },
  { label: "Image to video", credits: 186 },
  { label: "Re-rolls", credits: 118 },
  { label: "Upscales", credits: 60 },
];

export const activity = [
  { t: "09:41", text: "Ep. 14 finished rendering", href: "/library/c01" },
  { t: "09:38", text: "Mara Quill locked into Night Feed", href: "/library" },
  { t: "Yesterday", text: "12 spots queued for Kickscene Ads", href: "/batch" },
  { t: "Yesterday", text: "Kling 3.0 is now in your models", href: "/help" },
];

export const stats = { clipsThisWeek: 23, creditsLeft: 842, creditsTotal: 1500, queueDepth: 4 };
