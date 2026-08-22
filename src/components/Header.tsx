import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import NavLink from "./motion/NavLink";
import MagneticButton from "./motion/MagneticButton";

const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#procedimentos", label: "Procedimentos" },
  { href: "#localizacao", label: "Localização" },
];

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-ink">
        <Link href="#top" className="font-serif text-base tracking-wide">
          {site.brandName}
        </Link>

        <ul className="hidden items-center gap-9 text-[13px] font-medium uppercase tracking-[0.14em] md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href}>{link.label}</NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <MagneticButton
            href={whatsappLink("Olá! Gostaria de agendar uma avaliação.")}
            external
            variant="outline"
            className="px-6 py-2.5 text-[13px]"
          >
            Agendar
          </MagneticButton>
        </div>
      </nav>
    </header>
  );
}
