"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { whatsappLink } from "@/lib/site";
import { ensureGsap, horizontalSection, prefersReducedMotion } from "@/lib/scrollFx";
import MagneticButton from "./motion/MagneticButton";

const procedures = [
  {
    id: "harmonizacao-1",
    image: "/images/antes-depois-1.webp",
    title: "Equilíbrio Facial",
    description:
      "Equilíbrio, proporção e naturalidade para valorizar os traços únicos de cada paciente.",
  },
  {
    id: "harmonizacao-2",
    image: "/images/antes-depois-3.webp",
    title: "Rejuvenescimento Facial",
    description:
      "Suavização dos sinais do tempo, equilíbrio facial e rejuvenescimento com naturalidade.",
  },
  {
    id: "contorno",
    image: "/images/antes-depois-2.webp",
    title: "Contorno Facial",
    description:
      "Contornos mais definidos e proporções equilibradas para um perfil elegante e natural.",
  },
  {
    id: "labial",
    image: "/images/procedimento-labial.jpg",
    title: "Preenchimento Labial",
    description:
      "Volume na medida certa, contorno definido e harmonia para lábios naturalmente valorizados.",
  },
  {
    id: "perfiloplastia",
    image: "/images/procedimento-perfiloplastia.jpg",
    title: "Perfiloplastia",
    description:
      "Harmonia entre nariz, lábios e queixo para um perfil mais equilibrado e natural.",
  },
];

export default function Procedures() {
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileStripRef = useRef<HTMLDivElement>(null);
  const mobileCardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add("(min-width: 900px)", () => {
      const tween = horizontalSection(pinWrapRef.current, trackRef.current, { scrub: 0.6 });
      return () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const strip = mobileStripRef.current;
    const cards = mobileCardRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (!strip || !cards.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const active = entry.intersectionRatio > 0.62;
          entry.target.classList.toggle("scale-100", active);
          entry.target.classList.toggle("opacity-100", active);
          entry.target.classList.toggle("scale-[0.94]", !active);
          entry.target.classList.toggle("opacity-60", !active);
        });
      },
      { root: strip, threshold: [0, 0.62, 1] },
    );

    cards.forEach((card) => io.observe(card));
    return () => io.disconnect();
  }, []);

  return (
    <section id="procedimentos" className="bg-cream-dark">
      <div className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-dark">
          03 &nbsp;/&nbsp; Procedimentos
        </span>
        <h2 className="mt-4 max-w-lg font-serif text-4xl leading-[1.05] text-ink sm:text-5xl">
          Cada procedimento, uma decisão precisa
        </h2>
      </div>

      {/* Desktop: pinned horizontal scroll */}
      <div ref={pinWrapRef} className="relative mt-14 hidden h-screen overflow-hidden md:block">
        <div
          ref={trackRef}
          className="flex h-full items-center gap-10 pl-[8vw] will-change-transform"
        >
          {procedures.map((proc) => (
            <article key={proc.id} className="flex w-[70vw] shrink-0 items-center gap-10 lg:w-[46vw]">
              <div className="relative aspect-[3/4] w-2/5 shrink-0 overflow-hidden">
                <Image
                  src={proc.image}
                  alt={proc.title}
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-6xl text-ink/10">
                  {String(procedures.indexOf(proc) + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-serif text-3xl text-ink">{proc.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/65">
                  {proc.description}
                </p>
              </div>
            </article>
          ))}

          <div className="flex w-[60vw] shrink-0 flex-col items-start justify-center pr-[8vw] lg:w-[30vw]">
            <p className="max-w-xs text-ink/70">
              Cada avaliação é única. Vamos conversar sobre o que faz
              sentido para você.
            </p>
            <div className="mt-6">
              <MagneticButton
                href={whatsappLink("Olá! Quero saber mais sobre os procedimentos.")}
                external
                arrow
              >
                Falar no WhatsApp
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: swipeable horizontal strip */}
      <div className="mt-10 md:hidden">
        <p className="px-6 text-xs uppercase tracking-[0.2em] text-ink/40">
          Arraste para ver mais
        </p>
        <div
          ref={mobileStripRef}
          className="mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {procedures.map((proc, i) => (
            <article
              key={proc.id}
              className="w-[78vw] shrink-0 snap-start [scroll-snap-stop:always]"
            >
              <div
                ref={(el) => {
                  mobileCardRefs.current[i] = el;
                }}
                className="scale-[0.94] opacity-60 transition-[transform,opacity] duration-500 ease-out"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={proc.image}
                    alt={proc.title}
                    fill
                    sizes="80vw"
                    className="object-cover"
                  />
                </div>
                <span className="mt-3 block text-xs text-gold-dark">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-2xl text-ink">{proc.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/65">
                  {proc.description}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="px-6 pb-24">
          <MagneticButton
            href={whatsappLink("Olá! Quero saber mais sobre os procedimentos.")}
            external
            arrow
          >
            Falar no WhatsApp
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
