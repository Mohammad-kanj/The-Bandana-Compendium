import { motion } from 'motion/react';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: 'card' | 'header' | 'line';
  delay?: number;
}

/**
 * Bidirectional scroll-reveal wrapper using an untransformed IntersectionObserver
 * target with hysteresis (enters at >= 8% or 48px visible, resets only when completely
 * off-screen). Prevents boundary flicker / infinite animation loops when ~10% is visible.
 */
export function ScrollReveal({
  children,
  className = '',
  variant = 'card',
  delay = 0,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio <= 0.005) {
            setIsVisible(false);
            continue;
          }

          const viewportH = window.innerHeight || 800;
          const visiblePx =
            Math.min(entry.boundingClientRect.bottom, viewportH) -
            Math.max(entry.boundingClientRect.top, 0);

          if (entry.intersectionRatio >= 0.07 || visiblePx >= 40) {
            setIsVisible(true);
          }
        }
      },
      {
        threshold: [0, 0.07, 0.15],
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenState =
    variant === 'line'
      ? { opacity: 0, scaleX: 0.86 }
      : variant === 'header'
        ? { opacity: 0, y: 24 }
        : { opacity: 0, y: 28, scale: 0.97 };

  const visibleState =
    variant === 'line'
      ? { opacity: 1, scaleX: 1 }
      : { opacity: 1, y: 0, scale: 1 };

  return (
    <div ref={containerRef} className={className}>
      <motion.div
        initial={false}
        animate={isVisible ? visibleState : hiddenState}
        transition={{
          duration: 0.58,
          delay: isVisible ? delay : 0,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={variant === 'line' ? 'origin-center' : 'h-full'}
      >
        {children}
      </motion.div>
    </div>
  );
}
