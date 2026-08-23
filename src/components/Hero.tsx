"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { whatsappLink } from "@/lib/site";
import { ensureGsap, revealImage, revealLine, revealWords } from "@/lib/scrollFx";
import MagneticButton from "./motion/MagneticButton";
import TiltMedia from "./TiltMedia";
import GoldDustCanvas from "./GoldDustCanvas";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const textColumnRef = useRef<HTMLDivElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const photoMediaRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const secondaryRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      revealImage(photoWrapRef.current, photoMediaRef.current, { duration: 0.9 });
      gsap.fromTo(
        logoRef.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.05, ease: "power2.out" },
      );
      gsap.fromTo(
        decorRef.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.25, ease: "power2.out" },
      );
      revealWords(headlineRef.current, { delay: 0.3, stagger: 0.045 });
      revealLine(lineRef.current, { duration: 0.7, delay: 0.55 });
      gsap.fromTo(
        secondaryRef.current,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.75, ease: "power3.out" },
      );
      gsap.fromTo(
        ctaRef.current,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.95, ease: "power3.out" },
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    const glow = glowRef.current;
    if (!el || !glow || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { gsap } = ensureGsap();
    const xTo = gsap.quickTo(glow, "x", { duration: 1.4, ease: "power2.out" });
    const yTo = gsap.quickTo(glow, "y", { duration: 1.4, ease: "power2.out" });

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    }

    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-gradient-to-b from-cream via-cream to-cream-dark"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-6 top-4 hidden w-[300px] md:block lg:w-[360px]"
        style={{
          aspectRatio: "1024 / 1536",
          opacity: 0.5,
          maskImage:
            "radial-gradient(ellipse 72% 68% at 58% 40%, black 42%, transparent 88%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 72% 68% at 58% 40%, black 42%, transparent 88%)",
        }}
      >
        <Image
          src="/images/fundo-rosto.png"
          alt=""
          fill
          priority
          sizes="360px"
          className="object-cover"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 35%, color-mix(in srgb, var(--color-gold-light) 22%, transparent) 0%, transparent 70%)",
        }}
      />

      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-gold-light) 45%, transparent) 0%, transparent 70%)",
        }}
      />

      <GoldDustCanvas
        sectionRef={sectionRef}
        faceRef={photoWrapRef}
        textRef={textColumnRef}
        ctaRef={ctaRef}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-28 pb-16 md:grid-cols-12 md:gap-4 md:pt-24">
        <div
          ref={textColumnRef}
          className="order-2 flex flex-col items-start md:order-1 md:col-span-5 md:pr-6"
        >
          <div ref={logoRef} className="mb-3 flex w-full justify-center">
            <Image
              src="/images/logo-gold.png"
              alt="Instituto de Estética Especializada Dra. Rayane Honório"
              width={200}
              height={200}
              unoptimized
              priority
              className="h-20 w-20 object-contain sm:h-24 sm:w-24"
            />
          </div>
          <h1
            ref={headlineRef}
            className="font-serif text-[13vw] leading-[0.95] text-ink sm:text-6xl md:text-[3.4vw] lg:text-[3.1vw]"
          >
            Harmonização Facial
          </h1>

          <svg width="120" height="2" className="mt-6" aria-hidden>
            <line
              ref={lineRef}
              x1="0"
              y1="1"
              x2="120"
              y2="1"
              stroke="var(--color-gold)"
              strokeWidth="1"
            />
          </svg>

          <p
            ref={secondaryRef}
            className="mt-6 max-w-sm text-sm uppercase tracking-[0.22em] text-ink/60"
          >
            Dra. Rayane Honório &middot; Brasília
          </p>

          <p className="mt-5 max-w-sm text-base leading-relaxed text-ink/70">
            Resultados naturais que valorizam a sua identidade — avaliação
            individualizada e precisão técnica em cada detalhe.
          </p>

          <div ref={ctaRef} className="mt-9">
            <MagneticButton
              href={whatsappLink("Olá! Gostaria de agendar uma avaliação.")}
              external
              arrow
            >
              Agendar avaliação
            </MagneticButton>
          </div>
        </div>

        <div className="order-1 md:order-2 md:col-span-7">
          <div className="relative mx-auto max-w-md md:ml-auto md:mr-0 md:max-w-none">
            <div
              className="pointer-events-none absolute inset-0 -z-0 scale-110 rounded-full opacity-70 blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse 60% 55% at 50% 45%, color-mix(in srgb, var(--color-gold-light) 40%, transparent) 0%, transparent 72%)",
              }}
              aria-hidden
            />
            <div
              ref={decorRef}
              className="pointer-events-none absolute -left-6 -top-6 hidden h-24 w-24 rounded-full border border-gold/30 md:block"
              aria-hidden
            />
            <TiltMedia maxTilt={3.5}>
              <div
                ref={photoWrapRef}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[0_18px_40px_-12px_rgba(201,162,39,0.55),0_4px_16px_-4px_rgba(150,115,26,0.4)] md:aspect-[4/5.1]"
              >
                <video
                  ref={photoMediaRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover [object-position:50%_25%]"
                >
                  <source src="/videos/dra-rayane.webm" type="video/webm" />
                  <source src="/videos/dra-rayane-cinemagraph.mp4" type="video/mp4" />
                </video>
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-ink/5" />
              </div>
            </TiltMedia>
          </div>
        </div>
      </div>
    </section>
  );
}
