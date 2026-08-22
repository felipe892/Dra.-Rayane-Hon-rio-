"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";

export default function NavLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const lineRef = useRef<HTMLSpanElement>(null);

  function setOrigin(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const fromLeft = e.clientX - rect.left < rect.width / 2;
    if (lineRef.current) {
      lineRef.current.style.transformOrigin = fromLeft ? "left" : "right";
    }
  }

  return (
    <Link
      href={href}
      className={`group relative inline-block ${className}`}
      onMouseEnter={setOrigin}
      onMouseLeave={setOrigin}
    >
      {children}
      <span
        ref={lineRef}
        className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
    </Link>
  );
}
