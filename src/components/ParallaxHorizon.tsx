import { useEffect, useRef } from 'react';

/**
 * Multi-layered minimalist SVG horizon ridges, distant Hyrule tower & twin peaks,
 * drifting cloud ribbons, and subtle Sheikah geometric sky rings with smooth cursor & scroll parallax.
 */
export function ParallaxHorizon() {
  const skyRingsRef = useRef<SVGSVGElement | null>(null);
  const cloudsRef = useRef<SVGSVGElement | null>(null);
  const skylineRef = useRef<SVGSVGElement | null>(null);
  const farRef = useRef<SVGSVGElement | null>(null);
  const midRef = useRef<SVGSVGElement | null>(null);
  const nearRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const nx = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      const ny = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
      targetX = nx;
      targetY = ny;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;

      const scrollOffset = Math.min(window.scrollY, 2600);

      if (skyRingsRef.current) {
        skyRingsRef.current.style.transform = `translate3d(${(currentX * 4).toFixed(2)}px, ${(
          currentY * 2 +
          scrollOffset * 0.006
        ).toFixed(2)}px, 0)`;
      }
      if (cloudsRef.current) {
        cloudsRef.current.style.transform = `translate3d(${(currentX * 10).toFixed(2)}px, ${(
          currentY * 3.5 +
          scrollOffset * 0.01
        ).toFixed(2)}px, 0)`;
      }
      if (skylineRef.current) {
        skylineRef.current.style.transform = `translate3d(${(currentX * 6).toFixed(2)}px, ${(
          currentY * 2.5 +
          scrollOffset * 0.01
        ).toFixed(2)}px, 0)`;
      }
      if (farRef.current) {
        farRef.current.style.transform = `translate3d(${(currentX * 9).toFixed(2)}px, ${(
          currentY * 3 +
          scrollOffset * 0.014
        ).toFixed(2)}px, 0)`;
      }
      if (midRef.current) {
        midRef.current.style.transform = `translate3d(${(currentX * 16).toFixed(2)}px, ${(
          currentY * 5 +
          scrollOffset * 0.025
        ).toFixed(2)}px, 0)`;
      }
      if (nearRef.current) {
        nearRef.current.style.transform = `translate3d(${(currentX * 24).toFixed(2)}px, ${(
          currentY * 8 +
          scrollOffset * 0.038
        ).toFixed(2)}px, 0)`;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden print:hidden"
    >
      {/* Upper Sky Geometric Sheikah Ring & Constellation Arcs (~5.5% opacity) */}
      <svg
        ref={skyRingsRef}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full opacity-[0.055] will-change-transform"
      >
        <g stroke="#CCF7FF" strokeWidth="1" fill="none">
          <circle cx="1180" cy="180" r="145" strokeDasharray="6 8" />
          <circle cx="1180" cy="180" r="98" strokeOpacity="0.65" />
          <path d="M1180 22 L1180 338 M1022 180 L1338 180" strokeOpacity="0.35" />
          <polygon points="1180,104 1246,218 1114,218" strokeOpacity="0.45" />

          <circle cx="240" cy="240" r="96" strokeDasharray="4 10" strokeOpacity="0.55" />
          <circle cx="240" cy="240" r="54" strokeOpacity="0.45" />
          <path d="M168 240 H312" strokeOpacity="0.3" />
        </g>
      </svg>

      {/* Minimalist Drifting Cloud Ribbons, Distant Birds & Soaring Paragliders (~8% opacity) */}
      <svg
        ref={cloudsRef}
        viewBox="0 0 1440 440"
        preserveAspectRatio="none"
        className="absolute top-[7%] -left-[4%] w-[108%] h-[38vh] opacity-[0.08] will-change-transform"
      >
        <path
          d="M90,145 C140,126 195,128 245,142 C295,118 375,120 420,146 C455,136 495,142 520,158 L70,158 Z"
          fill="#FAF6EC"
        />
        <path
          d="M840,98 C895,74 975,78 1025,102 C1068,84 1140,90 1180,114 C1215,104 1265,112 1295,128 L810,128 Z"
          fill="#FAF6EC"
        />
        <path
          d="M540,210 C585,196 638,198 675,212 C715,198 762,204 790,220 L520,220 Z"
          fill="#E8F9FF"
        />

        {/* Minimal distant flying birds */}
        <g stroke="#FAF6EC" strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d="M620,115 Q628,108 636,115 Q644,108 652,115" />
          <path d="M662,130 Q668,125 674,130 Q680,125 686,130" />
          <path d="M645,96 Q650,91 655,96 Q660,91 665,96" />
        </g>

        {/* Abstract Paraglider 1 (Right-upper breeze, gliding left) */}
        <g transform="translate(1070, 152) rotate(-8)" fill="#FAF6EC" stroke="#FAF6EC">
          <path
            d="M-26,0 Q0,-20 26,0 Q13,-5 0,-3 Q-13,-5 -26,0 Z"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <line x1="-15" y1="-3" x2="-2" y2="11" strokeWidth="1" opacity="0.7" />
          <line x1="15" y1="-3" x2="2" y2="11" strokeWidth="1" opacity="0.7" />
          <circle cx="0" cy="13" r="2.2" stroke="none" />
          <path d="M-2.5,16 L2.5,16 L1.5,24 L-1.5,24 Z" stroke="none" />
        </g>

        {/* Abstract Paraglider 2 (Left-mid high sky, gliding right) */}
        <g transform="translate(335, 96) scale(0.78) rotate(10)" fill="#E8F9FF" stroke="#E8F9FF">
          <path
            d="M-24,0 Q0,-18 24,0 Q12,-4 0,-2.5 Q-12,-4 -24,0 Z"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <line x1="-13" y1="-2" x2="-1.5" y2="10" strokeWidth="1" opacity="0.7" />
          <line x1="13" y1="-2" x2="1.5" y2="10" strokeWidth="1" opacity="0.7" />
          <circle cx="0" cy="12" r="2" stroke="none" />
          <path d="M-2,15 L2,15 L1,22 L-1,22 Z" stroke="none" />
        </g>
      </svg>

      {/* Bottom Mountain Ridges, Stepped Plateaus, Shrines, Lookout Bokoblins & Tower Anchor */}
      <div className="absolute inset-x-0 bottom-0 h-[38vh] min-h-[220px] max-h-[430px]">
        {/* Distant Dueling Peaks, Stepped Plateau & Ancient Sheikah Spire (~7% opacity) */}
        <svg
          ref={skylineRef}
          viewBox="0 0 1440 340"
          preserveAspectRatio="none"
          className="absolute -bottom-8 -left-[4%] w-[108%] h-full opacity-[0.07] will-change-transform"
        >
          {/* Stepped Great Plateau mesa on far left + Dueling Peaks + Sheikah Tower */}
          <path
            d="M0,210 L42,210 L48,142 L152,142 L158,176 L218,176 L225,205 L312,208 L405,74 L438,122 L472,68 L585,186 L760,152 L925,198 L1085,118 L1132,124 L1135,58 L1147,58 L1150,124 L1195,134 L1255,154 L1375,154 L1382,182 L1440,182 L1440,340 L0,340 Z"
            fill="#1D4754"
          />
          {/* Distant Shrine Silhouette atop Left Stepped Plateau */}
          <g transform="translate(98, 142)">
            <path d="M-16,0 L-12,-8 L12,-8 L16,0 Z" fill="#1D4754" />
            <path d="M-10,-8 C-11,-22 -4,-30 0,-34 C4,-30 11,-22 10,-8 Z" fill="#1D4754" />
            <rect x="-1.5" y="-26" width="3" height="10" rx="1" fill="#4CE4FF" opacity="0.55" />
          </g>
        </svg>

        {/* Distant Ridge with Second Mesa Plateau (~8% opacity, deep teal-slate) */}
        <svg
          ref={farRef}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute -bottom-8 -left-[4%] w-[108%] h-[92%] opacity-[0.08] will-change-transform"
        >
          <path
            d="M0,210 L110,165 L210,190 L355,112 L490,175 L645,86 L745,142 L825,142 L832,118 L935,98 L1085,164 L1215,124 L1315,124 L1324,154 L1440,132 L1440,320 L0,320 Z"
            fill="#1B424D"
          />
        </svg>

        {/* Midground Stepped Plateau Ridge, Ancient Shrine & Bokoblin Lookout (~10% opacity) */}
        <svg
          ref={midRef}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute -bottom-8 -left-[4%] w-[108%] h-[78%] opacity-[0.1] will-change-transform"
        >
          {/* Midground ridge incorporating flat-topped terraced plateaus */}
          <path
            d="M0,238 L145,196 L245,196 L254,174 L338,174 L348,208 L430,148 L575,204 L710,162 L870,214 L1020,136 L1120,178 L1228,178 L1242,158 L1315,158 L1365,186 L1440,188 L1440,320 L0,320 Z"
            fill="#12303B"
          />

          {/* Midground Ancient Shrine Dome on Right Mesa Plateau */}
          <g transform="translate(1278, 158)">
            <path d="M-22,0 L-16,-10 L16,-10 L22,0 Z" fill="#12303B" />
            <path d="M-13,-10 C-14,-28 -5,-40 0,-45 C5,-40 14,-28 13,-10 Z" fill="#12303B" />
            <path d="M-4,-42 L0,-50 L4,-42 Z" fill="#12303B" />
            <circle cx="0" cy="-24" r="2.2" fill="#4CE4FF" opacity="0.6" />
          </g>

          {/* Abstract Bokoblin Lookout Camp on Left Terrace Plateau */}
          <g transform="translate(292, 174)" fill="#12303B">
            {/* Minimal wooden lookout platform & angled banner pole */}
            <rect x="-26" y="-20" width="2.6" height="20" />
            <rect x="-8" y="-20" width="2.6" height="20" />
            <rect x="-29" y="-22" width="26" height="3.2" rx="1" />
            <line x1="-24" y1="-22" x2="-28" y2="-36" stroke="#12303B" strokeWidth="1.6" />
            {/* Horned Bokoblin Silhouette #1 perched on platform */}
            <path d="M-19,-22 L-19,-29 L-14,-29 L-13,-22 Z" />
            <circle cx="-16.5" cy="-32.5" r="3.4" />
            <path d="M-19,-35 L-23,-40 L-17.5,-35.5 Z" />
            <path d="M-14,-35 L-10,-40 L-15.5,-35.5 Z" />
            {/* Horned Bokoblin Silhouette #2 standing guard with club/spear */}
            <path d="M12,0 L13,-11 L19,-11 L20,0 Z" />
            <circle cx="16" cy="-14.5" r="3.6" />
            <path d="M13,-17 L9,-23 L15,-17.5 Z" />
            <path d="M19,-17 L23,-22 L17.5,-17.5 Z" />
            <line x1="21" y1="-2" x2="27" y2="-24" stroke="#12303B" strokeWidth="1.7" />
          </g>
        </svg>

        {/* Foreground Horizon Ridge (~12% opacity, deep twilight slate) */}
        <svg
          ref={nearRef}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute -bottom-8 -left-[4%] w-[108%] h-[58%] opacity-[0.12] will-change-transform"
        >
          <path
            d="M0,264 L170,218 L320,248 L485,196 L640,242 L805,198 L960,244 L1120,204 L1275,238 L1440,212 L1440,320 L0,320 Z"
            fill="#091D28"
          />
        </svg>
      </div>
    </div>
  );
}
