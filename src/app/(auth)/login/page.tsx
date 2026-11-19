import Link from "next/link";
import { Or, PasswordField, SocialRow, TextField } from "@/components/auth-bits";

export default function LoginPage() {
  return (
    <>
      <h1 className="display text-[2.4rem] leading-[1] sm:text-5xl">Welcome back</h1>
      <p className="mt-2.5 text-ink/60 [@media(max-height:700px)]:hidden">Your cast and sets are where you left them.</p>
      <div className="mt-5"><SocialRow /></div>
      <Or />
      <form action="/dashboard" className="space-y-3.5">
        <TextField label="Email" type="email" autoComplete="email" placeholder="you@channel.com" />
        <PasswordField autoComplete="current-password" placeholder="Your password" aside={<Link href="/help" className="text-xs text-ink/55 hover:text-ink">Forgot?</Link>} />
        <button type="submit" className="btn btn-ink w-full py-3.5">Log in</button>
      </form>
      <p className="mt-4 text-center text-sm text-ink/55">New here? <Link href="/signup" className="font-semibold text-ink underline underline-offset-4">Make an account</Link></p>
    </>
  );
}
