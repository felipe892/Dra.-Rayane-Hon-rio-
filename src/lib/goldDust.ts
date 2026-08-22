type Layer = 0 | 1 | 2; // 0 = background, 1 = midground, 2 = foreground

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  layer: Layer;
  size: number;
  baseOpacity: number;
  colorIndex: number;
  phaseX: number;
  phaseY: number;
  freqX: number;
  freqY: number;
  ampX: number;
  ampY: number;
  offsetX: number;
  offsetY: number;
  targetOffsetX: number;
  targetOffsetY: number;
  glowStart: number | null;
  glowDuration: number;
}

const COLORS = ["201,162,39", "236,200,102", "150,115,26"];

const LAYER_CONFIG = {
  0: { sizeMin: 0.6, sizeMax: 1.3, opacityMin: 0.1, opacityMax: 0.22, ampMin: 3, ampMax: 7, blur: 1.6, parallax: 0.12, scrollSpeed: 8, repel: false },
  1: { sizeMin: 1.0, sizeMax: 2.1, opacityMin: 0.3, opacityMax: 0.5, ampMin: 5, ampMax: 12, blur: 0, parallax: 0.4, scrollSpeed: 60, repel: true },
  2: { sizeMin: 1.9, sizeMax: 3.4, opacityMin: 0.36, opacityMax: 0.56, ampMin: 8, ampMax: 16, blur: 1.1, parallax: 0.7, scrollSpeed: 130, repel: true },
} as const;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Smooth 0..1 falloff: 1 at rect center, fading to 0 past the padded edge. */
function exclusionWeight(x: number, y: number, rect: Rect | null, pad: number) {
  if (!rect) return 1;
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const halfW = rect.width / 2 + pad;
  const halfH = rect.height / 2 + pad;
  const dx = Math.abs(x - cx) / halfW;
  const dy = Math.abs(y - cy) / halfH;
  const d = Math.max(dx, dy);
  if (d >= 1) return 1;
  return lerp(0.12, 1, Math.min(1, d));
}

/** Pre-renders a soft blurred dot once, so per-frame draws are a cheap drawImage instead of a live filter. */
function buildSprite(refSize: number, blur: number, color: string): { canvas: HTMLCanvasElement; refSize: number } {
  const pad = blur * 3 + 2;
  const dim = Math.ceil(refSize * 2 + pad * 2);
  const off = document.createElement("canvas");
  off.width = dim;
  off.height = dim;
  const octx = off.getContext("2d")!;
  octx.filter = blur > 0 ? `blur(${blur}px)` : "none";
  octx.fillStyle = `rgba(${color},1)`;
  octx.beginPath();
  octx.arc(dim / 2, dim / 2, refSize, 0, Math.PI * 2);
  octx.fill();
  return { canvas: off, refSize };
}

export class GoldDustField {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private particles: Particle[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private rafId: number | null = null;
  private running = false;
  private reducedMotion: boolean;
  private mobile: boolean;

  private mouseX = 0;
  private mouseY = 0;
  private hasMouse = false;
  private parallaxX = { 0: 0, 1: 0, 2: 0 } as Record<Layer, number>;
  private parallaxY = { 0: 0, 1: 0, 2: 0 } as Record<Layer, number>;
  private scrollProgress = 0;

  private faceRect: Rect | null = null;
  private textRect: Rect | null = null;
  private ctaRect: Rect | null = null;

  private lastTime = 0;
  private sprites = new Map<string, { canvas: HTMLCanvasElement; refSize: number }>();

  constructor(canvas: HTMLCanvasElement, opts: { reducedMotion: boolean; mobile: boolean }) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D not supported");
    this.ctx = ctx;
    this.reducedMotion = opts.reducedMotion;
    this.mobile = opts.mobile;
    this.buildSprites();
  }

