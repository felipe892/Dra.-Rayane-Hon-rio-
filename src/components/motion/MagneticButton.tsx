"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { magneticButton } from "@/lib/scrollFx";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  external?: boolean;
  className?: string;
  arrow?: boolean;
};

export default function MagneticButton({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
  arrow = false,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cleanup = magneticButton(wrapRef.current, {
      strength: 0.3,
      textEl: textRef.current,
    });
    return cleanup;
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${mx}%`);
    e.currentTarget.style.setProperty("--my", `${my}%`);
  }

  const base =
    "group relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300";
  const solid = "bg-gold text-cream hover:text-ink";
  const outline = "border border-ink/25 text-ink hover:border-gold";
  const classes = `${base} ${variant === "solid" ? solid : outline} ${className}`;
  const style = { "--mx": "50%", "--my": "50%" } as React.CSSProperties;

  const inner = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            variant === "solid"
              ? "radial-gradient(circle at var(--mx) var(--my), var(--color-gold-light) 0%, var(--color-gold) 70%)"
              : "radial-gradient(circle at var(--mx) var(--my), color-mix(in srgb, var(--color-gold-light) 35%, transparent) 0%, transparent 70%)",
        }}
      />
      <span ref={textRef} className="relative flex items-center gap-2.5">
        {children}
        {arrow && (
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="shrink-0">
            <line
              x1="0"
              y1="5"
              x2="10"
              y2="5"
              stroke="currentColor"
              strokeWidth="1.4"
              className="origin-left scale-x-75 transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
            <path
              d="M8 1L13 5L8 9"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
            />
          </svg>
        )}
      </span>
    </>
  );

  return (
    <div ref={wrapRef} className="inline-block will-change-transform">
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onMouseMove={handleMouseMove}
          className={classes}
          style={style}
        >
          {inner}
        </a>
      ) : (
        <Link href={href} onMouseMove={handleMouseMove} className={classes} style={style}>
          {inner}
        </Link>
      )}
    </div>
  );
}
