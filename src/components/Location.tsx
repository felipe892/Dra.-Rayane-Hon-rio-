"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";
import { ensureGsap, revealMask } from "@/lib/scrollFx";
import MagneticButton from "./motion/MagneticButton";

function PinIcon() {
  return (
    <span className="group/pin relative inline-flex h-9 w-9 items-center justify-center">
      <span className="absolute h-2 w-2 rounded-full bg-gold/40 group-hover/pin:[animation:pin-pulse_0.7s_ease-out]" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="relative h-6 w-6 text-gold-dark group-hover/pin:[animation:pin-bounce_0.5s_ease]"
      >
        <path
          d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </span>
  );
}

export default function Location() {
  const mapWrapRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      revealMask(mapWrapRef.current, {
        trigger: sectionRef.current,
        start: "top 70%",
        direction: "right",
      });
    });
    return () => ctx.revert();
  }, []);

  const mapQuery = encodeURIComponent(`${site.legalName}, ${site.address.full}`);

  return (
    <section id="localizacao" ref={sectionRef} className="bg-cream-dark py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-dark">
            04 &nbsp;/&nbsp; Localização
          </span>
          <h2 className="mt-4 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl">
            Venha nos visitar
          </h2>

          <div className="mt-8 flex items-start gap-3">
            <PinIcon />
            <div className="pt-1.5">
              <p className="text-ink/80">{site.address.full}</p>
              <p className="mt-1 text-ink/60">{site.phoneDisplay}</p>
            </div>
          </div>

          <div className="mt-9">
            <MagneticButton
              href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
              external
              variant="outline"
              arrow
            >
              Ver rotas no Google Maps
            </MagneticButton>
          </div>
        </div>

        <div
          ref={mapWrapRef}
          className="overflow-hidden shadow-[0_30px_60px_-30px_rgba(46,33,24,0.35)]"
        >
          <iframe
            title={`Mapa até ${site.legalName}`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            width="100%"
            height="420"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full grayscale-[15%]"
          />
        </div>
      </div>
    </section>
  );
}
