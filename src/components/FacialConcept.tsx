"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ensureGsap, prefersReducedMotion } from "@/lib/scrollFx";

const concepts = [
  {
    label: "Perfil",
    pos: "top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-4 md:pb-6 items-center text-center",
  },
  {
    label: "Contorno",
    pos: "top-1/2 right-2 md:right-0 -translate-y-1/2 md:translate-x-full pl-1 md:pl-6 items-start text-left",
  },
  {
    label: "Proporção",
    pos: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-4 md:pt-6 items-center text-center",
  },
  {
    label: "Naturalidade",
    pos: "top-1/2 left-2 md:left-0 -translate-y-1/2 md:-translate-x-full pr-1 md:pr-6 items-end text-right",
  },
];

export default function FacialConcept() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<Array<HTMLDivElement | null>>([]);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();

    if (prefersReducedMotion()) {
      gsap.set(wordRefs.current, { autoAlpha: 1 });
      gsap.set(lineRefs.current, { scaleX: 1, scaleY: 1 });
      return;
    }

    gsap.set(wordRefs.current, { y: 10 });

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 900px)",
        isMobile: "(max-width: 899px)",
      },
      (context: gsap.Context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };

        if (isDesktop) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=2600",
              scrub: 0.8,
              pin: true,
            },
          });

          tl.fromTo(imageRef.current, { scale: 1.06 }, { scale: 1, duration: 1, ease: "none" });

          concepts.forEach((_, i) => {
            tl.to(
              wordRefs.current[i],
              { autoAlpha: 1, y: 0, duration: 1, ease: "none" },
              i === 0 ? 0.3 : "+=0.15",
            ).to(lineRefs.current[i], { scaleX: 1, scaleY: 1, duration: 0.6, ease: "none" }, "<");
          });

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }

        const words = wordRefs.current.filter((el): el is HTMLDivElement => el !== null);
        ScrollTrigger.batch(words, {
          start: "top 82%",
          onEnter: (els: Element[]) =>
            gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }),
        });
        gsap.set(lineRefs.current, { scaleX: 1, scaleY: 1 });

        return () => {};
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="harmonizacao"
      ref={sectionRef}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-ink py-28 text-cream md:min-h-screen md:py-0"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 top-4 hidden w-[300px] md:block lg:w-[360px]"
        style={{
          aspectRatio: "1024 / 1536",
          opacity: 0.5,
          maskImage:
            "radial-gradient(ellipse 72% 68% at 42% 40%, black 42%, transparent 88%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 72% 68% at 42% 40%, black 42%, transparent 88%)",
        }}
      >
        <Image src="/images/rosto-2.png" alt="" fill sizes="360px" className="object-cover" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 45%, color-mix(in srgb, var(--color-gold-dark) 35%, transparent) 0%, transparent 72%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <span className="mx-auto mb-14 block max-w-xl text-center text-xs uppercase tracking-[0.25em] text-gold-light/80 md:mb-20">
          02 &nbsp;/&nbsp; A linguagem da harmonização
        </span>

        <div className="relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-sm">
          <div ref={imageRef} className="relative h-full w-full overflow-hidden rounded-full">
            <Image
              src="/images/sculptural-3d.jpg"
              alt="Estudo conceitual de proporção facial"
              fill
              sizes="(min-width: 640px) 24rem, 280px"
              className="object-cover"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-gold/50" />

          {concepts.map((c, i) => (
            <div
              key={c.label}
              className={`pointer-events-none absolute flex w-24 flex-col sm:w-32 md:w-40 ${c.pos}`}
            >
              <div
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                className="flex flex-col"
                style={{ opacity: 0 }}
              >
                <span
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  className="mb-2 block h-px w-8 origin-left scale-x-0 bg-gold"
                />
                <span className="font-serif text-base text-cream sm:text-xl md:text-2xl">{c.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
