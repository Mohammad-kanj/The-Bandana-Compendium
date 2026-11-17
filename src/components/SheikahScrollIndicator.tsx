import { useEffect, useRef, useState } from 'react';

export function SheikahScrollIndicator() {
  const [progress, setProgress] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const updateScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 12) {
        setIsScrollable(false);
        setProgress(0);
        return;
      }
      setIsScrollable(true);
      const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      setProgress(ratio);
      setIsScrolling(true);

      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 900);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    const resizeObserver = new ResizeObserver(updateScroll);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      resizeObserver.disconnect();
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (event.clientY - rect.top) / Math.max(rect.height, 1))
    );
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
      window.scrollTo({ top: ratio * maxScroll, behavior: 'smooth' });
    }
  };

  if (!isScrollable) return null;

  const percent = Math.round(progress * 100);

  return (
    <aside
      aria-label="Page scroll progress"
      className={`fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-center gap-2 transition-opacity duration-300 print:hidden ${
        isScrolling ? 'opacity-100' : 'opacity-65 hover:opacity-100'
      }`}
    >
      {/* Top Sheikah Micro-Node */}
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rotate-45 border border-[#4CE4FF]/70 bg-[#08121B]"
      />

      {/* Interactive Glowing Sheikah-Blue Vertical Rail */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Scroll position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        onClick={handleTrackClick}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            window.scrollBy({ top: 180, behavior: 'smooth' });
          } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            window.scrollBy({ top: -180, behavior: 'smooth' });
          }
        }}
        className="relative w-4 h-44 flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4CE4FF] rounded-full"
      >
        <div className="relative w-[3px] h-full rounded-full bg-[#4CE4FF]/18 overflow-visible">
          {/* Glowing Cyan Progress Fill */}
          <div
            className="w-full rounded-full bg-gradient-to-b from-[#9AF0FF] to-[#4CE4FF] shadow-[0_0_12px_rgba(76,228,255,0.85)] transition-[height] duration-75"
            style={{ height: `${Math.max(6, percent)}%` }}
          />

          {/* Glowing Sheikah Diamond Thumb */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-[#9AF0FF] border border-[#061018] shadow-[0_0_12px_rgba(76,228,255,0.95)] transition-[top] duration-75"
            style={{ top: `${percent}%` }}
          />
        </div>
      </div>

      {/* Bottom Sheikah Micro-Node */}
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rotate-45 border border-[#4CE4FF]/70 bg-[#08121B]"
      />
    </aside>
  );
}
