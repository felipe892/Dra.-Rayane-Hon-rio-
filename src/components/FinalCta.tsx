"use client";

import { useEffect, useRef } from "react";
import { whatsappLink } from "@/lib/site";
import { ensureGsap, revealWords, prefersReducedMotion } from "@/lib/scrollFx";
import MagneticButton from "./motion/MagneticButton";

export default function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      revealWords(headingRef.current, { trigger: sectionRef.current, start: "top 75%" });
    });

    if (prefersReducedMotion()) return () => ctx.revert();

    const xTo = gsap.quickTo(glowRef.current, "x", { duration: 0.9, ease: "power3" });
    const yTo = gsap.quickTo(glowRef.current, "y", { duration: 0.9, ease: "power3" });

    function onMove(e: MouseEvent) {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    }

    const el = sectionRef.current;
    el?.addEventListener("mousemove", onMove);
    return () => {
      el?.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-cream py-32 text-center"
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 -z-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 md:opacity-60"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-gold-light) 55%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-xl px-6">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-dark">
          06 &nbsp;/&nbsp; Agende sua avaliação
        </span>
        <h2
          ref={headingRef}
          className="mt-6 font-serif text-4xl leading-[1.08] text-ink sm:text-5xl"
        >
          Sua identidade, em sua melhor versão
        </h2>
        <p className="mx-auto mt-6 max-w-sm text-ink/65">
          Vamos conversar sobre o que faz sentido para você.
        </p>
        <div className="mt-10 inline-block">
          <MagneticButton
            href={whatsappLink("Olá! Gostaria de agendar uma avaliação.")}
            external
            arrow
          >
            Agendar avaliação no WhatsApp
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
