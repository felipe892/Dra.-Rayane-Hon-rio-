"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, prefersReducedMotion } from "@/lib/scrollFx";

export default function SectionTransition() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap } = ensureGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(dotRef.current, { autoAlpha: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        })
        .to(lineRef.current, { scaleY: 1, ease: "none" }, 0)
        .to(dotRef.current, { autoAlpha: 1, ease: "none" }, 0.75);
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="relative mx-auto h-28 w-px bg-transparent md:h-36">
      <div ref={lineRef} className="absolute inset-0 w-px bg-gold/60" />
      <div
        ref={dotRef}
        className="absolute -left-[3px] bottom-0 h-[7px] w-[7px] rounded-full bg-gold"
      />
    </div>
  );
}
