"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";

export default function TiltMedia({
  children,
  className,
  maxTilt = 8,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(el, {
      rotateY: px * maxTilt,
      rotateX: -py * maxTilt,
      duration: 0.6,
      ease: "power2.out",
      transformPerspective: 900,
    });
  }

  function handleMouseLeave() {
    const el = wrapRef.current;
    if (!el) return;
    gsap.to(el, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
