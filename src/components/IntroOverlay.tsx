import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { ASSETS } from '../data/defaultResume';
import { CHAMPION_STYLES } from './KorokNode';

interface IntroOverlayProps {
  visible: boolean;
  displayName: string;
  onComplete: () => void;
}

export function IntroOverlay({
  visible,
  displayName,
  onComplete,
}: IntroOverlayProps) {
  useEffect(() => {
    if (!visible) return;

    const timer = window.setTimeout(() => {
      onComplete();
    }, 1750);

    const handleSkipKey = () => {
      onComplete();
    };
    window.addEventListener('keydown', handleSkipKey);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleSkipKey);
    };
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="botw-smooth-intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          onClick={onComplete}
          role="dialog"
          aria-label="Opening intro"
          className="fixed inset-0 z-50 overflow-hidden flex flex-col items-center justify-center bg-[#060C14] text-[#FAF6EC] cursor-pointer select-none print:hidden"
        >
          {/* Warm Hyrule Dawn Radial Glow */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.6, scale: 1.1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="pointer-events-none absolute w-[480px] h-[480px] rounded-full blur-[110px]"
            style={{
              background:
                'radial-gradient(circle, rgba(243,227,180,0.22) 0%, rgba(76,228,255,0.12) 48%, transparent 75%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center text-center px-6"
          >
            {/* User's Swan Crest Tinted in Warm #F3E3B4 Hyrule Gold */}
            <motion.div
              initial={{ scale: 0.78, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 drop-shadow-[0_0_16px_rgba(243,227,180,0.68)]"
            >
              <img
                src={ASSETS.korokMask}
                alt=""
                aria-hidden="true"
                draggable={false}
                referrerPolicy="no-referrer"
                style={{ filter: CHAMPION_STYLES.hero.filter }}
                className="w-16 h-16 object-contain pointer-events-none"
              />
            </motion.div>

            <h1 className="font-display italic font-semibold text-4xl sm:text-5xl text-[#FAF6EC] tracking-wide drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              {displayName}
            </h1>

            {/* Expanding Golden Hairline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 h-[1px] w-56 sm:w-72 origin-center bg-gradient-to-r from-transparent via-[#F3E3B4]/85 to-transparent"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.78 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="mt-3 text-xs sm:text-sm tracking-[0.16em] uppercase text-[#F3E3B4]"
            >
              AI Engineering · Flutter &amp; Full-Stack
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
