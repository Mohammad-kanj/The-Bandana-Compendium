import { Code2 } from 'lucide-react';
import { useState } from 'react';
import { ProjectGalleryImage } from '../types/resume';

interface ProjectMediaPreviewProps {
  title: string;
  subtitle?: string;
  image: string;
  gallery?: ProjectGalleryImage[];
  mediaOrientation?: 'landscape' | 'portrait';
  variant?: 'card' | 'featured';
  zoomOnGroupHover?: boolean;
}

export function ProjectMediaPreview({
  title,
  subtitle,
  image,
  gallery,
  mediaOrientation = 'landscape',
  variant = 'card',
  zoomOnGroupHover = false,
}: ProjectMediaPreviewProps) {
  const [failedSrcs, setFailedSrcs] = useState<Record<string, boolean>>({});

  const markFailed = (src: string) => {
    setFailedSrcs((prev) => ({ ...prev, [src]: true }));
  };

  const isFeatured = variant === 'featured';

  // =========================================================================
  // 1. PORTRAIT SHOWCASE (Zero-Crop 3-Phone Fanned Studio Composition)
  // Wraps natural image aspect ratio so 0px are ever cropped off the edges
  // =========================================================================
  if (mediaOrientation === 'portrait') {
    const heroSrc = gallery?.[0]?.src ?? image;
    const leftSrc = gallery?.[1]?.src;
    const rightSrc = gallery?.[2]?.src;

    if (failedSrcs[heroSrc]) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#161E26] to-[#0B0E12] text-[#E5C97B]/80 p-3 text-center">
          <Code2 className="w-6 h-6 mb-1" aria-hidden="true" />
          <span className="text-xs font-medium text-[#FAF6EC]/80">
            {subtitle || title}
          </span>
        </div>
      );
    }

    const antiAliasStyle = {
      backfaceVisibility: 'hidden' as const,
      outline: '1px solid transparent',
    };

    return (
      <div
        style={{ containerType: 'size' }}
        className="relative w-full h-full overflow-hidden bg-[#060C18] flex items-center justify-center"
      >
        {/* Soft Ambient Blurred Backdrop */}
        <img
          src={heroSrc}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover scale-125 blur-xl opacity-35 saturate-125 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#060E1A]/55 via-[#071120]/40 to-[#050A12]/80 pointer-events-none"
        />

        {/* Subtle Cyan/Gold Studio Spotlight */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(229,201,123,0.16),rgba(76,228,255,0.08)_42%,transparent_72%)] pointer-events-none"
        />

        {/* 3-Phone Zero-Crop Composition (Container-Fitted so Side Pics Never Clip) */}
        <div
          className={`relative z-10 w-full h-full flex items-center justify-center transition-transform duration-300 ease-out ${
            zoomOnGroupHover ? 'group-hover:scale-[1.04]' : ''
          } ${isFeatured ? 'px-2 py-2' : 'px-1.5 py-1.5'}`}
        >
          {/* Left Secondary Phone (Natural Aspect Ratio — Uncropped) */}
          {leftSrc && !failedSrcs[leftSrc] && (
            <div
              style={{
                ...antiAliasStyle,
                height: isFeatured ? 'min(74cqh, 53cqw)' : 'min(74cqh, 54cqw)',
              }}
              className={`relative shrink-0 w-fit rounded-[7px] sm:rounded-[9px] overflow-hidden border border-[#FAF6EC]/24 bg-[#050A12] shadow-[0_8px_20px_rgba(0,0,0,0.65)] opacity-88 -rotate-5 origin-bottom-right transition-transform duration-300 ease-out ${
                zoomOnGroupHover ? 'group-hover:-rotate-7 group-hover:-translate-x-0.5' : ''
              } ${
                isFeatured
                  ? '-mr-3 sm:-mr-4 translate-y-1.5'
                  : '-mr-2 translate-y-1'
              }`}
            >
              <img
                src={leftSrc}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                decoding="async"
                onError={() => markFailed(leftSrc)}
                className="h-full w-auto block"
              />
            </div>
          )}

          {/* Center Primary Hero Phone (Natural Aspect Ratio — Uncropped) */}
          <div
            style={{
              height: isFeatured ? 'min(90cqh, 65cqw)' : 'min(90cqh, 66cqw)',
            }}
            className="relative z-20 shrink-0 w-fit rounded-[8px] sm:rounded-[11px] overflow-hidden border border-[#E5C97B]/68 bg-[#050A12] shadow-[0_14px_30px_rgba(0,0,0,0.82),0_0_16px_rgba(76,228,255,0.16)]"
          >
            <img
              src={heroSrc}
              alt={title}
              referrerPolicy="no-referrer"
              decoding="async"
              onError={() => markFailed(heroSrc)}
              className="h-full w-auto block"
            />
          </div>

          {/* Right Secondary Phone (Natural Aspect Ratio — Uncropped) */}
          {rightSrc && !failedSrcs[rightSrc] && (
            <div
              style={{
                ...antiAliasStyle,
                height: isFeatured ? 'min(74cqh, 53cqw)' : 'min(74cqh, 54cqw)',
              }}
              className={`relative shrink-0 w-fit rounded-[7px] sm:rounded-[9px] overflow-hidden border border-[#FAF6EC]/24 bg-[#050A12] shadow-[0_8px_20px_rgba(0,0,0,0.65)] opacity-88 rotate-5 origin-bottom-left transition-transform duration-300 ease-out ${
                zoomOnGroupHover ? 'group-hover:rotate-7 group-hover:translate-x-0.5' : ''
              } ${
                isFeatured
                  ? '-ml-3 sm:-ml-4 translate-y-1.5'
                  : '-ml-2 translate-y-1'
              }`}
            >
              <img
                src={rightSrc}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                decoding="async"
                onError={() => markFailed(rightSrc)}
                className="h-full w-auto block"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. DESKTOP WEB SHOWCASE (Bigger Main Screen + 3-Tier Stack + Zero Crop)
  // No top bar, zero rotation, natural aspect fit so 0 words get cut off
  // =========================================================================
  if (gallery && gallery.length >= 2) {
    const heroSrc = gallery[0]?.src ?? image;
    const midSrc = gallery[1]?.src;
    const backSrc = gallery[2]?.src;

    if (failedSrcs[heroSrc]) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#161E26] to-[#0B0E12] text-[#E5C97B]/80 p-3 text-center">
          <Code2 className="w-6 h-6 mb-1" aria-hidden="true" />
          <span className="text-xs font-medium text-[#FAF6EC]/80">
            {subtitle || title}
          </span>
        </div>
      );
    }

    const isBanetFeatured = isFeatured && title.trim().toLowerCase() === 'banet';

    return (
      <div className="relative w-full h-full overflow-hidden bg-[#060C16] flex items-center justify-center">
        {/* Soft Ambient Blurred Studio Backdrop */}
        <img
          src={heroSrc}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-30 saturate-125 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#060E1A]/65 via-[#071120]/45 to-[#040911]/88 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(76,228,255,0.12),rgba(229,201,123,0.08)_46%,transparent_75%)] pointer-events-none"
        />

        {/* 3-Tier Straight Stepped Stack — Large Presence with Clean Hover Breathing Room */}
        <div
          className={`relative z-10 w-full h-full flex flex-col items-center justify-center transition-transform duration-300 ease-out ${
            zoomOnGroupHover ? 'group-hover:scale-[1.05]' : ''
          } ${isFeatured ? 'px-1.5 py-1.5' : 'px-1.5 py-1.5'}`}
        >
          {/* Tier 3 (Back-Most Screen — Sits Flush on Tier 2) */}
          {backSrc && !failedSrcs[backSrc] && (
            <div
              className={`relative z-0 shrink-0 overflow-hidden rounded-t-[6px] border-t border-x border-[#4CE4FF]/24 bg-[#07101B] shadow-[0_-3px_12px_rgba(0,0,0,0.4)] opacity-45 transition-transform duration-300 ease-out ${
                zoomOnGroupHover ? 'group-hover:-translate-y-1' : ''
              } ${isFeatured ? 'w-[78%] h-2.5 sm:h-3 -mb-[2px]' : 'w-[69%] h-[5px] -mb-[2px]'}`}
            >
              <img
                src={backSrc}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                decoding="async"
                onError={() => markFailed(backSrc)}
                className="w-full h-full object-cover object-top"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-[#060F17]/30 to-[#050A12]/80"
              />
            </div>
          )}

          {/* Tier 2 (Middle Screen — Sits Flush Directly on Tier 1) */}
          {midSrc && !failedSrcs[midSrc] && (
            <div
              className={`relative z-10 shrink-0 overflow-hidden rounded-t-[7px] border-t border-x border-[#4CE4FF]/38 bg-[#08121E] shadow-[0_-4px_16px_rgba(0,0,0,0.5)] opacity-78 transition-transform duration-300 ease-out ${
                zoomOnGroupHover ? 'group-hover:-translate-y-0.5' : ''
              } ${isFeatured ? 'w-[90%] h-3.5 sm:h-4 -mb-[2px]' : 'w-[81%] h-[7px] -mb-[2px]'}`}
            >
              <img
                src={midSrc}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                decoding="async"
                onError={() => markFailed(midSrc)}
                className="w-full h-full object-cover object-top"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-[#060F17]/15 to-[#050A12]/70"
              />
            </div>
          )}

          {/* Tier 1 (Main Front Web Page — Just Slightly Inset on Cards for Clean Hover Motion) */}
          <div
            className={`relative z-20 shrink-0 flex justify-center ${
              isFeatured ? 'w-full max-h-[88%]' : 'w-[94%] max-h-[84%]'
            }`}
          >
            <img
              src={heroSrc}
              alt={title}
              referrerPolicy="no-referrer"
              decoding="async"
              onError={() => markFailed(heroSrc)}
              className={`${
                isBanetFeatured
                  ? 'w-full aspect-[16/9] max-h-full object-fill'
                  : 'max-w-full max-h-full w-auto h-auto'
              } block rounded-[7px] sm:rounded-[9px] border border-[#E5C97B]/65 bg-[#050A12] shadow-[0_14px_30px_rgba(0,0,0,0.88),0_0_18px_rgba(76,228,255,0.14)]`}
            />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. SINGLE LANDSCAPE COVER FALLBACK (Projects with 1 image)
  // =========================================================================
  if (failedSrcs[image]) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#161E26] to-[#0B0E12] text-[#E5C97B]/80 p-3 text-center">
        <Code2 className="w-6 h-6 mb-1" aria-hidden="true" />
        <span className="text-xs font-medium text-[#FAF6EC]/80">
          {subtitle || title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={title}
      referrerPolicy="no-referrer"
      decoding="async"
      onError={() => markFailed(image)}
      className={`w-full h-full object-cover ${
        zoomOnGroupHover ? 'transition-transform duration-300 ease-out group-hover:scale-[1.05]' : ''
      }`}
    />
  );
}
