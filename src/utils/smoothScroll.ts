let activeRafId: number | null = null;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Smoothly and unhurriedly glides the viewport to a target element by ID.
 * Cancels immediately if the user manually scrolls with wheel, touch, or keys.
 */
export function smoothScrollToId(targetId: string, durationMs = 1350): void {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(targetId);
  if (!el) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
    return;
  }

  if (activeRafId !== null) {
    window.cancelAnimationFrame(activeRafId);
    activeRafId = null;
  }

  const startY = window.scrollY;
  const targetRect = el.getBoundingClientRect();
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const destinationY = Math.min(maxScroll, Math.max(0, startY + targetRect.top));
  const distance = destinationY - startY;

  if (Math.abs(distance) < 4) return;

  const startTime = performance.now();

  const cancel = () => {
    if (activeRafId !== null) {
      window.cancelAnimationFrame(activeRafId);
      activeRafId = null;
    }
    cleanupListeners();
  };

  const cleanupListeners = () => {
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
  };

  window.addEventListener('wheel', cancel, { passive: true, once: true });
  window.addEventListener('touchstart', cancel, { passive: true, once: true });

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / durationMs);
    const eased = easeInOutCubic(progress);

    window.scrollTo({ top: startY + distance * eased, behavior: 'auto' });

    if (progress < 1) {
      activeRafId = window.requestAnimationFrame(step);
    } else {
      activeRafId = null;
      cleanupListeners();
    }
  };

  activeRafId = window.requestAnimationFrame(step);
}
