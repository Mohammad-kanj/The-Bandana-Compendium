import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useKorok } from '../context/KorokContext';
import { useSound } from '../context/SoundContext';
import { ASSETS } from '../data/defaultResume';

export type ChampionTheme = 'hero' | 'mipha' | 'revali' | 'daruk' | 'urbosa';

export const CHAMPION_STYLES: Record<
  ChampionTheme,
  { filter: string; accentGlow: string; borderColor: string }
> = {
  hero: {
    filter: 'sepia(0.24) saturate(0.72) brightness(1.22) hue-rotate(8deg)',
    accentGlow: '0 0 14px rgba(243, 227, 180, 0.48)',
    borderColor: 'rgba(243, 227, 180, 0.72)',
  },
  mipha: {
    filter: 'hue-rotate(-38deg) saturate(1.5) brightness(1.05)',
    accentGlow: '0 0 14px rgba(244, 63, 94, 0.35)',
    borderColor: 'rgba(244, 63, 94, 0.68)',
  },
  revali: {
    filter: 'hue-rotate(168deg) saturate(1.35) brightness(1.08)',
    accentGlow: '0 0 14px rgba(56, 189, 248, 0.35)',
    borderColor: 'rgba(56, 189, 248, 0.68)',
  },
  daruk: {
    filter: 'hue-rotate(-14deg) saturate(1.65) brightness(1.06)',
    accentGlow: '0 0 14px rgba(249, 115, 22, 0.35)',
    borderColor: 'rgba(249, 115, 22, 0.68)',
  },
  urbosa: {
    filter: 'hue-rotate(16deg) saturate(1.42) brightness(1.16)',
    accentGlow: '0 0 14px rgba(250, 204, 21, 0.35)',
    borderColor: 'rgba(250, 204, 21, 0.68)',
  },
};

interface KorokNodeProps {
  korokId: string;
  variantIndex?: number;
  size?: 'sm' | 'md';
  /** 'seed' renders the shake-only golden Korok nugget; 'mask' renders the clickable swan collectible */
  appearance?: 'mask' | 'seed';
  championTheme?: ChampionTheme;
  label?: string;
  /** Border color matched to the ambient background behind this node */
  borderColor?: string;
  /** Solid-feeling tinted backdrop color matched to the surrounding gradient */
  surfaceColor?: string;
  /** Softly lights up the waypoint when the Hero's Path trail reaches it */
  trailLit?: boolean;
  className?: string;
}

