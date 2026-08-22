import { ensureGsap, prefersReducedMotion, gsap, ScrollTrigger } from "./gsapConfig";

type Direction = "up" | "down" | "left" | "right";

const clipFrom: Record<Direction, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/** Reveals an element through a clip-path wipe rather than opacity. Use for photographs, panels, dividers. */
export function revealMask(
  el: Element | null,
  opts: {
    trigger?: Element | null;
    start?: string;
    delay?: number;
    duration?: number;
    direction?: Direction;
    scrub?: boolean | number;
  } = {},
) {
  if (!el) return;
  const { gsap } = ensureGsap();
  if (prefersReducedMotion()) {
    gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" });
    return;
  }
  return gsap.fromTo(
    el,
    { clipPath: clipFrom[opts.direction ?? "up"] },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: opts.duration ?? 1.4,
      delay: opts.delay ?? 0,
      ease: "power4.inOut",
      scrollTrigger: opts.trigger
        ? {
            trigger: opts.trigger,
            start: opts.start ?? "top 78%",
            scrub: opts.scrub,
            toggleActions: opts.scrub ? undefined : "play none none none",
          }
        : undefined,
    },
  );
}

/** Splits a heading into per-word masked spans and reveals them with a soft stagger. Call once per element. */
export function revealWords(
  container: HTMLElement | null,
  opts: {
    trigger?: Element | null;
    start?: string;
    stagger?: number;
    delay?: number;
  } = {},
) {
  if (!container) return;
  const { gsap } = ensureGsap();

  if (!container.dataset.split) {
    const words = (container.textContent ?? "").trim().split(/\s+/);
    container.innerHTML = words
      .map(
        (w) =>
          `<span class="inline-block overflow-hidden align-top pb-[0.12em]"><span class="inline-block will-change-transform">${w}</span></span>`,
      )
      .join(" ");
    container.dataset.split = "true";
  }

  const inners = container.querySelectorAll<HTMLElement>(":scope > span > span");

  if (prefersReducedMotion()) {
    gsap.set(inners, { yPercent: 0, opacity: 1 });
    return;
  }

  return gsap.from(inners, {
    yPercent: 112,
    opacity: 0,
    duration: 0.95,
    ease: "power4.out",
    stagger: opts.stagger ?? 0.05,
    delay: opts.delay ?? 0,
    scrollTrigger: opts.trigger
      ? {
          trigger: opts.trigger,
          start: opts.start ?? "top 82%",
          toggleActions: "play none none none",
        }
      : undefined,
  });
}

/** Draws an SVG path/line progressively via stroke-dashoffset. */
export function revealLine(
  path: SVGPathElement | SVGLineElement | null,
  opts: {
    trigger?: Element | null;
    start?: string;
    duration?: number;
    delay?: number;
    scrub?: boolean | number;
  } = {},
) {
  if (!path) return;
  const { gsap } = ensureGsap();
  const length = path.getTotalLength();

  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

  if (prefersReducedMotion()) {
    gsap.set(path, { strokeDashoffset: 0 });
    return;
  }

  return gsap.to(path, {
    strokeDashoffset: 0,
    duration: opts.duration ?? 1.2,
    delay: opts.delay ?? 0,
    ease: "power2.inOut",
    scrollTrigger: opts.trigger
      ? {
          trigger: opts.trigger,
          start: opts.start ?? "top 75%",
          scrub: opts.scrub,
          toggleActions: opts.scrub ? undefined : "play none none none",
        }
      : undefined,
  });
}

