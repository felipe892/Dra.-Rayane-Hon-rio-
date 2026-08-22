"use client";

import { useEffect, useRef, type RefObject } from "react";
import { GoldDustField } from "@/lib/goldDust";
import { ensureGsap, prefersReducedMotion } from "@/lib/scrollFx";

function rectRelativeTo(el: HTMLElement | null, container: HTMLElement | null) {
  if (!el || !container) return null;
  const elRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    x: elRect.left - containerRect.left,
    y: elRect.top - containerRect.top,
    width: elRect.width,
    height: elRect.height,
  };
}

export default function GoldDustCanvas({
  sectionRef,
  faceRef,
  textRef,
  ctaRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  faceRef: RefObject<HTMLElement | null>;
  textRef: RefObject<HTMLElement | null>;
  ctaRef: RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const field = new GoldDustField(canvas, { reducedMotion: false, mobile });

    function measure() {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      field.resize(rect.width, rect.height);
      field.setExclusionRects(
        rectRelativeTo(faceRef.current, section),
        rectRelativeTo(textRef.current, section),
      );
      field.setCtaRect(rectRelativeTo(ctaRef.current, section));
    }

    measure();
    field.start();

    const ro = new ResizeObserver(measure);
    ro.observe(section);

    function onMouseMove(e: MouseEvent) {
      const rect = section!.getBoundingClientRect();
      field.setMouse(e.clientX - rect.left, e.clientY - rect.top);
    }
    function onMouseLeave() {
      field.setMouse(null, null);
    }

    if (!mobile) {
      section.addEventListener("mousemove", onMouseMove);
      section.addEventListener("mouseleave", onMouseLeave);
    }

    function onVisibilityChange() {
      if (document.hidden) field.stop();
      else field.start();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) field.start();
        else field.stop();
      },
      { threshold: 0.05 },
    );
    io.observe(section);

    const { gsap, ScrollTrigger } = ensureGsap();
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "center top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => field.setScrollProgress(self.progress),
    });

    return () => {
      section.removeEventListener("mousemove", onMouseMove);
      section.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      ro.disconnect();
      io.disconnect();
      trigger.kill();
      field.destroy();
      void gsap;
    };
  }, [sectionRef, faceRef, textRef, ctaRef]);

  if (prefersReducedMotion()) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
