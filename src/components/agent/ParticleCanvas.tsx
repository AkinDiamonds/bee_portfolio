"use client";

import { useEffect, useRef } from "react";

interface ParticleCanvasProps {
  /** When true the burst plays; after it completes the canvas self-clears */
  trigger: boolean;
  /** Canvas dimensions should match the parent agent container */
  size: number;
  /** Colour stops for particle gradient (defaults to accent colours) */
  color1?: string;
  color2?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  hue: number;
}

export default function ParticleCanvas({
  trigger,
  size,
  color1 = "#6366f1",
  color2 = "#ec4899",
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;
    const PARTICLE_COUNT = 32;

    // Parse colour stops into HSL for interpolation
    const makeParticles = (): Particle[] =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.4;
        const speed = 1.4 + Math.random() * 2.2;
        return {
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 2 + Math.random() * 3,
          alpha: 1,
          decay: 0.018 + Math.random() * 0.014,
          hue: i / PARTICLE_COUNT, // 0–1, lerps between color1 and color2
        };
      });

    // Simple hex→rgb helper
    const hexRgb = (hex: string) => {
      const n = parseInt(hex.replace("#", ""), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
    };
    const rgb1 = hexRgb(color1);
    const rgb2 = hexRgb(color2);
    const lerpRgb = (t: number) =>
      `rgb(${Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t)},${Math.round(
        rgb1[1] + (rgb2[1] - rgb1[1]) * t
      )},${Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t)})`;

    let particles = makeParticles();

    const tick = () => {
      ctx.clearRect(0, 0, size, size);
      particles = particles.filter((p) => p.alpha > 0.01);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = lerpRgb(p.hue);
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gentle gravity
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.alpha -= p.decay;
        p.radius *= 0.985;
      }
      ctx.globalAlpha = 1;
      if (particles.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, size, size);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, size, size);
    };
  }, [trigger, size, color1, color2]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
}
