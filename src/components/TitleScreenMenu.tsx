import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useSound } from '../context/SoundContext';
import { ASSETS } from '../data/defaultResume';
import { MenuSectionId, ResumeData } from '../types/resume';
import { smoothScrollToId } from '../utils/smoothScroll';
import { HerosPathSection } from './HerosPathSection';
import { KorokNode } from './KorokNode';
import { PortfolioTab } from './PortfolioTab';
import { SheikahSlateFrame } from './SheikahSlateFrame';
import { SkillTreeTab } from './SkillTreeTab';
import { SummaryTab } from './SummaryTab';
import { MENU_TABS } from './TopNavBar';

interface TitleScreenMenuProps {
  data: ResumeData;
  introActive?: boolean;
  activeTab: MenuSectionId | null;
  tabDirection: number;
  onSelectSection: (section: MenuSectionId) => void;
  onStepTab: (direction: -1 | 1) => void;
  onBackToTitle: () => void;
  onPrint: () => void;
}

type MainMenuAction =
  | { kind: 'tab'; id: MenuSectionId; label: string }
  | { kind: 'scroll'; targetId: 'heros-path' | 'contact'; label: string };

const TITLE_MENU_ITEMS: MainMenuAction[] = [
  { kind: 'tab', id: 'adventure', label: 'Overview' },
  { kind: 'tab', id: 'skills', label: 'Skill Tree' },
  { kind: 'tab', id: 'portfolio', label: 'Portfolio' },
  { kind: 'scroll', targetId: 'heros-path', label: "Hero's Path" },
  { kind: 'scroll', targetId: 'contact', label: 'Contact' },
];

const RELAXED_EASE = [0.22, 1, 0.36, 1] as const;

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

const tabSlideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? 48 : -48,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? -48 : 48,
  }),
};

