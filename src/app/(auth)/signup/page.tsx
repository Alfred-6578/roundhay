import Link from "next/link";
import { Icon } from "@/components/icons";
import { Or, PasswordField, SocialRow, TextField } from "@/components/auth-bits";

export default function SignupPage() {
  return (
    <>
      <h1 className="display text-[2.4rem] leading-[1] sm:text-5xl">Start shooting</h1>
      <p className="mt-2.5 text-ink/60 [@media(max-height:700px)]:hidden">100 free credits and no card, enough to try a few clips properly.</p>
      <div className="mt-5"><SocialRow /></div>
      <Or />
      <form action="/onboarding" className="space-y-3.5">
        <TextField label="Channel or studio" type="text" autoComplete="organization" placeholder="Night Feed" />
        <TextField label="Email" type="email" autoComplete="email" placeholder="you@channel.com" />
        <PasswordField meter autoComplete="new-password" placeholder="At least 8 characters" />
        <button type="submit" className="btn btn-ink w-full py-3.5">Create account <Icon name="arrow" size={15} /></button>
      </form>
      <p className="mt-4 text-center text-sm text-ink/55">Already have one? <Link href="/login" className="font-semibold text-ink underline underline-offset-4">Log in</Link></p>
    </>
  );
}
