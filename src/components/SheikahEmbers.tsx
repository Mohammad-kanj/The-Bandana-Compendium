import { useEffect, useRef } from 'react';

interface EmberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  phaseSpeed: number;
  flavor: 'warm-ember' | 'sheikah-dust';
  baseAlpha: number;
}

interface SheikahEmbersProps {
  intensity?: 'vista' | 'subtle';
}

export function SheikahEmbers({ intensity = 'vista' }: SheikahEmbersProps) {
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

    const count = intensity === 'vista' ? 54 : 34;

    const spawnY = () => {
      // Bias slightly toward the upper half so embers intensify near the top
      return Math.pow(Math.random(), 1.38) * height;
    };

    const particles: EmberParticle[] = Array.from({ length: count }, (_, idx) => {
      const y = spawnY();
      const isUpper = y < height * 0.52;
      const flavor: EmberParticle['flavor'] =
        isUpper && idx % 3 !== 0
          ? 'warm-ember'
          : idx % 2 === 0
            ? 'warm-ember'
            : 'sheikah-dust';

      return {
        x: Math.random() * width,
        y,
        vx: -0.06 + Math.random() * 0.24,
        vy: -(0.14 + Math.random() * 0.28),
        radius:
          flavor === 'warm-ember'
            ? 1.1 + Math.random() * 1.5
            : 1.0 + Math.random() * 1.3,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.015 + Math.random() * 0.022,
        flavor,
        baseAlpha: 0.24 + Math.random() * 0.24,
      };
    });

    let rafId = 0;

    const tick = () => {
      const scrollRatio = Math.min(
        1,
        window.scrollY / Math.max(window.innerHeight * 1.8, 1)
      );
      // Warm glow intensifies when near top of page & upper viewport
      const pageTopBoost = 1 - scrollRatio * 0.42;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.phase += p.phaseSpeed;
        p.x += p.vx + Math.sin(p.phase * 0.85) * 0.16;
        p.y += p.vy + Math.cos(p.phase * 0.6) * 0.05;

        if (p.y < -18) {
          // Respawn weighted across viewport height, favoring top/mid
          p.y = height * (0.55 + Math.random() * 0.48);
          p.x = Math.random() * width;
        }
        if (p.x > width + 18) p.x = -18;
        if (p.x < -18) p.x = width + 18;

        const verticalPos = Math.min(1, Math.max(0, p.y / Math.max(height, 1)));
        // Stronger illumination near the top of the screen
        const topBias = 0.42 + 0.68 * Math.pow(1 - verticalPos, 1.25);
        const twinkle = 0.52 + 0.48 * Math.sin(p.phase * 1.35);

        const alpha =
          p.baseAlpha *
          topBias *
          pageTopBoost *
          twinkle *
          (intensity === 'vista' ? 1 : 0.68);

        if (alpha < 0.015) continue;

        const glowRadius = p.radius * (p.flavor === 'warm-ember' ? 4.2 : 4.6);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);

        if (p.flavor === 'warm-ember') {
          // Subtle sunlit warm nature ember
          grad.addColorStop(0, `rgba(255, 245, 214, ${Math.min(0.65, alpha * 1.2)})`);
          grad.addColorStop(0.38, `rgba(243, 219, 156, ${alpha * 0.48})`);
          grad.addColorStop(1, 'rgba(243, 219, 156, 0)');
        } else {
          // Faint ancient Sheikah cyan dust mote
          grad.addColorStop(0, `rgba(210, 250, 255, ${Math.min(0.6, alpha * 1.1)})`);
          grad.addColorStop(0.42, `rgba(76, 228, 255, ${alpha * 0.42})`);
          grad.addColorStop(1, 'rgba(76, 228, 255, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] print:hidden"
    />
  );
}
