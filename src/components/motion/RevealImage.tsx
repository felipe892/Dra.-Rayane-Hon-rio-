"use client";

import { useEffect, useRef } from "react";
import Image, { type ImageProps } from "next/image";
import { revealImage } from "@/lib/scrollFx";

export default function RevealImage({
  wrapperClassName,
  ...imgProps
}: ImageProps & { wrapperClassName?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    revealImage(wrapRef.current, mediaRef.current, {
      trigger: wrapRef.current,
    });
  }, []);

  return (
    <div ref={wrapRef} className={wrapperClassName} style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
      <div ref={mediaRef} className="h-full w-full">
        <Image {...imgProps} />
      </div>
    </div>
  );
}
