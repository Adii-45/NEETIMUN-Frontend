import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "@/components/layout/MobileNav";
import { navLinks } from "@/lib/data/nav-links";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream-100/90 backdrop-blur">
      <Container className="relative flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="NEETI MUN"
            width={44}
            height={44}
            className="h-11 w-11"
            priority
          />
          <span className="font-display text-lg tracking-wide text-navy-900">
            NEETI MUN
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy-900/80 transition-colors hover:text-navy-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/registration">Apply Now</Button>
        </div>

        <MobileNav links={navLinks} />
      </Container>
    </header>
  );
}
