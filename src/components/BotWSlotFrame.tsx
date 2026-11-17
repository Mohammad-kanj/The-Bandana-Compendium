import React from 'react';
import { ProficiencyLevel } from '../types/resume';

interface BotWSlotFrameProps {
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  roundedClassName?: string;
  showCorners?: boolean;
  children: React.ReactNode;
  ariaLabel?: string;
}

export function BotWSlotFrame({
  selected = false,
  onClick,
  className = '',
  roundedClassName = 'rounded-sm',
  showCorners = true,
  children,
  ariaLabel,
}: BotWSlotFrameProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={selected}
      className={`group relative text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5CE1E6] ${roundedClassName} ${
        selected ? 'botw-slot-selected' : 'botw-slot'
      } ${className}`}
    >
      {selected && showCorners && (
        <>
          <span className="botw-corner botw-corner-tl" aria-hidden="true" />
          <span className="botw-corner botw-corner-tr" aria-hidden="true" />
          <span className="botw-corner botw-corner-bl" aria-hidden="true" />
          <span className="botw-corner botw-corner-br" aria-hidden="true" />
        </>
      )}
      {children}
    </button>
  );
}

interface ProficiencyDiamondsProps {
  level: ProficiencyLevel;
  showNumeric?: boolean;
  size?: 'sm' | 'md';
}

export function ProficiencyDiamonds({
  level,
  showNumeric = true,
  size = 'sm',
}: ProficiencyDiamondsProps) {
  const diamondSize = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((step) => {
          const filled = step <= level;
          return (
            <span
              key={step}
              className={`${diamondSize} rotate-45 border transition-colors ${
                filled
                  ? 'bg-[#E5C97B] border-[#F3E3B4]'
                  : 'bg-transparent border-[#F2ECE0]/25'
              }`}
            />
          );
        })}
      </div>
      {showNumeric && (
        <span className="font-mono text-[11px] tabular-nums text-[#F2ECE0]/70">
          {level}/4
        </span>
      )}
    </div>
  );
}
