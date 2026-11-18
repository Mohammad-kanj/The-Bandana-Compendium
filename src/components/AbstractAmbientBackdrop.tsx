import { motion } from 'motion/react';
import { useState } from 'react';
import { ASSETS } from '../data/defaultResume';

interface AbstractAmbientBackdropProps {
  variant?: 'title' | 'subpage';
}

export function AbstractAmbientBackdrop({
  variant = 'title',
}: AbstractAmbientBackdropProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#102733]"
    >
      {/* Full-Page Linear Gradient: Warm Sunlight Dominates Top 60%, Gradual Transition to Cooler Sheikah Tones in Bottom 40% */}
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === 'title'
              ? 'linear-gradient(180deg, #7DA8AE 0%, #94B89E 14%, #B3B387 28%, #9BAE88 44%, #7C9D84 60%, #5A827F 70%, #396269 81%, #1F424D 91%, #0F2430 100%)'
              : 'linear-gradient(180deg, #6F9BA2 0%, #86AB96 18%, #9DA884 39%, #769783 60%, #4E7678 73%, #2C515B 87%, #122B38 100%)',
        }}
      />

      {/* Painterly Abstract Canvas Blended Smoothly Across Entire Height */}
      {!imgFailed && (
        <img
          src={ASSETS.abstractBg}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 w-full h-full object-cover scale-y-[-1] opacity-25 mix-blend-soft-light"
        />
      )}

      {/* Soft Upper-Sky Sunlit Canopy Glow */}
      <motion.div
        animate={{
          opacity: variant === 'title' ? [0.34, 0.45, 0.34] : [0.24, 0.34, 0.24],
          scale: [1, 1.04, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-28 right-[-6%] w-[95vw] h-[64vh] rounded-full blur-[135px]"
        style={{
          background:
            'radial-gradient(ellipse at 65% 34%, rgba(255,238,190,0.48) 0%, rgba(220,206,154,0.24) 45%, rgba(140,184,152,0.14) 74%, transparent 92%)',
        }}
      />

      {/* Broad Warm Daylight Mist Extending Across the Top 60% */}
      <motion.div
        animate={{
          x: [0, 14, 0],
          opacity: variant === 'title' ? [0.26, 0.36, 0.26] : [0.18, 0.26, 0.18],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[22%] left-[6%] w-[84vw] h-[44%] rounded-full blur-[145px]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(226,214,156,0.28) 0%, rgba(128,176,142,0.2) 52%, transparent 84%)',
        }}
      />

      {/* Subtle Readability Scrim Preserving the Cohesive Light Aesthetic */}
      {variant === 'title' ? (
        <div
          className="absolute inset-y-0 left-0 w-full lg:w-[56%]"
          style={{
            background:
              'linear-gradient(90deg, rgba(12,24,28,0.44) 0%, rgba(12,24,28,0.14) 58%, transparent 100%)',
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,20,26,0.18) 0%, rgba(10,20,26,0.26) 60%, rgba(8,18,26,0.42) 100%)',
          }}
        />
      )}
    </div>
  );
}
