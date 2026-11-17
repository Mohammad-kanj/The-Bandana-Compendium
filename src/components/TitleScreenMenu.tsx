import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ASSETS } from '../data/defaultResume';
import { MenuSectionId, ResumeData } from '../types/resume';
import { smoothScrollToId } from '../utils/smoothScroll';
import { AbstractAmbientBackdrop } from './AbstractAmbientBackdrop';
import { HerosPathSection } from './HerosPathSection';
import { KorokNode } from './KorokNode';
import { SheikahSlateFrame } from './SheikahSlateFrame';

interface TitleScreenMenuProps {
  data: ResumeData;
  introActive?: boolean;
  onSelectSection: (section: MenuSectionId) => void;
}

type MainMenuAction =
  | { kind: 'tab'; id: MenuSectionId; label: string }
  | { kind: 'scroll'; targetId: 'heros-path' | 'contact'; label: string };

const TITLE_MENU_ITEMS: MainMenuAction[] = [
  { kind: 'tab', id: 'adventure', label: 'Adventure Log' },
  { kind: 'tab', id: 'skills', label: 'Skill Tree' },
  { kind: 'tab', id: 'portfolio', label: 'Portfolio' },
  { kind: 'scroll', targetId: 'heros-path', label: "Hero's Path" },
  { kind: 'scroll', targetId: 'contact', label: 'Contact' },
];

interface FeaturedSlide {
  id: string;
  kicker: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  ctaLabel: string;
  targetTab: MenuSectionId;
}

