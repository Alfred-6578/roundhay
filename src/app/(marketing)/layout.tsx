import Link from "next/link";
import { Icon } from "@/components/icons";
import { MobileMenu } from "@/components/mobile-menu";
import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";

const navLinks = [
  { href: "/explore", label: "Explore", note: "Clips made on Roundhay" },
  { href: "/models", label: "Models", note: "Veo, Kling, Seedance and more" },
  { href: "/pricing", label: "Pricing", note: "Pay for the seconds you shoot" },
  { href: "/help", label: "Help", note: "Guides and answers" },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="sticky top-0 z-50 bg-[#f8f6f1]/85 text-ink backdrop-blur-md">
        <div className="mx-auto grid max-w-[1500px] grid-cols-[auto_1fr_auto] items-center gap-2 px-4 min-[340px]:px-5 sm:gap-6 py-4 sm:px-8 lg:px-12">
          <Link href="/" aria-label="Roundhay home"><Logo size={28} tone="ink" /></Link>
          <nav aria-label="Main" className="hidden items-center justify-center gap-9 md:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-ink/60 transition-colors hover:text-ink">{l.label}</Link>
            ))}
          </nav>
          <div className="col-start-3 flex items-center gap-2 justify-self-end">
            <Link href="/login" className="btn btn-sm hidden text-ink/65 hover:text-ink sm:inline-flex">Log in</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">Get started <Icon name="arrow" size={14} className="max-[340px]:hidden" /></Link>
            <MobileMenu items={navLinks} />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter />
    </div>
  );
}