export function TitleScreenMenu({
  data,
  introActive = false,
  activeTab,
  tabDirection,
  onSelectSection,
  onStepTab,
  onBackToTitle,
  onPrint,
}: TitleScreenMenuProps) {
  const { playNav, playButton, playMenuHoverClick } = useSound();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [slideState, setSlideState] = useState<{ index: number; direction: number }>({
    index: 0,
    direction: 1,
  });
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const [slideImgErrors, setSlideImgErrors] = useState<Record<string, boolean>>({});
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  const [renderedTab, setRenderedTab] = useState<MenuSectionId | null>(activeTab);
  const slateScrollRef = useRef<HTMLDivElement | null>(null);

  const isExpanded = activeTab !== null;
  // Smooth px-to-px maxWidth interpolation without colliding with Left Column on 1024-1380px screens
  const compactMaxWidth = isDesktop
    ? Math.max(500, Math.min(820, Math.round(viewportWidth * 0.92 - 410)))
    : 960;
  // Taller, more comfortable reading proportion for the expanded Sheikah Slate (centered smoothly on desktop)
  const expandedMaxWidth = 1120;
  const containerInnerWidth = Math.min(Math.round(viewportWidth * 0.92), 1380) - 32;
  const expandedMarginRight = isDesktop
    ? Math.max(0, Math.round((containerInnerWidth - expandedMaxWidth) / 2))
    : 0;

  useEffect(() => {
    if (activeTab !== null) {
      setRenderedTab(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    const mqDesktop = window.matchMedia('(min-width: 1024px)');
    const updateMedia = () => {
      setIsDesktop(mqDesktop.matches);
      setViewportWidth(window.innerWidth);
    };
    updateMedia();
    mqDesktop.addEventListener('change', updateMedia);
    window.addEventListener('resize', updateMedia);
    return () => {
      mqDesktop.removeEventListener('change', updateMedia);
      window.removeEventListener('resize', updateMedia);
    };
  }, []);

  // Scroll viewport to top cleanly when opening or switching Slate tabs
  useEffect(() => {
    if (activeTab !== null) {
      slateScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
      if (window.scrollY > 12) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [activeTab]);

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
      id: 'feat-family-feud',
      kicker: 'Featured Project · Live Game Host',
      title: data.projects[3]?.title ?? 'Family Feud Control Board',
      description:
        data.projects[3]?.description ??
        'Interactive host control board and live scoreboard display for Family Feud rounds, strike tracking, and team scoring.',
      tags: data.projects[3]?.technologies ?? ['React', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
      image: ASSETS.webappPreview,
      ctaLabel: 'Inspect in Portfolio',
      targetTab: 'portfolio',
    },
    {
      id: 'feat-banet',
      kicker: 'Featured Project · Network & Systems',
      title: data.projects[4]?.title ?? 'Internet Speed Tester (Banet)',
      description:
        data.projects[4]?.description ??
        'Network diagnostics and bandwidth testing application measuring download/upload throughput and ping latency in real time.',
      tags: data.projects[4]?.technologies ?? ['Python', 'Networking', 'Latency & Throughput', 'Web UI'],
      image: ASSETS.compilerPreview,
      ctaLabel: 'Inspect in Portfolio',
      targetTab: 'portfolio',
    },
  ];

  const activateMenuItem = (item: MainMenuAction) => {
    if (item.kind === 'tab') {
      onSelectSection(item.id);
    } else {
      playNav();
      smoothScrollToId(item.targetId, 1350);
    }
  };

  // Auto-advance Featured slider only when Slate is in compact Featured mode
  useEffect(() => {
    if (isSliderPaused || isExpanded) return;
    const timer = window.setInterval(() => {
      setSlideState((prev) => ({
        index: (prev.index + 1) % featuredSlides.length,
        direction: 1,
      }));
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isSliderPaused, isExpanded, featuredSlides.length]);

  // Title menu keyboard navigation scoped to collapsed top fold
  useEffect(() => {
    if (introActive || isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (window.scrollY > window.innerHeight * 0.45) return;

      if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
        event.preventDefault();
        playMenuHoverClick();
        setFocusedIndex((prev) => (prev + 1) % TITLE_MENU_ITEMS.length);
      } else if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        playMenuHoverClick();
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
  }, [focusedIndex, featuredSlides.length, introActive, isExpanded, playMenuHoverClick]);

  const stepSlide = (direction: -1 | 1, userTriggered = false) => {
    if (userTriggered) playButton();
    setSlideState((prev) => ({
      index: (prev.index + direction + featuredSlides.length) % featuredSlides.length,
      direction,
    }));
  };

  const currentSlide = featuredSlides[slideState.index];
  const imgBroken = slideImgErrors[currentSlide.id];
  const displayTab = activeTab ?? renderedTab;

  const activeTabLabel =
    MENU_TABS.find((t) => t.id === (activeTab ?? renderedTab))?.label ?? 'Overview';

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`relative z-10 w-full overflow-x-hidden text-[#FAF6EC] select-none print:hidden ${
          isExpanded ? 'h-[100dvh] overflow-y-hidden' : ''
        }`}
      >
        {/* ===================================================================== */}
        {/* MOBILE & TABLET (< 1024px): Native-Feeling Responsive Layout          */}
        {/* ===================================================================== */}
        <div className="lg:hidden relative z-10 w-full">
          {/* Mobile Title Screen + Auto-Height Featured Showcase */}
          <div
            aria-hidden={isExpanded}
            className={`w-full max-w-2xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6 transition-opacity duration-300 ${
              isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            {/* Centered Mobile Hero Header */}
            <header className="text-center mb-7">
              <h1 className="font-display italic font-semibold text-4xl sm:text-5xl text-[#FAF6EC] leading-[1.06] drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
                {data.profile.displayName}
              </h1>

              <div className="flex items-center justify-center gap-3 my-3.5 max-w-[240px] mx-auto">
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#F3E3B4]/70 to-[#F3E3B4]/30" />
                <KorokNode
                  korokId="korok-top-crest"
                  variantIndex={0}
                  size="sm"
                  appearance="seed"
                  borderColor="rgba(162, 194, 166, 0.85)"
                  surfaceColor="rgba(86, 120, 108, 0.42)"
                  label="Golden Korok Seed"
                />
                <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#F3E3B4]/70 to-[#F3E3B4]/30" />
              </div>

              <p className="text-xs sm:text-sm text-[#FAF6EC]/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)]">
                AI Engineering · Flutter &amp; Full-Stack
              </p>
            </header>

            {/* Touch-Friendly Mobile BotW Navigation Menu */}
            <nav aria-label="Main Menu" data-silent-hover="true" className="space-y-2.5 mb-7">
              {TITLE_MENU_ITEMS.map((item, idx) => {
                const isFocused = idx === focusedIndex;
                return (
                  <button
                    key={item.label}
                    type="button"
                    tabIndex={isExpanded ? -1 : 0}
                    onClick={() => {
                      setFocusedIndex(idx);
                      activateMenuItem(item);
                    }}
                    className={`w-full min-h-[52px] px-4 py-3 rounded-lg backdrop-blur-md border flex items-center justify-between gap-3 transition-all active:scale-[0.99] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF] ${
                      isFocused
                        ? 'bg-[#0C1C2B]/86 border-[#F3E3B4]/65 shadow-[0_8px_24px_rgba(0,0,0,0.45),0_0_16px_rgba(243,227,180,0.16)]'
                        : 'bg-[#07121C]/78 border-[#F3E3B4]/22 hover:border-[#F3E3B4]/50 shadow-[0_6px_18px_rgba(0,0,0,0.38)]'
                    }`}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`w-2 h-2 rotate-45 transition-colors ${
                          isFocused
                            ? 'bg-[#F3E3B4] shadow-[0_0_8px_rgba(243,227,180,0.9)]'
                            : 'bg-[#4CE4FF]/70'
                        }`}
                      />
                      <span className="font-display italic text-[22px] sm:text-2xl font-semibold text-[#FFF7DF] tracking-wide leading-none">
                        {item.label}
                      </span>
                    </span>
                    <ChevronRight
                      className="w-4 h-4 text-[#F3E3B4]/75 shrink-0"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </nav>

            {/* Auto-Height Mobile Featured Showcase Card (Zero Text or Button Clipping) */}
            <section
              aria-label="Featured Showcase"
              className="relative rounded-xl bg-[#071018]/90 backdrop-blur-md border border-[#4CE4FF]/50 shadow-[0_18px_46px_rgba(0,0,0,0.65),inset_0_0_24px_rgba(76,228,255,0.12)] overflow-hidden"
            >
              {/* Subtle Corner Reticles */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#4CE4FF]/70 z-20"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#4CE4FF]/70 z-20"
              />

              {/* Featured Header */}
              <div className="px-4 py-3 border-b border-[#4CE4FF]/22 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="w-2 h-2 rotate-45 bg-[#4CE4FF] shadow-[0_0_8px_rgba(76,228,255,0.85)]"
                  />
                  <span className="font-display italic text-xl font-semibold text-[#E8F9FF] tracking-wide">
                    Featured
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    tabIndex={isExpanded ? -1 : 0}
                    onClick={() => stepSlide(-1, true)}
                    aria-label="Previous featured item"
                    className="w-9 h-9 inline-flex items-center justify-center rounded-sm border border-[#4CE4FF]/35 hover:border-[#4CE4FF] text-[#B8F2FF] bg-[#0A1622]/85 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    tabIndex={isExpanded ? -1 : 0}
                    onClick={() => stepSlide(1, true)}
                    aria-label="Next featured item"
                    className="w-9 h-9 inline-flex items-center justify-center rounded-sm border border-[#4CE4FF]/35 hover:border-[#4CE4FF] text-[#B8F2FF] bg-[#0A1622]/85 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Featured Slide Content (Same 3D Perspective Motion as Desktop) */}
              <div
                className="p-4 overflow-hidden"
                style={{ perspective: '1400px' }}
                onTouchStart={() => setIsSliderPaused(true)}
                onTouchEnd={() => setIsSliderPaused(false)}
              >
                <AnimatePresence mode="wait" custom={slideState.direction}>
                  <motion.div
                    key={`mobile-${currentSlide.id}`}
                    custom={slideState.direction}
                    variants={card3DVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.42,
                      ease: RELAXED_EASE,
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="space-y-3.5"
                  >
                    <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden border border-[#4CE4FF]/30 bg-[#040A10]">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060F17]/65 via-transparent to-transparent" />
                    </div>

                    <div>
                      <div className="text-xs font-medium text-[#4CE4FF]">
                        {currentSlide.kicker}
                      </div>
                      <h2 className="font-display italic text-2xl font-semibold text-[#FAF6EC] mt-1 leading-snug">
                        {currentSlide.title}
                      </h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#FAF6EC]/85">
                        {currentSlide.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#4CE4FF]/20 space-y-3">
                      <div className="text-xs text-[#B8F2FF]/80 leading-relaxed">
                        {currentSlide.tags.join(' · ')}
                      </div>
                      <button
                        type="button"
                        tabIndex={isExpanded ? -1 : 0}
                        onClick={() => onSelectSection(currentSlide.targetTab)}
                        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#061018] bg-[#4CE4FF] hover:bg-[#9AF0FF] rounded-md shadow-[0_0_14px_rgba(76,228,255,0.32)] transition-colors cursor-pointer"
                      >
                        <span>{currentSlide.ctaLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>
          </div>

          {/* Mobile & Tablet Full-Bleed Edge-to-Edge Sheikah Slate Workspace */}
          <AnimatePresence>
            {isExpanded && (
              <motion.section
                key="mobile-sheikah-workspace"
                aria-label="Sheikah Slate Workspace"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                transition={{ duration: 0.3, ease: RELAXED_EASE }}
                className="fixed inset-0 z-30 flex flex-col bg-[#060F17]/95 backdrop-blur-md"
              >
                {/* Glowing Cyan Top Hairline */}
                <div
                  aria-hidden="true"
                  className="h-[2px] w-full shrink-0 bg-gradient-to-r from-[#4CE4FF]/20 via-[#4CE4FF] to-[#4CE4FF]/20 shadow-[0_0_12px_rgba(76,228,255,0.8)]"
                />

                {/* Sticky 2-Row Mobile Slate Header */}
                <header className="shrink-0 bg-[#07121C]/96 border-b border-[#4CE4FF]/25">
                  {/* Row 1: Back Button + Active Title + Conditional Print */}
                  <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={onBackToTitle}
                      aria-label="Return to Main Menu"
                      className="inline-flex items-center justify-center h-9 px-3 text-xs font-semibold text-[#0B0E12] bg-[#E5C97B] hover:bg-[#F3E3B4] rounded-sm transition-colors shrink-0 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    </button>

                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        aria-hidden="true"
                        className="w-1.5 h-1.5 rotate-45 bg-[#4CE4FF] shadow-[0_0_8px_rgba(76,228,255,0.9)] shrink-0"
                      />
                      <span className="font-display italic text-xl font-semibold text-[#F3E3B4] truncate">
                        {activeTabLabel}
                      </span>
                    </div>

                    <div className="min-w-[40px] flex items-center justify-end shrink-0">
                      <AnimatePresence mode="wait">
                        {activeTab === 'adventure' && (
                          <motion.a
                            key="mobile-print-btn"
                            href={ASSETS.resumeCvPdf}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => playButton()}
                            aria-label="Print Resume (PDF)"
                            initial={{ opacity: 0, scale: 0.88, y: -4, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.9, y: -4, filter: 'blur(3px)' }}
                            transition={{ duration: 0.34, ease: RELAXED_EASE }}
                            className="inline-flex items-center justify-center gap-1.5 h-9 px-3 text-xs font-semibold text-[#0B0E12] bg-[#E5C97B] hover:bg-[#F3E3B4] rounded-sm shadow-[0_0_14px_rgba(229,201,123,0.35)] transition-colors shrink-0 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                            <span className="hidden sm:inline">Print Resume</span>
                          </motion.a>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Row 2: Full-Width 3-Tab Segmented Switcher */}
                  <nav
                    aria-label="Sheikah Slate Sections"
                    className="px-3.5 pb-2.5 grid grid-cols-3 gap-1.5"
                  >
                    {MENU_TABS.map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => onSelectSection(tab.id)}
                          aria-current={isActive ? 'page' : undefined}
                          className={`min-h-[38px] px-2 py-1.5 rounded-sm text-xs sm:text-sm font-medium transition-all text-center whitespace-nowrap cursor-pointer ${
                            isActive
                              ? 'bg-[#4CE4FF]/18 text-[#F3E3B4] border border-[#4CE4FF]/65 shadow-[0_0_12px_rgba(76,228,255,0.2)]'
                              : 'bg-[#0A1826]/70 text-[#FAF6EC]/75 border border-[#4CE4FF]/15 hover:text-[#FAF6EC]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </header>

                {/* Edge-to-Edge Scrollable Mobile Workspace Body */}
                <div
                  ref={!isDesktop ? slateScrollRef : undefined}
                  className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 sm:px-6 py-4 pb-20"
                >
                  {displayTab !== null && (
                    <AnimatePresence mode="wait" custom={tabDirection}>
                      <motion.div
                        key={`mobile-tab-${displayTab}`}
                        custom={tabDirection}
                        variants={tabSlideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.24, ease: RELAXED_EASE }}
                      >
                        {displayTab === 'adventure' && <SummaryTab data={data} />}
                        {displayTab === 'skills' && <SkillTreeTab skills={data.skills} />}
                        {displayTab === 'portfolio' && (
                          <PortfolioTab projects={data.projects} />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* ===================================================================== */}
        {/* DESKTOP (>= 1024px): Original Single-Container Expanding Sheikah Slate */}
        {/* ===================================================================== */}
        <div className="hidden lg:flex relative z-10 w-full min-h-[100dvh] flex-col justify-center">
          <div className="relative z-10 w-[92vw] max-w-[1380px] mx-auto px-4 min-h-[100dvh] py-4 flex flex-row items-center justify-end">
            {/* Left Column: Releases Pointer Events Immediately When Slate Expands */}
            <div
              className={`w-[350px] absolute left-4 top-1/2 -translate-y-1/2 shrink-0 ${
                isExpanded ? 'pointer-events-none z-0' : 'z-20'
              }`}
            >
              <motion.div
                initial={false}
                animate={{
                  opacity: isExpanded ? 0 : 1,
                  x: isExpanded ? -20 : 0,
                }}
                transition={{
                  duration: 0.42,
                  delay: isExpanded ? 0 : 0.08,
                  ease: RELAXED_EASE,
                }}
                style={{
                  overflow: 'visible',
                  pointerEvents: isExpanded ? 'none' : 'auto',
                }}
                aria-hidden={isExpanded}
                className="w-[350px]"
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

                  <p className="text-sm text-[#FAF6EC]/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)]">
                    AI Engineering · Flutter &amp; Full-Stack
                  </p>
                </div>

                {/* Vertical 5-Item BotW Menu (Crisp Little Click on Hover) */}
                <nav aria-label="Main Menu" data-silent-hover="true" className="space-y-1">
                  {TITLE_MENU_ITEMS.map((item, idx) => {
                    const isFocused = idx === focusedIndex;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        tabIndex={isExpanded ? -1 : 0}
                        onMouseEnter={() => {
                          playMenuHoverClick();
                          setFocusedIndex(idx);
                        }}
                        onFocus={() => setFocusedIndex(idx)}
                        onClick={() => activateMenuItem(item)}
                        className="group flex items-center gap-2.5 w-full text-left py-2 pr-3 cursor-pointer focus:outline-none"
                      >
                        <BotWPointer active={isFocused} />
                        <span
                          className={`font-display italic text-[27px] font-semibold tracking-wide leading-tight transition-all duration-150 ${
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
            </div>

            {/* Single Persistent Sheikah Slate Container: Direct CSS Height & Max-Width Transition */}
            <section
              aria-label={isExpanded ? 'Sheikah Slate Workspace' : 'Featured Showcase'}
              onMouseEnter={() => setIsSliderPaused(true)}
              onMouseLeave={() => setIsSliderPaused(false)}
              style={{
                width: '100%',
                height: isExpanded ? '92dvh' : '460px',
                maxWidth: isExpanded ? `${expandedMaxWidth}px` : `${compactMaxWidth}px`,
                marginRight: isExpanded ? `${expandedMarginRight}px` : '0px',
                transition:
                  'height 450ms cubic-bezier(0.22, 1, 0.36, 1), max-width 450ms cubic-bezier(0.22, 1, 0.36, 1), margin-right 450ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className={`relative ml-auto min-w-0 ${isExpanded ? 'z-30' : 'z-10'}`}
            >
              <SheikahSlateFrame isExpanded={isExpanded}>
                {/* Slate Header Bar: Fixed Single-Row Height, Pure Opacity Crossfade */}
                <div className="relative h-[56px] shrink-0 border-b border-[#4CE4FF]/22">
                  {/* Featured Header Layer */}
                  <div
                    aria-hidden={isExpanded}
                    className={`absolute inset-0 px-5 flex items-center justify-between gap-3 transition-opacity duration-300 ease-out ${
                      isExpanded
                        ? 'opacity-0 pointer-events-none'
                        : 'opacity-100 delay-100 z-10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className="w-2 h-2 rotate-45 bg-[#4CE4FF] shadow-[0_0_8px_rgba(76,228,255,0.85)]"
                      />
                      <span className="font-display italic text-2xl font-semibold text-[#E8F9FF] tracking-wide">
                        Featured
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        tabIndex={isExpanded ? -1 : 0}
                        onClick={() => stepSlide(-1, true)}
                        aria-label="Previous featured item"
                        className="p-1.5 rounded-sm border border-[#4CE4FF]/35 hover:border-[#4CE4FF] text-[#B8F2FF] hover:text-white bg-[#0A1622]/80 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                      >
                        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        tabIndex={isExpanded ? -1 : 0}
                        onClick={() => stepSlide(1, true)}
                        aria-label="Next featured item"
                        className="p-1.5 rounded-sm border border-[#4CE4FF]/35 hover:border-[#4CE4FF] text-[#B8F2FF] hover:text-white bg-[#0A1622]/80 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                      >
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Header Layer */}
                  <div
                    aria-hidden={!isExpanded}
                    className={`absolute inset-0 px-5 flex items-center justify-between gap-2 transition-opacity duration-300 ease-out ${
                      isExpanded
                        ? 'opacity-100 delay-100 z-10'
                        : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {/* Back to Title Menu (Icon-Only, Matches Print Resume Height & Gold Color) */}
                    <button
                      type="button"
                      tabIndex={isExpanded ? 0 : -1}
                      onClick={onBackToTitle}
                      aria-label="Return to Main Menu"
                      className="inline-flex items-center justify-center h-8 px-2.5 text-xs font-semibold tracking-wide text-[#0B0E12] bg-[#E5C97B] hover:bg-[#F3E3B4] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                      title="Return to Main Menu (Esc)"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>

                    {/* Center Tab Switcher + Prev/Next Steppers */}
                    <div className="flex items-center gap-2 min-w-0 justify-center">
                      <button
                        type="button"
                        tabIndex={isExpanded ? 0 : -1}
                        onClick={() => onStepTab(-1)}
                        aria-label="Previous Slate section"
                        className="inline-flex items-center justify-center p-1.5 rounded-sm border border-[#4CE4FF]/30 hover:border-[#4CE4FF] text-[#B8F2FF] hover:text-white bg-[#0A1622]/80 transition-colors shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                      >
                        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                      </button>

                      <nav
                        aria-label="Sheikah Slate Sections"
                        className="flex items-center gap-1.5 overflow-x-auto min-w-0"
                      >
                        {MENU_TABS.map((tab) => {
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              tabIndex={isExpanded ? 0 : -1}
                              onClick={() => onSelectSection(tab.id)}
                              aria-current={isActive ? 'page' : undefined}
                              className={`px-3 py-1.5 rounded-sm text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF] ${
                                isActive
                                  ? 'bg-[#4CE4FF]/18 text-[#F3E3B4] border border-[#4CE4FF]/65 shadow-[0_0_12px_rgba(76,228,255,0.22)]'
                                  : 'text-[#FAF6EC]/70 hover:text-[#FAF6EC] border border-transparent hover:border-[#4CE4FF]/25'
                              }`}
                            >
                              {tab.label}
                            </button>
                          );
                        })}
                      </nav>

                      <button
                        type="button"
                        tabIndex={isExpanded ? 0 : -1}
                        onClick={() => onStepTab(1)}
                        aria-label="Next Slate section"
                        className="inline-flex items-center justify-center p-1.5 rounded-sm border border-[#4CE4FF]/30 hover:border-[#4CE4FF] text-[#B8F2FF] hover:text-white bg-[#0A1622]/80 transition-colors shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                      >
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Right Slot: Print Resume (Smooth Appearing Effect Only on Overview Tab, Opens CV PDF) */}
                    <div className="shrink-0 flex items-center justify-end min-w-[124px]">
                      <AnimatePresence mode="wait">
                        {activeTab === 'adventure' && (
                          <motion.a
                            key="print-resume-btn"
                            href={ASSETS.resumeCvPdf}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => playButton()}
                            aria-label="Print Resume (PDF)"
                            initial={{ opacity: 0, scale: 0.88, y: -4, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.9, y: -4, filter: 'blur(3px)' }}
                            transition={{ duration: 0.34, ease: RELAXED_EASE }}
                            className="inline-flex items-center gap-2 h-8 px-3.5 text-xs font-semibold tracking-wide text-[#0B0E12] bg-[#E5C97B] hover:bg-[#F3E3B4] rounded-sm shadow-[0_0_16px_rgba(229,201,123,0.38)] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                          >
                            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Print Resume</span>
                          </motion.a>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Slate Viewport Body: Absolute Crossfading Layers Never Trigger Parent Height Jump */}
                <div className="relative flex-1 min-h-0 overflow-hidden">
                  {/* Compact Featured Showcase Layer */}
                  <div
                    aria-hidden={isExpanded}
                    className={`absolute inset-0 p-5 overflow-hidden transition-opacity duration-300 ease-out ${
                      isExpanded
                        ? 'opacity-0 pointer-events-none'
                        : 'opacity-100 delay-100 z-10'
                    }`}
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
                          ease: RELAXED_EASE,
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="h-full grid grid-cols-12 gap-5 items-stretch"
                      >
                        <div className="col-span-6 relative h-full shrink-0 rounded-sm overflow-hidden border border-[#4CE4FF]/35 bg-[#040A10]">
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

                        <div className="col-span-6 flex-1 min-h-0 flex flex-col justify-between py-0.5 overflow-hidden">
                          <div className="min-h-0">
                            <div className="text-xs font-medium text-[#4CE4FF]">
                              {currentSlide.kicker}
                            </div>
                            <h2 className="font-display italic text-2xl font-semibold text-[#FAF6EC] mt-1 leading-snug line-clamp-2">
                              {currentSlide.title}
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-[#FAF6EC]/85 line-clamp-3">
                              {currentSlide.description}
                            </p>
                          </div>

                          <div className="mt-2 pt-3 border-t border-[#4CE4FF]/20 space-y-2.5 shrink-0">
                            <div className="text-xs text-[#B8F2FF]/80 leading-relaxed truncate">
                              {currentSlide.tags.join(' · ')}
                            </div>
                            <button
                              type="button"
                              tabIndex={isExpanded ? -1 : 0}
                              onClick={() => {
                                onSelectSection(currentSlide.targetTab);
                              }}
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

                  {/* Expanded Workspace Layer */}
                  <div
                    ref={isDesktop ? slateScrollRef : undefined}
                    aria-hidden={!isExpanded}
                    className={`absolute inset-0 overflow-y-auto overscroll-contain p-6 transition-opacity duration-300 ease-out ${
                      isExpanded
                        ? 'opacity-100 delay-100 z-10'
                        : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {displayTab !== null && (
                      <AnimatePresence mode="wait" custom={tabDirection}>
                        <motion.div
                          key={displayTab}
                          custom={tabDirection}
                          variants={tabSlideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            duration: 0.28,
                            ease: RELAXED_EASE,
                          }}
                        >
                          {displayTab === 'adventure' && (
                            <SummaryTab data={data} />
                          )}
                          {displayTab === 'skills' && (
                            <SkillTreeTab skills={data.skills} />
                          )}
                          {displayTab === 'portfolio' && (
                            <PortfolioTab projects={data.projects} />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </SheikahSlateFrame>
            </section>
          </div>
        </div>

        {/* BELOW FOLD: Hero's Path + Contact (Kept Mounted & Faded Smoothly) */}
        <div
          aria-hidden={isExpanded}
          className={
            isExpanded
              ? 'pointer-events-none opacity-0 transition-opacity duration-200'
              : 'opacity-100 transition-opacity duration-400 delay-100'
          }
        >
          <HerosPathSection experiences={data.experiences} profile={data.profile} />
        </div>
      </div>
    </MotionConfig>
  );
}
