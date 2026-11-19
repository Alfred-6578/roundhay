import Link from "next/link";
import { Logo } from "@/components/logo";
import { Icon } from "@/components/icons";

// Stills that drift down the side panel (the same frames as the carousel on the home page).
const colA = [1, 4, 2, 6, 8, 3];
const colB = [5, 9, 7, 3, 1, 6];
const aspects = ["aspect-[5/6]", "aspect-[4/5]", "aspect-[5/6]"];

function Column({ ids, className }: { ids: number[]; className: string }) {
  const list = [...ids, ...ids];
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {list.map((n, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={`/media/rail/rail-${n}.jpg`} alt="" decoding="async" className={`w-full rounded-2xl object-cover ${aspects[i % 3]}`} />
      ))}
    </div>
  );
}

const proof = ["The same face in every shot", "Veo, Kling, Seedance and more in one place", "Failed renders refunded, automatically"];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-svh min-h-0 bg-paper p-3 text-ink lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden self-start overflow-hidden rounded-[36px] bg-night lg:sticky lg:top-3 lg:block lg:h-[calc(100svh-1.5rem)]">
        <div aria-hidden="true" className="absolute inset-0 flex justify-center gap-3 overflow-hidden px-6">
          <div className="-mt-10 w-[42%] max-w-[17rem] rotate-[5deg] scale-[1.12]"><Column ids={colA} className="auth-up" /></div>
          <div className="mt-24 w-[42%] max-w-[17rem] rotate-[5deg] scale-[1.12]"><Column ids={colB} className="auth-down" /></div>
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_30%,rgba(8,8,9,0.55)_80%),linear-gradient(to_top,rgba(8,8,9,0.95)_6%,rgba(8,8,9,0.55)_38%,transparent_62%,rgba(8,8,9,0.6))]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-9">
          <Link href="/"><Logo size={26} /></Link>
          <div>
            <p className="display max-w-md text-[clamp(2.8rem,4.4vw,4.2rem)] leading-[0.98] text-white">Cast once.<br />Shoot forever.</p>
            <ul className="mt-6 space-y-2.5 text-sm text-white/70">
              {proof.map((t) => (
                <li key={t} className="flex items-center gap-3"><span className="grid h-5 w-5 place-items-center rounded-full bg-safelight/25"><Icon name="check" size={11} className="text-safelight" /></span>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
      <div className="flex min-h-0 flex-col px-5 py-4 sm:px-12 sm:py-5">
        <Link href="/" className="lg:hidden"><Logo size={24} tone="ink" /></Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-3">{children}</div>
        <p className="pt-2 text-center text-xs text-ink/40 [@media(max-height:700px)]:hidden">By continuing you agree to the <Link href="/help" className="underline underline-offset-2 hover:text-ink">Terms</Link> and <Link href="/help" className="underline underline-offset-2 hover:text-ink">Privacy Policy</Link></p>
      </div>
    </div>
  );
}