export function KorokNode({
  korokId,
  variantIndex = 0,
  size = 'md',
  appearance = 'mask',
  championTheme,
  label = 'Discover hidden borok',
  borderColor = 'rgba(116, 154, 138, 0.85)',
  surfaceColor = 'rgba(22, 50, 62, 0.94)',
  trailLit = false,
  className = '',
}: KorokNodeProps) {
  const { isDiscovered } = useKorok();
  const { playShake } = useSound();
  const discovered = isDiscovered(korokId);

  const [isShaking, setIsShaking] = useState(false);
  const [burstCount, setBurstCount] = useState(0);
  const [burstActive, setBurstActive] = useState(false);
  const [trailPulseKey, setTrailPulseKey] = useState<number>(0);
  const [imgFailed, setImgFailed] = useState(false);

  const prevTrailLitRef = useRef(false);
  const shakeTimerRef = useRef<number | null>(null);
  const burstTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (shakeTimerRef.current !== null) window.clearTimeout(shakeTimerRef.current);
      if (burstTimerRef.current !== null) window.clearTimeout(burstTimerRef.current);
    };
  }, []);

  // Pulse softly once whenever the Hero's Path trail reaches this waypoint (no shake sound on swans)
  useEffect(() => {
    if (trailLit && !prevTrailLitRef.current) {
      setTrailPulseKey((k) => k + 1);
    }
    prevTrailLitRef.current = trailLit;
  }, [trailLit]);

  const triggerHoverShake = () => {
    if (appearance !== 'seed') return;
    playShake(variantIndex);
    setIsShaking(true);
    if (shakeTimerRef.current !== null) {
      window.clearTimeout(shakeTimerRef.current);
    }
    shakeTimerRef.current = window.setTimeout(() => {
      setIsShaking(false);
    }, 560);
  };

  const handleClick = () => {
    if (appearance === 'seed') return;
    setBurstCount((c) => c + 1);
    setBurstActive(true);
    if (burstTimerRef.current !== null) {
      window.clearTimeout(burstTimerRef.current);
    }
    burstTimerRef.current = window.setTimeout(() => {
      setBurstActive(false);
    }, 620);
  };

  const isGoldenNugget = appearance === 'seed';
  const visualDimensions = isGoldenNugget
    ? size === 'sm'
      ? 'w-8 h-8 p-1'
      : 'w-9 h-9 p-1'
    : 'w-9 h-9 p-1.5';
  const imageSrc = isGoldenNugget ? ASSETS.korokSeed : ASSETS.korokMask;

  const champ = championTheme ? CHAMPION_STYLES[championTheme] : null;

  // Keep the circular fill harmonized with the ambient background, and illuminate the ring when trailLit
  const activeBorderColor = trailLit
    ? 'rgba(154, 240, 255, 0.94)'
    : discovered && !isGoldenNugget
      ? 'rgba(243, 227, 180, 0.78)'
      : borderColor;

  const activeSurface = surfaceColor;

  const activeBoxShadow = trailLit
    ? champ
      ? `0 0 18px rgba(76, 228, 255, 0.62), 0 0 8px rgba(154, 240, 255, 0.68), ${champ.accentGlow}`
      : '0 0 18px rgba(76, 228, 255, 0.65), 0 0 8px rgba(154, 240, 255, 0.72), 0 2px 10px rgba(0,0,0,0.22)'
    : discovered && !isGoldenNugget
      ? '0 0 12px rgba(243, 227, 180, 0.25), 0 2px 10px rgba(0,0,0,0.22)'
      : '0 2px 10px rgba(0,0,0,0.2)';

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseEnter={triggerHoverShake}
      onTouchStart={triggerHoverShake}
    >
      {/* Sequential pulse ring when the Hero's Path trail reaches this waypoint */}
      <AnimatePresence>
        {trailPulseKey > 0 && (
          <motion.span
            key={`trail-pulse-${trailPulseKey}`}
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.72, 1.25, 1.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
            style={{ borderColor: activeBorderColor }}
            className="pointer-events-none absolute w-9 h-9 rounded-full border-2 shadow-[0_0_16px_rgba(76,228,255,0.6)]"
          />
        )}
      </AnimatePresence>

      {/* Discovery burst ring when swan is clicked */}
      <AnimatePresence>
        {!isGoldenNugget && burstActive && (
          <motion.span
            key={`ring-${burstCount}`}
            initial={{ opacity: 0.8, scale: 0.65 }}
            animate={{ opacity: 0, scale: 1.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.48, ease: 'easeOut' }}
            aria-hidden="true"
            style={{ borderColor: activeBorderColor }}
            className="pointer-events-none absolute w-9 h-9 rounded-full border"
          />
        )}
      </AnimatePresence>

      {isGoldenNugget ? (
        <motion.div
          role="img"
          aria-label={label}
          animate={
            isShaking
              ? {
                  rotate: [0, -15, 15, -12, 12, -7, 5, 0],
                  x: [0, -1.6, 1.6, -1.2, 1.2, -0.6, 0.6, 0],
                  scale: [1, 1.09, 1.04, 1.07, 1],
                }
              : { rotate: 0, x: 0, scale: 1 }
          }
          transition={{ duration: 0.52, ease: 'easeInOut' }}
          style={{
            borderColor: activeBorderColor,
            backgroundColor: activeSurface,
            boxShadow: activeBoxShadow,
          }}
          className={`relative ${visualDimensions} rounded-full overflow-hidden flex items-center justify-center border backdrop-blur-xs select-none`}
        >
          {!imgFailed ? (
            <img
              src={imageSrc}
              alt=""
              draggable={false}
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-contain pointer-events-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]"
            />
          ) : (
            <span
              aria-hidden="true"
              className="w-2 h-2 rotate-45 bg-[#F3E3B4]/80"
            />
          )}
        </motion.div>
      ) : (
        /* Generous 48x48px (w-12 h-12) accessible touch hit-box wrapping delicate 36px visual swan circle */
        <motion.button
          type="button"
          data-korok-node={korokId}
          data-korok-variant={variantIndex}
          onClick={handleClick}
          aria-label={label}
          aria-pressed={discovered}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          animate={
            burstActive
              ? {
                  rotate: [0, -10, 10, -5, 0],
                  scale: [1, 1.16, 1],
                }
              : { rotate: 0, x: 0, scale: 1 }
          }
          transition={{ duration: 0.36, ease: 'easeInOut' }}
          className="relative w-12 h-12 flex items-center justify-center cursor-pointer rounded-full bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9AF0FF]/75"
        >
          <span
            style={{
              borderColor: activeBorderColor,
              backgroundColor: activeSurface,
              boxShadow: activeBoxShadow,
            }}
            className="relative w-9 h-9 p-1.5 rounded-full overflow-hidden flex items-center justify-center border backdrop-blur-sm transition-all duration-500 delay-150"
          >
            {!imgFailed ? (
              <img
                src={imageSrc}
                alt=""
                draggable={false}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                style={champ ? { filter: champ.filter } : undefined}
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]"
              />
            ) : (
              <span
                aria-hidden="true"
                className="w-2 h-2 rotate-45 bg-[#F3E3B4]/80"
              />
            )}
          </span>
        </motion.button>
      )}
    </div>
  );
}
