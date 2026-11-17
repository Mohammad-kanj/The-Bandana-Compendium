import React from 'react';

interface SheikahSlateFrameProps {
  children: React.ReactNode;
  className?: string;
}

function SheikahEyeCrest() {
  return (
    <svg
      viewBox="0 0 64 36"
      className="w-12 h-7 text-[#4CE4FF] drop-shadow-[0_0_8px_rgba(76,228,255,0.85)]"
      fill="none"
      aria-hidden="true"
    >
      {/* Upper three eyelashes */}
      <path
        d="M32 3V9M19 6.5L22.5 11.5M45 6.5L41.5 11.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Almond Eye */}
      <path
        d="M12 18C18.5 11 25.5 9 32 9C38.5 9 45.5 11 52 18C45.5 25 38.5 27 32 27C25.5 27 18.5 25 12 18Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Pupil */}
      <circle cx="32" cy="18" r="4.2" fill="currentColor" />
      {/* Lower teardrop */}
      <path
        d="M32 27.5C32 27.5 35 31 35 32.8C35 34.4 33.7 35.5 32 35.5C30.3 35.5 29 34.4 29 32.8C29 31 32 27.5 32 27.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SheikahSlateFrame({
  children,
  className = '',
}: SheikahSlateFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Top Carved Stone Handle Arch & Sheikah Eye Crest */}
      <div
        aria-hidden="true"
        className="mx-auto w-44 h-7 rounded-t-xl bg-gradient-to-b from-[#252E38] to-[#171D24] border-t-2 border-x-2 border-[#7E6B4B]/80 flex items-center justify-center relative z-10 -mb-[2px] shadow-[0_-4px_14px_rgba(0,0,0,0.45)]"
      >
        <div className="absolute inset-x-4 top-1 h-[1px] bg-gradient-to-r from-transparent via-[#4CE4FF]/55 to-transparent" />
        <SheikahEyeCrest />
      </div>

      {/* Outer Sculpted Stone & Bronze Sheikah Slate Chassis */}
      <div className="relative rounded-xl p-2.5 sm:p-3.5 bg-gradient-to-br from-[#232B34] via-[#171E26] to-[#11161C] border-2 border-[#7D6949]/85 shadow-[0_24px_60px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(243,227,180,0.22)]">
        {/* Corner Stone Lugs / Bolts */}
        <span
          aria-hidden="true"
          className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#3A3224] border border-[#9E865E]/75"
        />
        <span
          aria-hidden="true"
          className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#3A3224] border border-[#9E865E]/75"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-[#3A3224] border border-[#9E865E]/75"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-[#3A3224] border border-[#9E865E]/75"
        />

        {/* Carved Glowing Sheikah Circuit Lines on Left & Right Bezels */}
        <div
          aria-hidden="true"
          className="hidden sm:flex flex-col justify-between items-center absolute left-1 top-10 bottom-10 w-2 pointer-events-none"
        >
          <span className="w-[2px] h-10 bg-[#4CE4FF]/65 shadow-[0_0_8px_rgba(76,228,255,0.75)] rounded-full" />
          <span className="w-1.5 h-1.5 rotate-45 border border-[#4CE4FF]/80 bg-[#4CE4FF]/40" />
          <span className="w-[2px] h-10 bg-[#4CE4FF]/65 shadow-[0_0_8px_rgba(76,228,255,0.75)] rounded-full" />
        </div>
        <div
          aria-hidden="true"
          className="hidden sm:flex flex-col justify-between items-center absolute right-1 top-10 bottom-10 w-2 pointer-events-none"
        >
          <span className="w-[2px] h-10 bg-[#4CE4FF]/65 shadow-[0_0_8px_rgba(76,228,255,0.75)] rounded-full" />
          <span className="w-1.5 h-1.5 rotate-45 border border-[#4CE4FF]/80 bg-[#4CE4FF]/40" />
          <span className="w-[2px] h-10 bg-[#4CE4FF]/65 shadow-[0_0_8px_rgba(76,228,255,0.75)] rounded-full" />
        </div>

        {/* Inner Bronze Filigree Lip */}
        <div className="rounded-lg p-[2px] bg-gradient-to-b from-[#927B53]/70 via-[#594B33]/60 to-[#927B53]/70">
          {/* Glowing Cyan Sheikah Display Viewport */}
          <div className="relative rounded-[6px] bg-[#071018]/86 backdrop-blur-md border border-[#4CE4FF]/55 shadow-[inset_0_0_32px_rgba(76,228,255,0.16)] overflow-hidden">
            {/* Inner Cyan Reticle Corner Accents */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t border-l border-[#4CE4FF]/70"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t border-r border-[#4CE4FF]/70"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#4CE4FF]/70"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#4CE4FF]/70"
            />

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
