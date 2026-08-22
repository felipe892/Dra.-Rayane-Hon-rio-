"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { parallaxMedia } from "@/lib/scrollFx";

export default function ParallaxLayer({
  children,
  speed = 0.85,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tween = parallaxMedia(ref.current, { speed });
    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
