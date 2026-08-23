"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { site } from "@/lib/site";
import { revealWords, revealMask, ensureGsap } from "@/lib/scrollFx";
import ParallaxLayer from "./motion/ParallaxLayer";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const bigWordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      revealWords(headingRef.current, { trigger: sectionRef.current, start: "top 75%" });
      revealMask(photoWrapRef.current, { trigger: sectionRef.current, start: "top 70%" });
      gsap.fromTo(
        textRef.current,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        },
      );
      gsap.fromTo(
        bigWordRef.current,
        { xPercent: -6, autoAlpha: 0 },
        {
          xPercent: 0,
          autoAlpha: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="relative overflow-hidden bg-cream py-28 md:py-36"
    >
      <span
        ref={bigWordRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 -z-0 -translate-x-1/2 select-none whitespace-nowrap font-serif text-[22vw] leading-none text-ink/[0.04] md:top-10 md:text-[13vw]"
      >
        Identidade
      </span>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-12">
        <div className="md:col-span-5 md:col-start-1">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-dark">
            01 &nbsp;/&nbsp; Sobre a especialista
          </span>
          <h2
            ref={headingRef}
            className="mt-4 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl"
          >
            Técnica apurada, olhar de curadoria
          </h2>

          <div ref={textRef} className="mt-7 max-w-md">
            <p className="text-base leading-relaxed text-ink/70">
              À frente do {site.legalName}, ela une precisão técnica e
              sensibilidade estética para entregar resultados naturais em
              harmonização facial — respeitando as proporções únicas de
              cada paciente.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-ink/70">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
                Avaliação individualizada antes de cada procedimento
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
                Foco em resultados naturais e harmônicos
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
                Ambiente acolhedor e cuidado especializado
              </li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <ParallaxLayer speed={0.9}>
            <div
              ref={photoWrapRef}
              className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden md:max-w-none"
            >
              <Image
                src="/images/dra-rayane-portrait-1.jpg"
                alt={`${site.brandName}, especialista em harmonização facial`}
                fill
                sizes="(min-width: 768px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </ParallaxLayer>
        </div>
      </div>
    </section>
  );
}
