import { useEffect, useRef } from 'react';

type WeatherState = 'breeze' | 'sunbreak' | 'fireflies' | 'drizzle';

interface WeatherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  phaseSpeed: number;
  rotation: number;
  rotSpeed: number;
  kind: 'spore' | 'firefly' | 'leaf' | 'rain';
  rippleLife: number;
}

interface AmbientWeatherProps {
  intensity?: 'vista' | 'subtle';
}

const WEATHER_CYCLE: WeatherState[] = [
  'breeze',
  'sunbreak',
  'fireflies',
  'drizzle',
];

export function AmbientWeather({ intensity = 'vista' }: AmbientWeatherProps) {
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

    const baseFactor = intensity === 'vista' ? 1 : 0.65;
    const leavesCount = Math.round(12 * baseFactor);
    const fireflyCount = Math.round(14 * baseFactor);
    const rainCount = Math.round(48 * baseFactor);

    const particles: WeatherParticle[] = [
      ...Array.from({ length: leavesCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0.52 + Math.random() * 0.55,
        vy: 0.28 + Math.random() * 0.36,
        size: 3.0 + Math.random() * 2.4,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.012 + Math.random() * 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.032,
        kind: 'leaf' as const,
        rippleLife: 0,
      })),
      ...Array.from({ length: fireflyCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: -0.15 + Math.random() * 0.38,
        vy: -0.22 + Math.random() * 0.24,
        size: 1.9 + Math.random() * 2.1,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.02 + Math.random() * 0.025,
        rotation: 0,
        rotSpeed: 0,
        kind: 'firefly' as const,
        rippleLife: 0,
      })),
      ...Array.from({ length: rainCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: -1.3 - Math.random() * 0.7,
        vy: 6.2 + Math.random() * 3.4,
        size: 10 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.03,
        rotation: 0,
        rotSpeed: 0,
        kind: 'rain' as const,
        rippleLife: 0,
      })),
    ];

    // Smoothly interpolated weather weights for organic transitions
    const weights: Record<WeatherState, number> = {
      breeze: 1,
      sunbreak: 0.25,
      fireflies: 0.35,
      drizzle: 0,
    };

    const startTime = performance.now();
    const PHASE_DURATION_MS = 22000;
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const cyclePos = Math.floor(elapsed / PHASE_DURATION_MS) % WEATHER_CYCLE.length;
      const scrollRatio = Math.min(
        1,
        window.scrollY / Math.max(window.innerHeight, 1)
      );

      // Blend target weather state + subtle scroll influence (more fireflies in Hero's Path valley)
      const activeWeather = WEATHER_CYCLE[cyclePos];
      const targets: Record<WeatherState, number> = {
        breeze: activeWeather === 'breeze' ? 1 : 0.25,
        sunbreak: activeWeather === 'sunbreak' ? 1 : 0.15,
        fireflies:
          (activeWeather === 'fireflies' ? 1 : 0.25) + scrollRatio * 0.45,
        drizzle: activeWeather === 'drizzle' ? 1 : 0,
      };

      (Object.keys(weights) as WeatherState[]).forEach((key) => {
        weights[key] += (targets[key] - weights[key]) * 0.014;
      });

      const windGust =
        1 +
        0.55 * weights.sunbreak +
        0.35 * Math.sin(elapsed * 0.00045);

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.phase += p.phaseSpeed;
        p.rotation += p.rotSpeed * windGust;

        if (p.kind === 'rain') {
          if (weights.drizzle < 0.03) continue;
          p.x += p.vx;
          p.y += p.vy;

          if (p.y > height + 10) {
            p.y = -20;
            p.x = Math.random() * (width + 120);
          }
          if (p.x < -30) {
            p.x = width + 20;
          }

          const rainAlpha = 0.22 * weights.drizzle * (intensity === 'vista' ? 1 : 0.7);
          ctx.strokeStyle = `rgba(166, 232, 255, ${rainAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 1.9, p.y + p.size);
          ctx.stroke();
          continue;
        }

        p.x += (p.vx * windGust) + Math.sin(p.phase * 0.7) * 0.24;
        p.y += p.vy + Math.cos(p.phase) * 0.16;

        if (p.x > width + 24) p.x = -24;
        if (p.x < -24) p.x = width + 24;
        if (p.y > height + 24) p.y = -24;
        if (p.y < -24) p.y = height + 24;

        const twinkle = 0.55 + 0.45 * Math.sin(p.phase * 1.4);

        if (p.kind === 'firefly') {
          const alpha =
            Math.min(0.75, 0.42 * weights.fireflies) *
            twinkle *
            (intensity === 'vista' ? 1 : 0.75);
          if (alpha < 0.02) continue;

          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          glow.addColorStop(0, `rgba(146, 245, 255, ${alpha})`);
          glow.addColorStop(0.45, `rgba(76, 228, 255, ${alpha * 0.36})`);
          glow.addColorStop(1, 'rgba(76, 228, 255, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === 'leaf') {
          const leafWeight = Math.max(weights.breeze, weights.sunbreak);
          const alpha =
            0.38 * leafWeight * twinkle * (intensity === 'vista' ? 1 : 0.68);
          if (alpha < 0.02) continue;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle =
            weights.sunbreak > 0.5
              ? `rgba(243, 214, 138, ${alpha})`
              : `rgba(182, 214, 128, ${alpha})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.35, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Warm golden meadow spores
          const sporeWeight = Math.max(weights.breeze, weights.sunbreak * 1.15);
          const alpha =
            0.36 * sporeWeight * twinkle * (intensity === 'vista' ? 1 : 0.65);
          if (alpha < 0.02) continue;

          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.8);
          glow.addColorStop(0, `rgba(255, 244, 212, ${alpha})`);
          glow.addColorStop(0.5, `rgba(243, 227, 180, ${alpha * 0.42})`);
          glow.addColorStop(1, 'rgba(243, 227, 180, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
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
      className="pointer-events-none absolute inset-0 z-[3] print:hidden"
    />
  );
}
