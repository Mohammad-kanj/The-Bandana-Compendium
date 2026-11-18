import { motion } from 'motion/react';

/**
 * Subtle, pulsing warm amber orb positioned beside the Contact header
 * to visually anchor the Signal Beacon aesthetic.
 */
export function AncientBeacon({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative inline-flex items-center justify-center w-9 h-9 shrink-0 select-none ${className}`}
    >
      {/* Soft warm radial glow */}
      <motion.span
        animate={{
          scale: [1, 1.35, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full blur-md"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 198, 92, 0.7) 0%, rgba(245, 158, 11, 0.25) 60%, transparent 85%)',
        }}
      />

      {/* Delicate outward amber pulse ring */}
      <motion.span
        animate={{
          scale: [0.7, 1.65],
          opacity: [0.55, 0],
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          ease: 'easeOut',
        }}
        className="absolute w-5 h-5 rounded-full border border-[#F7B955]/65"
      />

      {/* Amber beacon orb core */}
      <motion.span
        animate={{
          scale: [0.92, 1.1, 0.92],
          opacity: [0.88, 1, 0.88],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-3.5 h-3.5 rounded-full shadow-[0_0_14px_rgba(255,204,102,0.95),0_0_24px_rgba(245,158,11,0.65)]"
        style={{
          background:
            'radial-gradient(circle at 35% 35%, #FFF7DC 0%, #FFD074 48%, #EA8C1E 100%)',
        }}
      />
    </div>
  );
}
