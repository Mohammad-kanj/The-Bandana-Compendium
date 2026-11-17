import { AnimatePresence, motion } from 'motion/react';

interface SheikahLoadingOverlayProps {
  visible: boolean;
  targetLabel: string;
}

export function SheikahLoadingOverlay({
  visible,
  targetLabel,
}: SheikahLoadingOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sheikah-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          aria-live="polite"
          aria-label={`Loading ${targetLabel}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#040B12]/82 backdrop-blur-md print:hidden"
        >
          {/* Subtle Ancient Slate Scanline Texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(76,228,255,0.12) 0px, rgba(76,228,255,0.12) 1px, transparent 1px, transparent 5px)',
            }}
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.04, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center gap-4 px-8 py-7 bg-[#07111A]/90 border border-[#4CE4FF]/45 rounded-sm shadow-[0_0_50px_rgba(76,228,255,0.22)]"
          >
            {/* Corner Sheikah Brackets */}
            <span aria-hidden="true" className="botw-corner botw-corner-tl !border-[#4CE4FF]" />
            <span aria-hidden="true" className="botw-corner botw-corner-tr !border-[#4CE4FF]" />
            <span aria-hidden="true" className="botw-corner botw-corner-bl !border-[#4CE4FF]" />
            <span aria-hidden="true" className="botw-corner botw-corner-br !border-[#4CE4FF]" />

            {/* Rotating Concentric Sheikah Eye Rune */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <motion.svg
                viewBox="0 0 64 64"
                className="absolute inset-0 w-full h-full text-[#4CE4FF]"
                fill="none"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
              >
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="6 4"
                  strokeOpacity="0.65"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="21"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeDasharray="18 7 4 7"
                />
              </motion.svg>

              {/* Central Sheikah Eye Crest */}
              <svg
                viewBox="0 0 40 40"
                className="w-8 h-8 text-[#9AF0FF] drop-shadow-[0_0_10px_rgba(76,228,255,0.9)]"
                fill="none"
              >
                <path
                  d="M6 20C10.5 13 15 10.5 20 10.5C25 10.5 29.5 13 34 20C29.5 27 25 29.5 20 29.5C15 29.5 10.5 27 6 20Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle cx="20" cy="20" r="4" fill="currentColor" />
                <path
                  d="M20 4.5V8.5M20 31.5V35.5M12 7L14 10M28 7L26 10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="text-center">
              <div className="font-display italic text-xl font-semibold text-[#E8F9FF] tracking-wide">
                {targetLabel}
              </div>
              <div className="mt-2.5 w-44 h-[2px] bg-[#4CE4FF]/20 overflow-hidden rounded-full">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: 0.45,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="h-full w-2/3 bg-gradient-to-r from-transparent via-[#4CE4FF] to-transparent shadow-[0_0_10px_rgba(76,228,255,0.9)]"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