  private buildSprites() {
    ([0, 2] as Layer[]).forEach((layer) => {
      const cfg = LAYER_CONFIG[layer];
      const refSize = (cfg.sizeMin + cfg.sizeMax) / 2;
      COLORS.forEach((color, i) => {
        this.sprites.set(`${layer}-${i}`, buildSprite(refSize, cfg.blur, color));
      });
    });
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.seed();
  }

  setExclusionRects(face: Rect | null, text: Rect | null) {
    this.faceRect = face;
    this.textRect = text;
  }

  setCtaRect(rect: Rect | null) {
    this.ctaRect = rect;
  }

  setMouse(x: number | null, y: number | null) {
    if (x === null || y === null) {
      this.hasMouse = false;
      return;
    }
    this.mouseX = x;
    this.mouseY = y;
    this.hasMouse = true;
  }

  setScrollProgress(p: number) {
    this.scrollProgress = Math.min(1, Math.max(0, p));
  }

  private seed() {
    const area = this.width * this.height;
    const areaFactor = Math.min(1.3, Math.max(0.4, area / (1440 * 800)));
    const mobileFactor = this.mobile ? 0.5 : 1;
    const counts: Record<Layer, number> = {
      0: Math.round(55 * areaFactor * mobileFactor),
      1: Math.round(70 * areaFactor * mobileFactor),
      2: Math.round(18 * areaFactor * mobileFactor),
    };

    const particles: Particle[] = [];
    (Object.keys(counts) as unknown as Layer[]).forEach((layerKey) => {
      const layer = Number(layerKey) as Layer;
      const cfg = LAYER_CONFIG[layer];
      const count = counts[layer];
      for (let i = 0; i < count; i++) {
        let x = 0;
        let y = 0;
        for (let attempt = 0; attempt < 6; attempt++) {
          x = rand(0, this.width);
          y = rand(0, this.height);
          const edgeBoost = x < this.width * 0.15 || x > this.width * 0.85 ? 1.25 : 1;
          const w =
            exclusionWeight(x, y, this.faceRect, 40) *
            exclusionWeight(x, y, this.textRect, 30) *
            edgeBoost;
          if (Math.random() < Math.min(1, w)) break;
        }

        particles.push({
          x,
          y,
          vx: rand(-1, 1) * 0.02,
          vy: rand(-1, 1) * 0.015,
          layer,
          size: rand(cfg.sizeMin, cfg.sizeMax),
          baseOpacity: rand(cfg.opacityMin, cfg.opacityMax),
          colorIndex: Math.floor(Math.random() * COLORS.length),
          phaseX: rand(0, Math.PI * 2),
          phaseY: rand(0, Math.PI * 2),
          freqX: rand(0.05, 0.12),
          freqY: rand(0.04, 0.1),
          ampX: rand(cfg.ampMin, cfg.ampMax),
          ampY: rand(cfg.ampMin, cfg.ampMax),
          offsetX: 0,
          offsetY: 0,
          targetOffsetX: 0,
          targetOffsetY: 0,
          glowStart: null,
          glowDuration: rand(1200, 2200),
        });
      }
    });

    this.particles = particles;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    const loop = (t: number) => {
      if (!this.running) return;
      const dt = Math.min(48, t - this.lastTime);
      this.lastTime = t;
      this.update(t, dt);
      this.draw();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  destroy() {
    this.stop();
    this.particles = [];
    this.sprites.clear();
  }

  private update(now: number, dt: number) {
    (["0", "1", "2"] as const).forEach((k) => {
      const layer = Number(k) as Layer;
      const cfg = LAYER_CONFIG[layer];
      const targetX = this.hasMouse && !this.reducedMotion && !this.mobile
        ? -((this.mouseX / this.width - 0.5) * 2) * cfg.parallax * 22
        : 0;
      const targetY = this.hasMouse && !this.reducedMotion && !this.mobile
        ? -((this.mouseY / this.height - 0.5) * 2) * cfg.parallax * 22
        : 0;
      this.parallaxX[layer] = lerp(this.parallaxX[layer], targetX, 0.045);
      this.parallaxY[layer] = lerp(this.parallaxY[layer], targetY, 0.045);
    });

    const repelRadius = Math.min(140, Math.max(80, this.width * 0.09));
    const ctaCenter = this.ctaRect
      ? { x: this.ctaRect.x + this.ctaRect.width / 2, y: this.ctaRect.y + this.ctaRect.height / 2 }
      : null;
    const ctaActive =
      !this.mobile && ctaCenter && this.hasMouse
        ? Math.hypot(this.mouseX - ctaCenter.x, this.mouseY - ctaCenter.y) < 160
        : false;

    for (const p of this.particles) {
      const cfg = LAYER_CONFIG[p.layer];

      p.x += p.vx * dt * 0.06;
      p.y += p.vy * dt * 0.06;
      if (p.x < -20) p.x = this.width + 20;
      if (p.x > this.width + 20) p.x = -20;
      if (p.y < -20) p.y = this.height + 20;
      if (p.y > this.height + 20) p.y = -20;

      p.targetOffsetX = 0;
      p.targetOffsetY = 0;

      if (cfg.repel && this.hasMouse && !this.mobile && !this.reducedMotion) {
        const dx = p.x - this.mouseX;
        const dy = p.y - this.mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < repelRadius && dist > 0.01) {
          const force = (1 - dist / repelRadius) ** 2 * 26;
          p.targetOffsetX += (dx / dist) * force;
          p.targetOffsetY += (dy / dist) * force;
        }

        if (ctaActive && ctaCenter) {
          const cdx = ctaCenter.x - p.x;
          const cdy = ctaCenter.y - p.y;
          const cdist = Math.hypot(cdx, cdy);
          if (cdist < 190 && cdist > 20 && Math.round(p.x) % 3 === 0) {
            const pull = (1 - cdist / 190) * 10;
            p.targetOffsetX += (cdx / cdist) * pull;
            p.targetOffsetY += (cdy / cdist) * pull;
          }
        }
      }

      p.offsetX = lerp(p.offsetX, p.targetOffsetX, 0.08);
      p.offsetY = lerp(p.offsetY, p.targetOffsetY, 0.08);

      if (!this.reducedMotion && !p.glowStart && Math.random() < 0.00025 * dt) {
        p.glowStart = now;
      }
    }
  }

  private draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const now = performance.now();
    const scrollFade = 1 - this.scrollProgress;

    for (const p of this.particles) {
      const cfg = LAYER_CONFIG[p.layer];

      const drift =
        Math.sin(now * 0.001 * p.freqX + p.phaseX) * p.ampX * 0.5 +
        Math.sin(now * 0.0007 * p.freqY + p.phaseY) * p.ampY * 0.3;
      const driftY = Math.cos(now * 0.0009 * p.freqY + p.phaseY) * p.ampY * 0.5;

      const scrollY = -this.scrollProgress * cfg.scrollSpeed;

      const x = p.x + this.parallaxX[p.layer] + p.offsetX + drift;
      const y = p.y + this.parallaxY[p.layer] + p.offsetY + driftY + scrollY;

      let opacity = p.baseOpacity * scrollFade;
      let size = p.size;

      if (p.glowStart !== null) {
        const elapsed = now - p.glowStart;
        if (elapsed > p.glowDuration) {
          p.glowStart = null;
        } else {
          const glow = Math.sin((elapsed / p.glowDuration) * Math.PI);
          opacity = Math.min(0.85, opacity + glow * 0.45);
          size = p.size * (1 + glow * 1.6);
        }
      }

      if (opacity <= 0.01) continue;

      if (cfg.blur > 0) {
        const sprite = this.sprites.get(`${p.layer}-${p.colorIndex}`);
        if (!sprite) continue;
        const scale = size / sprite.refSize;
        const dim = sprite.canvas.width * scale;
        ctx.globalAlpha = opacity;
        ctx.drawImage(sprite.canvas, x - dim / 2, y - dim / 2, dim, dim);
      } else {
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${COLORS[p.colorIndex]}, ${opacity})`;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }
}
