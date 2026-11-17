import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ASSETS } from '../data/defaultResume';
import { playKorokShakeSound } from '../utils/korokSound';

interface KorokNodeProps {
  korokId: string;
  variantIndex?: number;
  size?: 'sm' | 'md';
  /** 'seed' renders a non-clickable golden Korok nugget (shakes with game sound on hover); 'mask' renders a clickable cropped swan */
  appearance?: 'mask' | 'seed';
  label?: string;
  /** Border color matched to the ambient background behind this node */
  borderColor?: string;
  /** Subtle tinted backdrop color matched to the surrounding gradient */
  surfaceColor?: string;
  className?: string;
}

export function KorokNode({
  korokId,
  variantIndex = 0,
  size = 'md',
  appearance = 'mask',
  label = 'Discover hidden Korok',
  borderColor = 'rgba(116, 154, 138, 0.78)',
  surfaceColor = 'rgba(28, 56, 58, 0.46)',
  className = '',
}: KorokNodeProps) {
  const [isShaking, setIsShaking] = useState(false);
  const [burstCount, setBurstCount] = useState(0);
  const [burstActive, setBurstActive] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const triggerShake = () => {
    playKorokShakeSound(variantIndex);
    setIsShaking(true);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setIsShaking(false);
    }, 580);
  };

  const handleSwanClick = () => {
    setBurstCount((c) => c + 1);
    setBurstActive(true);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setBurstActive(false);
    }, 620);
  };

  const isGoldenNugget = appearance === 'seed';
  const avatarDimensions = isGoldenNugget
    ? size === 'sm'
      ? 'w-8 h-8 p-1'
      : 'w-9 h-9 p-1'
    : 'w-9 h-9 p-1.5';
  const imageSrc = isGoldenNugget ? ASSETS.korokSeed : ASSETS.korokMask;

  // Golden Korok Seed: NON-clickable; shakes with game maraca/rattle sound on hover/touch
  if (isGoldenNugget) {
    return (
      <div
        className={`relative inline-flex items-center justify-center cursor-default select-none ${className}`}
        onMouseEnter={triggerShake}
        onTouchStart={triggerShake}
        aria-label={label}
      >
        <motion.div
          animate={
            isShaking
              ? {
                  rotate: [0, -16, 16, -13, 13, -8, 6, 0],
                  x: [0, -1.8, 1.8, -1.4, 1.4, -0.8, 0.8, 0],
                  y: [0, -1.5, 0.5, -1.5, 0.5, 0],
                  scale: [1, 1.09, 1.05, 1.08, 1],
                }
              : { rotate: 0, x: 0, y: 0, scale: 1 }
          }
          transition={{ duration: 0.54, ease: 'easeInOut' }}
          style={{
            borderColor,
            backgroundColor: surfaceColor,
          }}
          className={`relative ${avatarDimensions} rounded-full overflow-hidden flex items-center justify-center border backdrop-blur-xs shadow-[0_2px_10px_rgba(0,0,0,0.22)]`}
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
      </div>
    );
  }

  // Origamied Swan Waypoint: CLICKABLE (triggers KorokContext Yahaha popup & sound) with background-matched border
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <AnimatePresence>
        {burstActive && (
          <motion.span
            key={`ring-${burstCount}`}
            initial={{ opacity: 0.75, scale: 0.65 }}
            animate={{ opacity: 0, scale: 1.95 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.48, ease: 'easeOut' }}
            aria-hidden="true"
            style={{ borderColor }}
            className="pointer-events-none absolute inset-0 rounded-full border"
          />
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        data-korok-node={korokId}
        data-korok-variant={variantIndex}
        onClick={handleSwanClick}
        aria-label={label}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        animate={
          burstActive
            ? {
                rotate: [0, -10, 10, -5, 0],
                scale: [1, 1.16, 1],
              }
            : { rotate: 0, scale: 1 }
        }
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderColor,
          backgroundColor: surfaceColor,
        }}
        className={`relative ${avatarDimensions} rounded-full overflow-hidden flex items-center justify-center cursor-pointer border backdrop-blur-xs shadow-[0_2px_10px_rgba(0,0,0,0.24)] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9AF0FF]/70`}
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
      </motion.button>
    </div>
  );
}
