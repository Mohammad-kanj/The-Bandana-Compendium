import { useEffect, useRef } from 'react';

interface SpiritOrb {
  x: number;
  y: number;
  vy: number;
  vx: number;
  radius: number;
  haloMultiplier: number;
  swayAmp: number;
  swaySpeed: number;
  phase: number;
  maxAlpha: number;
}

/**
 * Emits randomized, slowly rising cyan Spirit Orbs from the bottom of the viewport,
 * styled with a soft Sheikah radial glow for sub-page backgrounds.
 */
export function SpiritOrbParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const orbCount = 24;

    const createOrb = (spawnAtBottom: boolean): SpiritOrb => {
      const radius = 2.6 + Math.random() * 4.4;
      return {
        x: Math.random() * width,
        y: spawnAtBottom
          ? height + radius * 4 + Math.random() * 90
          : height * (0.25 + Math.random() * 0.8),
        vy: -(0.22 + Math.random() * 0.34),
        vx: (Math.random() - 0.5) * 0.08,
        radius,
        haloMultiplier: 3.6 + Math.random() * 1.6,
        swayAmp: 0.14 + Math.random() * 0.24,
        swaySpeed: 0.009 + Math.random() * 0.012,
        phase: Math.random() * Math.PI * 2,
        maxAlpha: 0.2 + Math.random() * 0.24,
      };
    };

    const orbs: SpiritOrb[] = Array.from({ length: orbCount }, () =>
      createOrb(false)
    );

    let rafId = 0;

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        orb.phase += orb.swaySpeed;
        orb.x += orb.vx + Math.sin(orb.phase) * orb.swayAmp;
        orb.y += orb.vy;

        const haloRadius = orb.radius * orb.haloMultiplier;

        // Respawn smoothly at the bottom edge once it drifts past the top
        if (orb.y < -haloRadius * 1.5) {
          orbs[i] = createOrb(true);
          continue;
        }

        if (orb.x > width + haloRadius) orb.x = -haloRadius;
        if (orb.x < -haloRadius) orb.x = width + haloRadius;

        // Smooth fade-in as it rises from the bottom & gradual dissolve toward top
        const normY = Math.min(1, Math.max(0, orb.y / Math.max(height, 1)));
        const bottomFade = normY > 0.84 ? Math.max(0, (1.02 - normY) / 0.18) : 1;
        const topFade = normY < 0.28 ? Math.max(0, normY / 0.28) : 1;
        const pulse = 0.84 + 0.16 * Math.sin(orb.phase * 1.7);

        const alpha = orb.maxAlpha * bottomFade * topFade * pulse;
        if (alpha < 0.01) continue;

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          haloRadius
        );
        gradient.addColorStop(0, `rgba(232, 252, 255, ${Math.min(0.85, alpha * 1.65)})`);
        gradient.addColorStop(0.22, `rgba(148, 244, 255, ${alpha * 0.95})`);
        gradient.addColorStop(0.55, `rgba(76, 228, 255, ${alpha * 0.34})`);
        gradient.addColorStop(1, 'rgba(76, 228, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, haloRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2] print:hidden"
    />
  );
}
