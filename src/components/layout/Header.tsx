import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavLinks } from "@/components/layout/NavLinks";
import { Magnetic } from "@/components/ui/motion";
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

        <NavLinks links={navLinks} />

        <div className="hidden lg:block">
          <Magnetic range={3}>
            <Button href="/registration">Apply Now</Button>
          </Magnetic>
        </div>

        <MobileNav links={navLinks} />
      </Container>
    </header>
  );
}
