import Link from "next/link";
import { Logo } from "@/components/logo";
import { MediaSlot } from "@/components/media-slot";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-end overflow-hidden bg-night p-6 sm:p-12">
      <div className="absolute inset-0"><MediaSlot slot="404" fallback="door" playing /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
      <Link href="/" className="absolute left-6 top-6 z-10 sm:left-12 sm:top-10"><Logo size={26} /></Link>
      <div className="relative z-10 text-white">
        <h1 className="display text-[clamp(3rem,10vw,9rem)]">That reel<br />is empty.</h1>
        <p className="mt-5 max-w-sm text-white/75">The page you wanted was cut in the edit, or never shot.</p>
        <Link href="/" className="btn btn-light mt-7 px-7 py-4">Back to the start</Link>
      </div>
    </div>
  );
}