function BotWPointer({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center shrink-0 transition-opacity duration-150 ${
        active ? 'opacity-100 botw-pointer-active' : 'opacity-0'
      }`}
    >
      <svg
        viewBox="0 0 28 16"
        className="w-6 h-3.5 text-[#FFF5D6] drop-shadow-[0_0_8px_rgba(243,227,180,0.95)]"
        fill="none"
      >
        <path
          d="M2 8H13M13 8L18.5 3.5L25 8L18.5 12.5L13 8Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M18.5 5.2L22.6 8L18.5 10.8L15.4 8L18.5 5.2Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

const card3DVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? 64 : -64,
    scale: 0.89,
    rotateY: dir >= 0 ? 15 : -15,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotateY: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? -64 : 64,
    scale: 0.9,
    rotateY: dir >= 0 ? -15 : 15,
  }),
};

export function TitleScreenMenu({
  data,
  introActive = false,
  onSelectSection,
}: TitleScreenMenuProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [slideState, setSlideState] = useState<{ index: number; direction: number }>({
    index: 0,
    direction: 1,
  });
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const [slideImgErrors, setSlideImgErrors] = useState<Record<string, boolean>>({});

  const featuredSlides: FeaturedSlide[] = [
    {
      id: 'feat-top100',
      kicker: 'Featured Project · Full-Stack Web',
      title: data.projects[0]?.title ?? '"Top 100" — Multiplayer Web Trivia Game',
      description:
        data.projects[0]?.description ??
        'Interactive multiplayer browser trivia game with real-time leaderboards and asynchronous FastAPI room scoring.',
      tags: data.projects[0]?.technologies ?? ['React', 'TypeScript', 'Python', 'FastAPI'],
      image: ASSETS.webappPreview,
      ctaLabel: 'Inspect in Portfolio',
      targetTab: 'portfolio',
    },
    {
      id: 'feat-fraudcheck',
      kicker: 'Featured Project · Cross-Platform Mobile',
      title: data.projects[1]?.title ?? '"Fraud Check" — Social Deduction Mobile Game',
      description:
        data.projects[1]?.description ??
        'Cross-platform English social deduction party game engineered in Flutter and Dart for Android & iOS.',
      tags: data.projects[1]?.technologies ?? ['Flutter', 'Dart', 'Android', 'iOS'],
      image: ASSETS.systemsPreview,
      ctaLabel: 'Inspect in Portfolio',
      targetTab: 'portfolio',
    },
    {
      id: 'feat-placeholder-ai',
      kicker: 'Featured Placeholder · AI Engineering',
      title: '[Featured Placeholder] · AI & Systems Showcase',
      description:
        'Reserved highlight slot for your upcoming AI architecture project, live demo, or technical deep-dive.',
      tags: ['Python', 'RAG', 'LoRa & Edge', 'Placeholder'],
      image: ASSETS.compilerPreview,
      ctaLabel: 'Open Skill Tree',
      targetTab: 'skills',
    },
    {
      id: 'feat-placeholder-media',
      kicker: 'Featured Placeholder · Media & Content',
      title: '[Featured Placeholder] · Creative Tools & Channel',
      description:
        'Showcase space for Filmcraft video edits, Photocraft visuals, or your upcoming technology & programming channel.',
      tags: ['Filmcraft', 'Photocraft', 'Technical Writing'],
      image: ASSETS.systemsPreview,
      ctaLabel: 'Open Adventure Log',
      targetTab: 'adventure',
    },
  ];

  const activateMenuItem = (item: MainMenuAction) => {
    if (item.kind === 'tab') {
      onSelectSection(item.id);
    } else {
      smoothScrollToId(item.targetId, 1350);
    }
  };

  // Auto-advance Featured slider smoothly
  useEffect(() => {
    if (isSliderPaused) return;
    const timer = window.setInterval(() => {
      setSlideState((prev) => ({
        index: (prev.index + 1) % featuredSlides.length,
        direction: 1,
      }));
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isSliderPaused, featuredSlides.length]);

  // Title menu keyboard navigation scoped to top fold
  useEffect(() => {
    if (introActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (window.scrollY > window.innerHeight * 0.45) return;

      if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % TITLE_MENU_ITEMS.length);
      } else if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        setFocusedIndex(
          (prev) => (prev - 1 + TITLE_MENU_ITEMS.length) % TITLE_MENU_ITEMS.length
        );
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setSlideState((prev) => ({
          index: (prev.index - 1 + featuredSlides.length) % featuredSlides.length,
          direction: -1,
        }));
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setSlideState((prev) => ({
          index: (prev.index + 1) % featuredSlides.length,
          direction: 1,
        }));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        activateMenuItem(TITLE_MENU_ITEMS[focusedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, featuredSlides.length, introActive]);

  const stepSlide = (direction: -1 | 1) => {
    setSlideState((prev) => ({
      index: (prev.index + direction + featuredSlides.length) % featuredSlides.length,
      direction,
    }));
  };

  const currentSlide = featuredSlides[slideState.index];
  const imgBroken = slideImgErrors[currentSlide.id];

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate w-full overflow-x-hidden text-[#FAF6EC] select-none print:hidden">
        {/* Continuous Sun-to-Twilight Ambient Canvas spanning Title Fold + Hero's Path + Contact */}
        <AbstractAmbientBackdrop variant="title" />

        {/* TOP FOLD: 5-Item Menu + Sheikah Slate */}
        <div className="relative z-10 min-h-screen w-full flex flex-col justify-center">

          {/* Primary Menu & Compact Sheikah Slate Showcase */}
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-8 py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
            {/* Left Column: Single-Line Name + Golden Nugget Divider + Subtitle + 5-Item Menu */}
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-[320px] xl:w-[350px] shrink-0"
            >
              <div className="mb-9">
                <h1
                  className="font-display italic font-semibold text-[#FAF6EC] leading-[1.04] whitespace-nowrap drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]"
                  style={{ fontSize: 'clamp(2.15rem, 3.1vw, 3.05rem)' }}
                >
                  {data.profile.displayName}
                </h1>

                {/* Classic Golden Korok Nugget Divider (Hover to Shake) */}
                <div className="flex items-center gap-3 my-3 max-w-[260px]">
                  <span className="h-[1px] flex-1 bg-gradient-to-r from-[#F3E3B4]/85 to-[#F3E3B4]/20" />
                  <KorokNode
                    korokId="korok-top-crest"
                    variantIndex={0}
                    size="sm"
                    appearance="seed"
                    borderColor="rgba(162, 194, 166, 0.85)"
                    surfaceColor="rgba(86, 120, 108, 0.42)"
                    label="Golden Korok Seed"
                  />
                  <span className="h-[1px] flex-1 bg-gradient-to-l from-[#F3E3B4]/85 to-[#F3E3B4]/20" />
                </div>

                <p className="text-xs sm:text-sm text-[#FAF6EC]/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)]">
                  AI Engineering · Flutter &amp; Full-Stack
                </p>
              </div>

              {/* Vertical 5-Item BotW Menu */}
              <nav aria-label="Main Menu" className="space-y-1">
                {TITLE_MENU_ITEMS.map((item, idx) => {
                  const isFocused = idx === focusedIndex;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onMouseEnter={() => setFocusedIndex(idx)}
                      onFocus={() => setFocusedIndex(idx)}
                      onClick={() => activateMenuItem(item)}
                      className="group flex items-center gap-2.5 w-full text-left py-2 pr-3 cursor-pointer focus:outline-none"
                    >
                      <BotWPointer active={isFocused} />
                      <span
                        className={`font-display italic text-[25px] sm:text-[27px] font-semibold tracking-wide leading-tight transition-all duration-150 ${
                          isFocused
                            ? 'text-[#FFF7DF] drop-shadow-[0_0_14px_rgba(243,227,180,0.75)] translate-x-0.5'
                            : 'text-[#FAF6EC]/82 group-hover:text-[#FAF6EC] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>

            {/* Sheikah Slate Featured Slider */}
            <motion.section
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Featured Showcase"
              onMouseEnter={() => setIsSliderPaused(true)}
              onMouseLeave={() => setIsSliderPaused(false)}
              className="w-full lg:flex-1 lg:max-w-[780px] xl:max-w-[820px] min-w-0"
            >
              <SheikahSlateFrame>
                <div className="px-5 py-3 border-b border-[#4CE4FF]/22 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="w-2 h-2 rotate-45 bg-[#4CE4FF] shadow-[0_0_8px_rgba(76,228,255,0.85)]"
                    />
                    <span className="font-display italic text-xl sm:text-2xl font-semibold text-[#E8F9FF] tracking-wide">
                      Featured
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => stepSlide(-1)}
                      aria-label="Previous featured item"
                      className="p-1.5 rounded-sm border border-[#4CE4FF]/35 hover:border-[#4CE4FF] text-[#B8F2FF] hover:text-white bg-[#0A1622]/80 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepSlide(1)}
                      aria-label="Next featured item"
                      className="p-1.5 rounded-sm border border-[#4CE4FF]/35 hover:border-[#4CE4FF] text-[#B8F2FF] hover:text-white bg-[#0A1622]/80 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                    >
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* 3D Perspective Stage */}
                <div
                  className="p-4 sm:p-6 overflow-hidden"
                  style={{ perspective: '1400px' }}
                >
                  <AnimatePresence mode="wait" custom={slideState.direction}>
                    <motion.div
                      key={currentSlide.id}
                      custom={slideState.direction}
                      variants={card3DVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: 0.42,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{ transformStyle: 'preserve-3d' }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch"
                    >
                      <div className="md:col-span-6 relative aspect-[16/10] md:aspect-auto md:min-h-[250px] lg:min-h-[275px] rounded-sm overflow-hidden border border-[#4CE4FF]/35 bg-[#040A10]">
                        {!imgBroken ? (
                          <img
                            src={currentSlide.image}
                            alt={currentSlide.title}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setSlideImgErrors((prev) => ({
                                ...prev,
                                [currentSlide.id]: true,
                              }))
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0F202E] to-[#060D14] text-[#4CE4FF]/80 text-sm px-4 text-center">
                            {currentSlide.title}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060F17]/70 via-transparent to-transparent" />
                      </div>

                      <div className="md:col-span-6 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="text-xs font-medium text-[#4CE4FF]">
                            {currentSlide.kicker}
                          </div>
                          <h2 className="font-display italic text-2xl font-semibold text-[#FAF6EC] mt-1.5 leading-snug">
                            {currentSlide.title}
                          </h2>
                          <p className="mt-2.5 text-sm leading-relaxed text-[#FAF6EC]/85">
                            {currentSlide.description}
                          </p>
                        </div>

                        <div className="mt-5 pt-3.5 border-t border-[#4CE4FF]/20 space-y-3.5">
                          <div className="text-xs text-[#B8F2FF]/80 leading-relaxed">
                            {currentSlide.tags.join(' · ')}
                          </div>
                          <button
                            type="button"
                            onClick={() => onSelectSection(currentSlide.targetTab)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#061018] bg-[#4CE4FF] hover:bg-[#9AF0FF] rounded-sm shadow-[0_0_14px_rgba(76,228,255,0.35)] transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E3B4]"
                          >
                            <span>{currentSlide.ctaLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </SheikahSlateFrame>
            </motion.section>
          </div>
        </div>

        {/* BELOW FOLD: Hero's Path + Contact */}
        <HerosPathSection experiences={data.experiences} profile={data.profile} />
      </div>
    </MotionConfig>
  );
}
