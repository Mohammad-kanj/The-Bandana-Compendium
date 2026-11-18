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

const LEVEL_TO_FIVE_BARS: Record<ProficiencyLevel, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 5,
};

interface SheikahProficiencyGaugeProps {
  level: ProficiencyLevel;
  showNumeric?: boolean;
  size?: 'sm' | 'md';
}

/**
 * 1-5 segmented bar gauge styled like Sheikah Slate menu energy indicators.
 */
export function SheikahProficiencyGauge({
  level,
  showNumeric = true,
  size = 'sm',
}: SheikahProficiencyGaugeProps) {
  const filledBars = LEVEL_TO_FIVE_BARS[level];
  const barHeight = size === 'sm' ? 'h-1.5' : 'h-2.5';
  const barWidth = size === 'sm' ? 'w-3.5' : 'w-6';
  const paddingClass = size === 'sm' ? 'p-[3px] gap-[3px]' : 'p-1 gap-1';

  return (
    <div className="inline-flex items-center gap-2">
      <div
        role="meter"
        aria-label={`Proficiency ${filledBars} out of 5`}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={filledBars}
        className={`inline-flex items-center rounded-[3px] bg-[#061019]/90 border border-[#4CE4FF]/28 ${paddingClass}`}
      >
        {[1, 2, 3, 4, 5].map((segment) => {
          const active = segment <= filledBars;
          return (
            <span
              key={segment}
              aria-hidden="true"
              className={`${barWidth} ${barHeight} rounded-[1px] transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-[#4CE4FF] to-[#9AF0FF] shadow-[0_0_8px_rgba(76,228,255,0.62)]'
                  : 'bg-[#4CE4FF]/14'
              }`}
            />
          );
        })}
      </div>
      {showNumeric && (
        <span className="font-mono text-[11px] tabular-nums text-[#9AF0FF]/85">
          {filledBars}/5
        </span>
      )}
    </div>
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
