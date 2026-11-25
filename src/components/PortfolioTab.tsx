import {
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  Maximize2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSound } from '../context/SoundContext';
import { ProjectCategory, ProjectGalleryImage, ProjectItem } from '../types/resume';
import { ProjectMediaPreview } from './ProjectMediaPreview';

interface PortfolioTabProps {
  projects: ProjectItem[];
  initialSelectedId?: string | null;
}

const PROJECT_CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'Full-Stack Web',
  'Mobile App',
  'AI & Systems',
];

const CARD_SURFACE_TONES = [
  'bg-[#0D1E2E]/72 hover:bg-[#13293D]/84',
  'bg-[#101C2B]/74 hover:bg-[#16273B]/86',
  'bg-[#0B202C]/72 hover:bg-[#112C3C]/84',
  'bg-[#131E29]/74 hover:bg-[#1A2938]/86',
];

export function PortfolioTab({ projects, initialSelectedId }: PortfolioTabProps) {
  const { playButton } = useSound();
  const [categoryFilter, setCategoryFilter] = useState<'All' | ProjectCategory>('All');
  const [filterDirection, setFilterDirection] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string>(
    initialSelectedId && projects.some((p) => p.id === initialSelectedId)
      ? initialSelectedId
      : projects[0]?.id ?? ''
  );
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [slideDir, setSlideDir] = useState<number>(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isDetailFocused, setIsDetailFocused] = useState<boolean>(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const mobileStripRef = useRef<HTMLDivElement | null>(null);
  const autoScrollPausedUntilRef = useRef<number>(0);
  const isUserTouchingRef = useRef<boolean>(false);
  const mountedAtRef = useRef<number>(typeof performance !== 'undefined' ? performance.now() : 0);

  // Sync if opened from a Featured slide targeting a specific project
  useEffect(() => {
    if (initialSelectedId && projects.some((p) => p.id === initialSelectedId)) {
      setCategoryFilter('All');
      setSelectedId(initialSelectedId);
    }
  }, [initialSelectedId, projects]);

  const filteredProjects = useMemo(() => {
    if (categoryFilter === 'All') return projects;
    return projects.filter((p) => p.category === categoryFilter);
  }, [projects, categoryFilter]);

  const shouldAutoScrollStrip = filteredProjects.length > 1;
  const mobileStripItems = useMemo(
    () => (shouldAutoScrollStrip ? [...filteredProjects, ...filteredProjects] : filteredProjects),
    [filteredProjects, shouldAutoScrollStrip]
  );

  useEffect(() => {
    if (!filteredProjects.some((p) => p.id === selectedId) && filteredProjects[0]) {
      setSelectedId(filteredProjects[0].id);
    }
  }, [filteredProjects, selectedId]);

  const selectedProject =
    filteredProjects.find((p) => p.id === selectedId) || filteredProjects[0];

  const activeGallery: ProjectGalleryImage[] = useMemo(() => {
    if (!selectedProject) return [];
    if (selectedProject.gallery && selectedProject.gallery.length > 0) {
      return selectedProject.gallery;
    }
    return [{ src: selectedProject.image, caption: selectedProject.title }];
  }, [selectedProject]);

  // Reset gallery index when switching projects
  useEffect(() => {
    setActiveSlideIdx(0);
    setSlideDir(1);
    setIsLightboxOpen(false);
  }, [selectedProject?.id]);

  // Keyboard navigation while Fullscreen Lightbox is open (capture phase so Esc closes Lightbox before Slate)
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        playButton();
        setIsLightboxOpen(false);
      } else if (event.key === 'ArrowRight' && activeGallery.length > 1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        playButton();
        setSlideDir(1);
        setActiveSlideIdx((prev) => (prev + 1) % activeGallery.length);
      } else if (event.key === 'ArrowLeft' && activeGallery.length > 1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        playButton();
        setSlideDir(-1);
        setActiveSlideIdx((prev) => (prev - 1 + activeGallery.length) % activeGallery.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isLightboxOpen, activeGallery.length, playButton]);

  // Smooth continuous auto-scroll for the mobile/tablet horizontal project strip
  useEffect(() => {
    const stripEl = mobileStripRef.current;
    if (!stripEl || !shouldAutoScrollStrip) return;

    stripEl.scrollLeft = 0;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let rafId = 0;
    let lastTime = performance.now();
    let carry = 0;
    const pixelsPerSecond = 30;

    const tick = (now: number) => {
      const dt = Math.min(0.06, (now - lastTime) / 1000);
      lastTime = now;

      // Only drive scroll when the mobile strip is visibly laid out
      if (
        stripEl.offsetParent !== null &&
        !isUserTouchingRef.current &&
        now >= autoScrollPausedUntilRef.current
      ) {
        const halfWidth = stripEl.scrollWidth / 2;
        if (halfWidth > 0) {
          carry += pixelsPerSecond * dt;
          if (carry >= 1) {
            const step = Math.floor(carry);
            carry -= step;
            let nextLeft = stripEl.scrollLeft + step;
            if (nextLeft >= halfWidth) {
              nextLeft -= halfWidth;
            }
            stripEl.scrollLeft = nextLeft;
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [categoryFilter, shouldAutoScrollStrip]);

  const pauseAutoScroll = (durationMs = 2400) => {
    autoScrollPausedUntilRef.current = performance.now() + durationMs;
  };

  const markImageFailed = (src: string) => {
    setFailedImages((prev) => ({ ...prev, [src]: true }));
  };

  const handleSelectCategory = (nextCat: 'All' | ProjectCategory) => {
    playButton();
    const prevIdx = PROJECT_CATEGORIES.indexOf(categoryFilter);
    const nextIdx = PROJECT_CATEGORIES.indexOf(nextCat);
    setFilterDirection(nextIdx >= prevIdx ? 1 : -1);
    setCategoryFilter(nextCat);
  };

  const stepGallery = (delta: -1 | 1) => {
    if (activeGallery.length <= 1) return;
    playButton();
    setSlideDir(delta);
    setActiveSlideIdx((prev) => (prev + delta + activeGallery.length) % activeGallery.length);
  };

  const jumpToSlide = (idx: number) => {
    if (idx === activeSlideIdx) return;
    playButton();
    setSlideDir(idx > activeSlideIdx ? 1 : -1);
    setActiveSlideIdx(idx);
  };

  const currentMedia = activeGallery[activeSlideIdx] ?? activeGallery[0];
  const isPortrait = selectedProject?.mediaOrientation === 'portrait';
  const hasMultipleImages = activeGallery.length > 1;

  return (
    <div className="relative space-y-4 sm:space-y-6">
      {/* Subtle Background Fade Scrim When Inspecting a Project */}
      <AnimatePresence>
        {isDetailFocused && (
          <motion.div
            key="portfolio-focus-scrim"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIsDetailFocused(false)}
            className="fixed inset-0 z-10 bg-[#02060C]/45 backdrop-blur-[1.5px] pointer-events-auto lg:pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Category Filter Bar (Clean 2x2 Wrapping on Mobile, 4-Col on sm+) */}
      <div
        className={`relative z-20 bg-[#091521]/78 backdrop-blur-md border border-[#4CE4FF]/22 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 w-full shadow-[0_10px_28px_rgba(0,0,0,0.3)] transition-opacity duration-300 ${
          isDetailFocused ? 'opacity-80 hover:opacity-100' : 'opacity-100'
        }`}
        role="tablist"
        aria-label="Project Categories"
      >
        {PROJECT_CATEGORIES.map((category) => {
          const active = categoryFilter === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleSelectCategory(category)}
              className={`w-full px-2.5 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-medium rounded-xl sm:rounded-2xl transition-all leading-tight text-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF] ${
                active
                  ? 'bg-[#E5C97B]/24 text-[#F3E3B4] border border-[#E5C97B]/65 shadow-[0_0_14px_rgba(229,201,123,0.16)]'
                  : 'bg-[#0E1E2E]/60 text-[#FAF6EC]/75 hover:text-[#FAF6EC] hover:bg-[#14293D]/80 border border-transparent'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Mobile & Tablet (< lg): Smooth Auto-Scrolling Horizontal Project Strip (No Scrollbar) */}
      <div
        className={`relative z-20 lg:hidden space-y-2.5 transition-opacity duration-300 ${
          isDetailFocused ? 'opacity-85 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <div className="flex items-baseline justify-between gap-2 px-1">
          <h2 className="font-display italic text-xl font-semibold text-[#F3E3B4]">
            Portfolio Inventory
          </h2>
          <span className="text-[11px] text-[#4CE4FF]">Tap item to inspect</span>
        </div>

        <div
          ref={mobileStripRef}
          onTouchStart={() => {
            isUserTouchingRef.current = true;
          }}
          onTouchEnd={() => {
            isUserTouchingRef.current = false;
            pauseAutoScroll(2600);
          }}
          onTouchCancel={() => {
            isUserTouchingRef.current = false;
            pauseAutoScroll(2000);
          }}
          onMouseEnter={() => {
            isUserTouchingRef.current = true;
          }}
          onMouseLeave={() => {
            isUserTouchingRef.current = false;
            pauseAutoScroll(1200);
          }}
          className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1"
        >
          {mobileStripItems.map((project, idx) => {
            const isSelected = selectedProject?.id === project.id;
            const surfaceTone = CARD_SURFACE_TONES[idx % CARD_SURFACE_TONES.length];

            return (
              <button
                key={`${project.id}-${idx}`}
                type="button"
                onClick={() => {
                  playButton();
                  pauseAutoScroll(3500);
                  setSelectedId(project.id);
                  setIsDetailFocused(true);
                }}
                aria-label={`Inspect ${project.title}`}
                aria-pressed={isSelected}
                className={`shrink-0 w-[210px] sm:w-[235px] text-left rounded-2xl p-2.5 backdrop-blur-md border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF] ${
                  isSelected
                    ? 'bg-[#152B3F]/92 border-[#F3E3B4]/85 ring-1 ring-[#4CE4FF]/35 shadow-[0_8px_22px_rgba(0,0,0,0.45)]'
                    : `${surfaceTone} border-[#FAF6EC]/14`
                }`}
              >
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#FAF6EC]/12 bg-[#071018]">
                  <ProjectMediaPreview
                    title={project.title}
                    subtitle={project.subtitle}
                    image={project.image}
                    gallery={project.gallery}
                    mediaOrientation={project.mediaOrientation}
                    variant="card"
                  />
                </div>
                <div className="mt-2">
                  <div className="text-[10px] text-[#4CE4FF] truncate">{project.category}</div>
                  <div className="text-xs font-semibold text-[#FAF6EC] mt-0.5 line-clamp-1">
                    {project.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop 2-Column Split / Mobile Active Project Inspector */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start">
        {/* Desktop Only (lg+): Full 2-Column Portfolio Inventory Grid */}
        <div
          onMouseEnter={() => {
            if (isDetailFocused) setIsDetailFocused(false);
          }}
          className={`hidden lg:block lg:col-span-6 space-y-4 transition-all duration-300 ${
            isDetailFocused ? 'opacity-60 brightness-[0.82]' : 'opacity-100 brightness-100'
          }`}
        >
          <div className="bg-[#0A1826]/72 backdrop-blur-md border border-[#4CE4FF]/20 rounded-3xl px-5 py-3.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
            <h2 className="font-display italic text-2xl font-semibold text-[#F3E3B4]">
              Portfolio Inventory
            </h2>
            <span className="text-xs text-[#4CE4FF]">Select item to inspect</span>
          </div>

          <AnimatePresence mode="wait" custom={filterDirection}>
            <motion.div
              key={categoryFilter}
              custom={filterDirection}
              initial={{ opacity: 0, x: filterDirection * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -filterDirection * 32 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-4"
            >
              {filteredProjects.map((project, idx) => {
                const isSelected = selectedProject?.id === project.id;
                const surfaceTone = CARD_SURFACE_TONES[idx % CARD_SURFACE_TONES.length];

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      playButton();
                      setSelectedId(project.id);
                      setIsDetailFocused(true);
                    }}
                    aria-label={`Inspect ${project.title}`}
                    aria-pressed={isSelected}
                    className={`group relative text-left rounded-3xl p-4 backdrop-blur-md border transition-all flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF] shadow-[0_12px_30px_rgba(0,0,0,0.34)] ${
                      isSelected
                        ? 'bg-[#152B3F]/88 border-[#F3E3B4]/80 ring-2 ring-[#4CE4FF]/25 -translate-y-0.5'
                        : `${surfaceTone} border-[#FAF6EC]/14 hover:border-[#E5C97B]/50`
                    }`}
                  >
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#FAF6EC]/14 bg-[#071018]">
                      <ProjectMediaPreview
                        title={project.title}
                        subtitle={project.subtitle}
                        image={project.image}
                        gallery={project.gallery}
                        mediaOrientation={project.mediaOrientation}
                        variant="card"
                        zoomOnGroupHover
                      />
                    </div>

                    <div className="mt-3.5">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-[#4CE4FF]">
                        <span className="truncate">{project.category}</span>
                        <span className="font-mono tabular-nums text-[#FAF6EC]/65 shrink-0">
                          {project.year}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-[#FAF6EC] mt-1 leading-snug line-clamp-1">
                        {project.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Selected Project Inspector (1 Connected Block Cleanly Separated Into Sections) */}
        <aside
          onMouseEnter={() => {
            if (performance.now() - mountedAtRef.current < 420) return;
            setIsDetailFocused(true);
          }}
          onMouseLeave={() => setIsDetailFocused(false)}
          className="relative z-30 lg:col-span-6"
        >
          <AnimatePresence mode="wait">
            {selectedProject && currentMedia ? (
              <motion.article
                key={selectedProject.id}
                initial={{ opacity: 0, y: 24, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className={`bg-[#091522]/88 backdrop-blur-md border border-[#4CE4FF]/28 rounded-2xl sm:rounded-3xl shadow-[0_14px_38px_rgba(0,0,0,0.45)] overflow-hidden divide-y divide-[#4CE4FF]/16 transition-shadow duration-300 ${
                  isDetailFocused ? 'drop-shadow-[0_22px_50px_rgba(0,0,0,0.72)]' : ''
                }`}
              >
                {/* Section 1: Project Title Header + Interactive Media Gallery */}
                <section className="p-4 sm:p-5">
                  <div className="mb-3.5 sm:mb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4CE4FF]">
                      <span>
                        {selectedProject.category} · {selectedProject.subtitle}
                      </span>
                      <span className="font-mono tabular-nums text-[#FAF6EC]/65">
                        {selectedProject.year}
                      </span>
                    </div>
                    <h3 className="font-display italic text-2xl sm:text-3xl font-semibold text-[#F3E3B4] mt-1 leading-tight">
                      {selectedProject.title}
                    </h3>
                  </div>

                  {/* Main Media Stage (Zero-Crop Natural Aspect Presentation) */}
                  <div
                    className={`relative w-full rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5C97B]/30 bg-[#050A10] flex items-center justify-center ${
                      isPortrait ? 'h-[340px] sm:h-[400px]' : 'min-h-[200px] sm:min-h-[260px]'
                    }`}
                  >
                    {/* Soft Blurred Ambient Backdrop for Portrait Phone Screens */}
                    {isPortrait && !failedImages[currentMedia.src] && (
                      <>
                        <img
                          src={currentMedia.src}
                          alt=""
                          aria-hidden="true"
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-30 saturate-125 pointer-events-none"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-b from-[#060E1A]/55 via-[#071120]/35 to-[#040911]/80 pointer-events-none"
                        />
                      </>
                    )}

                    {/* Active Screenshot Transition */}
                    <AnimatePresence mode="wait" custom={slideDir}>
                      <motion.div
                        key={`${selectedProject.id}-${activeSlideIdx}`}
                        custom={slideDir}
                        initial={{ opacity: 0, x: slideDir * 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -slideDir * 24 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={`relative z-10 w-full flex items-center justify-center ${
                          isPortrait ? 'h-full py-3 px-4' : 'w-full'
                        }`}
                      >
                        {!failedImages[currentMedia.src] ? (
                          isPortrait ? (
                            <button
                              type="button"
                              onClick={() => {
                                playButton();
                                setIsLightboxOpen(true);
                              }}
                              aria-label={`View ${currentMedia.caption || selectedProject.title} fullscreen`}
                              className="relative h-full max-h-full w-fit rounded-[14px] overflow-hidden border border-[#E5C97B]/60 bg-[#050A12] shadow-[0_14px_34px_rgba(0,0,0,0.8),0_0_20px_rgba(76,228,255,0.14)] cursor-pointer transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                            >
                              <img
                                src={currentMedia.src}
                                alt={`${selectedProject.title} — ${currentMedia.caption || 'Screenshot'}`}
                                referrerPolicy="no-referrer"
                                decoding="async"
                                onError={() => markImageFailed(currentMedia.src)}
                                className="h-full w-auto max-w-full block"
                              />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                playButton();
                                setIsLightboxOpen(true);
                              }}
                              aria-label={`View ${currentMedia.caption || selectedProject.title} fullscreen`}
                              className="w-full block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                            >
                              <img
                                src={currentMedia.src}
                                alt={`${selectedProject.title} — ${currentMedia.caption || 'Preview'}`}
                                referrerPolicy="no-referrer"
                                decoding="async"
                                onError={() => markImageFailed(currentMedia.src)}
                                className="w-full h-auto max-h-[440px] object-contain block mx-auto"
                              />
                            </button>
                          )
                        ) : (
                          <div className="w-full aspect-[16/9] flex flex-col items-center justify-center bg-gradient-to-br from-[#161E26] to-[#0B0E12] text-[#E5C97B]">
                            <Code2 className="w-8 h-8 mb-2" aria-hidden="true" />
                            <span className="text-sm font-medium text-[#FAF6EC]/80">
                              {selectedProject.title}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Unobstructed Controls Bar Below Screenshot + Thumbnail Strip */}
                  {(hasMultipleImages || !failedImages[currentMedia.src]) && (
                    <div className="mt-3 space-y-2.5">
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-[#FAF6EC]/85 truncate font-medium">
                          {hasMultipleImages
                            ? currentMedia.caption || `Screenshot ${activeSlideIdx + 1}`
                            : 'Click image to expand'}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {hasMultipleImages && (
                            <>
                              <button
                                type="button"
                                onClick={() => stepGallery(-1)}
                                aria-label="Previous screenshot"
                                className="w-7 h-7 inline-flex items-center justify-center rounded-lg bg-[#0D1E2E]/85 hover:bg-[#152D42] border border-[#4CE4FF]/30 hover:border-[#E5C97B]/75 text-[#FAF6EC] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                              >
                                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                              </button>
                              <span className="font-mono tabular-nums text-[#4CE4FF] min-w-[38px] text-center">
                                {activeSlideIdx + 1} / {activeGallery.length}
                              </span>
                              <button
                                type="button"
                                onClick={() => stepGallery(1)}
                                aria-label="Next screenshot"
                                className="w-7 h-7 inline-flex items-center justify-center rounded-lg bg-[#0D1E2E]/85 hover:bg-[#152D42] border border-[#4CE4FF]/30 hover:border-[#E5C97B]/75 text-[#FAF6EC] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                              >
                                <ChevronRight className="w-4 h-4" aria-hidden="true" />
                              </button>
                            </>
                          )}

                          {!failedImages[currentMedia.src] && (
                            <button
                              type="button"
                              onClick={() => {
                                playButton();
                                setIsLightboxOpen(true);
                              }}
                              aria-label="Expand screenshot fullscreen"
                              title="Expand fullscreen"
                              className="w-7 h-7 inline-flex items-center justify-center rounded-lg bg-[#0D1E2E]/85 hover:bg-[#152D42] border border-[#4CE4FF]/30 hover:border-[#E5C97B]/75 text-[#FAF6EC]/85 hover:text-[#F3E3B4] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                            >
                              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </div>

                      {hasMultipleImages && (
                        <div
                          className={`grid gap-2 ${
                            activeGallery.length >= 6
                              ? 'grid-cols-3 sm:grid-cols-6'
                              : activeGallery.length === 5
                                ? 'grid-cols-5'
                                : activeGallery.length === 4
                                  ? 'grid-cols-4'
                                  : activeGallery.length === 3
                                    ? 'grid-cols-3'
                                    : 'grid-cols-2'
                          }`}
                        >
                          {activeGallery.map((item, idx) => {
                            const isActiveThumb = idx === activeSlideIdx;
                            return (
                              <button
                                key={item.src}
                                type="button"
                                onClick={() => jumpToSlide(idx)}
                                aria-label={`Show ${item.caption || `screenshot ${idx + 1}`}`}
                                aria-pressed={isActiveThumb}
                                className={`relative h-12 sm:h-14 rounded-lg overflow-hidden border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF] bg-[#060D17] p-0.5 flex items-center justify-center ${
                                  isActiveThumb
                                    ? 'border-[#E5C97B] ring-1 ring-[#4CE4FF]/40 shadow-[0_0_12px_rgba(229,201,123,0.22)]'
                                    : 'border-[#FAF6EC]/15 opacity-65 hover:opacity-100 hover:border-[#FAF6EC]/40'
                                }`}
                              >
                                <img
                                  src={item.src}
                                  alt={item.caption || `Screenshot ${idx + 1}`}
                                  referrerPolicy="no-referrer"
                                  decoding="async"
                                  className={
                                    isPortrait
                                      ? 'h-full w-auto max-w-full object-contain rounded-[4px]'
                                      : 'w-full h-full object-contain rounded-[4px]'
                                  }
                                />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                </section>

                {/* Section 2: Project Overview & Key Highlights */}
                <section className="p-4 sm:p-5 bg-gradient-to-b from-[#0C1C2B]/65 to-[#091623]/55 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        aria-hidden="true"
                        className="w-1.5 h-1.5 rotate-45 bg-[#4CE4FF] shadow-[0_0_8px_rgba(76,228,255,0.85)]"
                      />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4CE4FF]/90">
                        Overview
                      </span>
                    </div>
                    <p className="text-[14px] leading-[1.65] text-[#FAF6EC]/92">
                      {selectedProject.description}
                    </p>
                  </div>

                  {selectedProject.highlights.length > 0 && (
                    <div className="pt-3.5 border-t border-[#FAF6EC]/10">
                      <ul className="space-y-2.5 text-[13.5px] leading-relaxed text-[#FAF6EC]/84">
                        {selectedProject.highlights.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span
                              aria-hidden="true"
                              className="mt-[7px] w-1.5 h-1.5 rotate-45 bg-[#E5C97B] shadow-[0_0_8px_rgba(229,201,123,0.45)] shrink-0"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>

                {/* Section 3: Technologies Used & GitHub Repo (Clean Single-Row Footer) */}
                <section className="px-4 sm:px-5 py-3.5 sm:py-4 bg-gradient-to-r from-[#07111C]/88 via-[#0A1826]/82 to-[#07111C]/88 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4CE4FF]/80 mb-1">
                      Technologies Used
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-[#F3E3B4]">
                      {selectedProject.technologies.map((tech, idx) => (
                        <span key={tech} className="inline-flex items-center gap-2">
                          {idx > 0 && (
                            <span
                              aria-hidden="true"
                              className="w-1 h-1 rounded-full bg-[#4CE4FF]/55"
                            />
                          )}
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {(selectedProject.liveUrl || selectedProject.repoUrl) && (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {selectedProject.liveUrl && (
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => playButton()}
                          className="inline-flex items-center justify-center gap-2 h-10 px-4 text-xs font-semibold text-[#0B0E12] bg-gradient-to-b from-[#F0D994] to-[#DFC06B] hover:from-[#F7E6B0] hover:to-[#EAD083] rounded-xl shadow-[0_4px_14px_rgba(229,201,123,0.26)] transition-all active:scale-[0.98] whitespace-nowrap"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>Live Demo</span>
                        </a>
                      )}
                      {selectedProject.repoUrl && (
                        <a
                          href={selectedProject.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => playButton()}
                          aria-label={`Open ${selectedProject.title} GitHub repository`}
                          className={`inline-flex items-center justify-center gap-2 h-10 px-4 text-xs rounded-xl transition-all active:scale-[0.98] whitespace-nowrap ${
                            selectedProject.liveUrl
                              ? 'font-medium text-[#FAF6EC] border border-[#FAF6EC]/25 hover:border-[#E5C97B]/65 bg-[#0C1824]/85'
                              : 'font-semibold text-[#0B0E12] bg-gradient-to-b from-[#F0D994] to-[#DFC06B] hover:from-[#F7E6B0] hover:to-[#EAD083] shadow-[0_4px_14px_rgba(229,201,123,0.26)]'
                          }`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            className={`w-4 h-4 shrink-0 ${
                              selectedProject.liveUrl ? 'text-[#E5C97B]' : 'text-[#0B0E12]'
                            }`}
                          >
                            <path d="M12 0.5C5.37 0.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58C20.57 22.3 24 17.8 24 12.5 24 5.87 18.63 0.5 12 0.5Z" />
                          </svg>
                          <span>GitHub Repo</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-75" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  )}
                </section>
              </motion.article>
            ) : (
              <motion.div
                key="empty-inspector"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#091522]/78 backdrop-blur-md border border-[#FAF6EC]/12 rounded-2xl sm:rounded-3xl p-6 text-sm text-[#FAF6EC]/65"
              >
                Select a project slot to inspect its architecture and links.
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      {/* Fullscreen High-Resolution Media Lightbox (Portaled to document.body) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isLightboxOpen && selectedProject && currentMedia && (
              <motion.div
                key="portfolio-lightbox"
                role="dialog"
                aria-modal="true"
                aria-label={`${selectedProject.title} screenshot viewer`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  playButton();
                  setIsLightboxOpen(false);
                }}
                className="fixed inset-0 z-[100] bg-[#040910]/92 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
              >
                {/* Top Bar */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-5xl flex items-center justify-between gap-4 shrink-0"
                >
                  <div className="min-w-0">
                    <div className="font-display italic text-lg sm:text-xl font-semibold text-[#F3E3B4] truncate">
                      {selectedProject.title}
                    </div>
                    <div className="text-xs text-[#FAF6EC]/75 truncate">
                      {currentMedia.caption || selectedProject.subtitle}
                      {hasMultipleImages ? ` · ${activeSlideIdx + 1} / ${activeGallery.length}` : ''}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playButton();
                      setIsLightboxOpen(false);
                    }}
                    aria-label="Close fullscreen preview"
                    className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-[#0D1E2E] hover:bg-[#163047] border border-[#E5C97B]/50 text-[#FAF6EC] transition-colors shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Main Lightbox Image Area (Smooth Fade-In & Slide-Up) */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative flex-1 min-h-0 w-full max-w-5xl my-4 flex items-center justify-center"
                >
                  {hasMultipleImages && (
                    <button
                      type="button"
                      onClick={() => stepGallery(-1)}
                      aria-label="Previous screenshot"
                      className="absolute left-0 sm:left-2 z-20 w-11 h-11 inline-flex items-center justify-center rounded-xl bg-[#091522]/90 hover:bg-[#13293D] border border-[#4CE4FF]/40 hover:border-[#E5C97B]/75 text-[#FAF6EC] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                    >
                      <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                    </button>
                  )}

                  <img
                    src={currentMedia.src}
                    alt={`${selectedProject.title} — ${currentMedia.caption || 'Screenshot'}`}
                    referrerPolicy="no-referrer"
                    className={`max-h-full max-w-[calc(100%-6rem)] sm:max-w-[calc(100%-8rem)] object-contain border border-[#E5C97B]/45 shadow-[0_24px_64px_rgba(0,0,0,0.85)] ${
                      isPortrait ? 'rounded-[20px]' : 'rounded-xl'
                    }`}
                  />

                  {hasMultipleImages && (
                    <button
                      type="button"
                      onClick={() => stepGallery(1)}
                      aria-label="Next screenshot"
                      className="absolute right-0 sm:right-2 z-20 w-11 h-11 inline-flex items-center justify-center rounded-xl bg-[#091522]/90 hover:bg-[#13293D] border border-[#4CE4FF]/40 hover:border-[#E5C97B]/75 text-[#FAF6EC] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                    >
                      <ChevronRight className="w-5 h-5" aria-hidden="true" />
                    </button>
                  )}
                </motion.div>

                {/* Bottom Thumbnail Picker */}
                {hasMultipleImages && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-wrap items-center justify-center gap-2 shrink-0 max-w-5xl"
                  >
                    {activeGallery.map((item, idx) => {
                      const isActiveThumb = idx === activeSlideIdx;
                      return (
                        <button
                          key={item.src}
                          type="button"
                          onClick={() => jumpToSlide(idx)}
                          aria-label={`View ${item.caption || `screenshot ${idx + 1}`}`}
                          className={`h-14 sm:h-16 px-1.5 py-1 rounded-lg border transition-all cursor-pointer bg-[#091522] ${
                            isActiveThumb
                              ? 'border-[#E5C97B] ring-1 ring-[#4CE4FF]/45 opacity-100'
                              : 'border-[#FAF6EC]/20 opacity-55 hover:opacity-95'
                          }`}
                        >
                          <img
                            src={item.src}
                            alt={item.caption || `Screenshot ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="h-full w-auto max-w-[84px] object-contain rounded-[4px]"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