/** Photograph entrance: container stays put, inner media scales down from 1.15 while a clip mask opens. */
export function revealImage(
  container: Element | null,
  media: Element | null,
  opts: { trigger?: Element | null; start?: string; duration?: number } = {},
) {
  if (!container || !media) return;
  const { gsap } = ensureGsap();

  if (prefersReducedMotion()) {
    gsap.set(container, { clipPath: "inset(0% 0% 0% 0%)" });
    gsap.set(media, { scale: 1 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: opts.trigger
      ? {
          trigger: opts.trigger,
          start: opts.start ?? "top 80%",
          toggleActions: "play none none none",
        }
      : undefined,
  });

  tl.fromTo(
    container,
    { clipPath: "inset(0% 0% 100% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: opts.duration ?? 1.3, ease: "power4.inOut" },
  ).fromTo(
    media,
    { scale: 1.18 },
    { scale: 1, duration: (opts.duration ?? 1.3) + 0.5, ease: "power3.out" },
    0,
  );

  return tl;
}

/** Scroll-scrubbed vertical drift. speed < 1 moves slower than scroll (background feel), speed > 1 faster (foreground feel). */
export function parallaxMedia(
  el: Element | null,
  opts: { trigger?: Element | null; speed?: number; scrub?: number | boolean } = {},
) {
  if (!el) return;
  const { gsap } = ensureGsap();
  if (prefersReducedMotion()) return;

  const speed = opts.speed ?? 0.85;
  const distance = 120 * (1 - speed);

  return gsap.fromTo(
    el,
    { y: -distance },
    {
      y: distance,
      ease: "none",
      scrollTrigger: {
        trigger: opts.trigger ?? el,
        start: "top bottom",
        end: "bottom top",
        scrub: opts.scrub ?? 1,
      },
    },
  );
}

/** Cursor-magnetic wrapper: element eases toward the pointer within a bounded radius, resets with a spring on leave. */
export function magneticButton(
  el: HTMLElement | null,
  opts: { strength?: number; textEl?: HTMLElement | null } = {},
) {
  if (!el) return () => {};
  const { gsap } = ensureGsap();
  if (prefersReducedMotion() || window.matchMedia("(hover: none)").matches) {
    return () => {};
  }

  const strength = opts.strength ?? 0.35;
  const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
  const textXTo = opts.textEl
    ? gsap.quickTo(opts.textEl, "x", { duration: 0.5, ease: "power3" })
    : null;
  const textYTo = opts.textEl
    ? gsap.quickTo(opts.textEl, "y", { duration: 0.5, ease: "power3" })
    : null;

  function onMove(e: MouseEvent) {
    const rect = el!.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    xTo(relX * strength);
    yTo(relY * strength);
    textXTo?.(relX * strength * 0.5);
    textYTo?.(relY * strength * 0.5);
  }

  function onLeave() {
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    if (opts.textEl) {
      gsap.to(opts.textEl, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    }
  }

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);

  return () => {
    el?.removeEventListener("mousemove", onMove);
    el?.removeEventListener("mouseleave", onLeave);
  };
}

/** Hover/inview stroke-draw for a small icon path. Fires once per trigger, not looping. */
export function drawIcon(
  path: SVGPathElement | null,
  opts: { on?: "hover" | "inview"; hoverTarget?: Element | null; duration?: number } = {},
) {
  if (!path) return () => {};
  const { gsap } = ensureGsap();
  const length = path.getTotalLength();
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: prefersReducedMotion() ? 0 : length });

  if (opts.on === "inview") {
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: opts.duration ?? 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: path, start: "top 90%", toggleActions: "play none none none" },
    });
    return () => {};
  }

  const target = opts.hoverTarget ?? path;
  function onEnter() {
    gsap.to(path, { strokeDashoffset: 0, duration: opts.duration ?? 0.5, ease: "power2.out" });
  }
  function onLeave() {
    gsap.to(path, { strokeDashoffset: length, duration: opts.duration ?? 0.4, ease: "power2.in" });
  }
  target.addEventListener("mouseenter", onEnter);
  target.addEventListener("mouseleave", onLeave);
  return () => {
    target.removeEventListener("mouseenter", onEnter);
    target.removeEventListener("mouseleave", onLeave);
  };
}

/** Pins a viewport-height track and translates its inner content horizontally as the user scrolls vertically. */
export function horizontalSection(
  pinWrapper: Element | null,
  track: HTMLElement | null,
  opts: { scrub?: number | boolean } = {},
) {
  if (!pinWrapper || !track) return;
  const { gsap, ScrollTrigger } = ensureGsap();
  if (prefersReducedMotion()) return;

  const distance = () => track.scrollWidth - track.parentElement!.clientWidth;

  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: pinWrapper,
      pin: true,
      scrub: opts.scrub ?? 1,
      start: "top top",
      end: () => `+=${distance()}`,
      invalidateOnRefresh: true,
    },
  });

  return tween;
}

export { ensureGsap, prefersReducedMotion, ScrollTrigger };
