/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AbstractAmbientBackdrop } from './components/AbstractAmbientBackdrop';
import { AmbientWeather } from './components/AmbientWeather';
import { IntroOverlay } from './components/IntroOverlay';
import { PortfolioTab } from './components/PortfolioTab';
import { PrintResumeSheet } from './components/PrintResumeSheet';
import { SheikahEmbers } from './components/SheikahEmbers';
import { SheikahLoadingOverlay } from './components/SheikahLoadingOverlay';
import { SheikahScrollIndicator } from './components/SheikahScrollIndicator';
import { SkillTreeTab } from './components/SkillTreeTab';
import { SummaryTab } from './components/SummaryTab';
import { TitleScreenMenu } from './components/TitleScreenMenu';
import { MENU_TABS, TopNavBar } from './components/TopNavBar';
import { KorokProvider } from './context/KorokContext';
import { DEFAULT_RESUME_DATA } from './data/defaultResume';
import { MenuSectionId } from './types/resume';

const tabSlideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? 72 : -72,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? -72 : 72,
  }),
};

export default function App() {
  const resumeData = DEFAULT_RESUME_DATA;
  // Null = Main Title Screen (+ Hero's Path & Contact below fold); non-null = Separate Sub-Page
  const [activeTab, setActiveTab] = useState<MenuSectionId | null>(null);
  const [tabDirection, setTabDirection] = useState<number>(1);
  const [showIntro, setShowIntro] = useState(true);
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);
  const loadingTimerRef = useRef<number | null>(null);

  const handleDismissIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current !== null) {
        window.clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  const triggerSlateLoad = useCallback((nextTab: MenuSectionId, direction: number) => {
    const label = MENU_TABS.find((t) => t.id === nextTab)?.label ?? 'Sheikah Slate';
    if (loadingTimerRef.current !== null) {
      window.clearTimeout(loadingTimerRef.current);
    }
    setLoadingTarget(label);
    setTabDirection(direction);
    setActiveTab(nextTab);
    window.scrollTo({ top: 0, behavior: 'auto' });

    loadingTimerRef.current = window.setTimeout(() => {
      setLoadingTarget(null);
      loadingTimerRef.current = null;
    }, 320);
  }, []);

  // Arrow-key & Escape navigation inside opened separate pages
  useEffect(() => {
    if (activeTab === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveTab(null);
        return;
      }

      const currentIndex = MENU_TABS.findIndex((t) => t.id === activeTab);
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + MENU_TABS.length) % MENU_TABS.length;
        triggerSlateLoad(MENU_TABS[prevIndex].id, -1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % MENU_TABS.length;
        triggerSlateLoad(MENU_TABS[nextIndex].id, 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, triggerSlateLoad]);

  const handleSelectTab = (nextTab: MenuSectionId) => {
    if (nextTab === activeTab) return;
    let direction = 1;
    if (activeTab !== null) {
      const prevIdx = MENU_TABS.findIndex((t) => t.id === activeTab);
      const nextIdx = MENU_TABS.findIndex((t) => t.id === nextTab);
      direction = nextIdx >= prevIdx ? 1 : -1;
    }
    triggerSlateLoad(nextTab, direction);
  };

  const handleStepTab = (direction: -1 | 1) => {
    if (!activeTab) return;
    const currentIndex = MENU_TABS.findIndex((t) => t.id === activeTab);
    const nextIndex =
      (currentIndex + direction + MENU_TABS.length) % MENU_TABS.length;
    triggerSlateLoad(MENU_TABS[nextIndex].id, direction);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeTabIndex = activeTab
    ? MENU_TABS.findIndex((t) => t.id === activeTab)
    : 0;
  const activeTabLabel = MENU_TABS[activeTabIndex]?.label ?? 'Adventure Log';

  return (
    <MotionConfig reducedMotion="user">
      <KorokProvider>
        <IntroOverlay
          visible={showIntro}
          displayName={resumeData.profile.displayName}
          onComplete={handleDismissIntro}
        />

        <SheikahEmbers intensity={activeTab === null ? 'vista' : 'subtle'} />
        <AmbientWeather intensity={activeTab === null ? 'vista' : 'subtle'} />

        <SheikahLoadingOverlay
          visible={loadingTarget !== null}
          targetLabel={loadingTarget ?? activeTabLabel}
        />

        {activeTab === null ? (
          <TitleScreenMenu
            data={resumeData}
            introActive={showIntro}
            onSelectSection={handleSelectTab}
          />
        ) : (
          <div className="relative isolate min-h-screen flex flex-col text-[#FAF6EC] overflow-x-hidden print:hidden">
            {/* Full-Page Sunlit-to-Sheikah Abstract Ambient Backdrop */}
            <AbstractAmbientBackdrop variant="subpage" />

            {/* Sub-Pages Top Nav Bar (No Hero's Path or Contact) */}
            <TopNavBar
              brandName={resumeData.profile.displayName}
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              onBackToTitle={() => setActiveTab(null)}
              onPrint={handlePrint}
            />

            <SheikahScrollIndicator />

            {/* Main Sub-Tab Workspace (No Footer) */}
            <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 pt-6 pb-12 flex flex-col gap-5">
              {/* Arrow Tab Switcher */}
              <div className="flex items-center justify-between gap-4 px-1">
                <button
                  type="button"
                  onClick={() => handleStepTab(-1)}
                  aria-label="Previous tab"
                  className="inline-flex items-center justify-center w-9 h-9 border border-[#4CE4FF]/30 hover:border-[#4CE4FF] text-[#FAF6EC]/80 hover:text-[#4CE4FF] bg-[#08121B]/75 rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </button>

                <div className="flex items-center gap-3">
                  <span className="font-display italic text-lg sm:text-xl font-semibold text-[#F3E3B4] tracking-wide">
                    {activeTabLabel}
                  </span>
                  <span className="text-[#FAF6EC]/35" aria-hidden="true">
                    ·
                  </span>
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {MENU_TABS.map((tab) => {
                      const active = tab.id === activeTab;
                      return (
                        <span
                          key={tab.id}
                          className={`w-2 h-2 rotate-45 border transition-colors ${
                            active
                              ? 'bg-[#4CE4FF] border-[#9AF0FF] shadow-[0_0_8px_rgba(76,228,255,0.8)]'
                              : 'bg-transparent border-[#FAF6EC]/30'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleStepTab(1)}
                  aria-label="Next tab"
                  className="inline-flex items-center justify-center w-9 h-9 border border-[#4CE4FF]/30 hover:border-[#4CE4FF] text-[#FAF6EC]/80 hover:text-[#4CE4FF] bg-[#08121B]/75 rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                >
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Swift BotW-Style Directional Screen Slide Between Tabs */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait" custom={tabDirection}>
                  <motion.div
                    key={activeTab}
                    custom={tabDirection}
                    variants={tabSlideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.24,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {activeTab === 'adventure' && (
                      <SummaryTab
                        data={resumeData}
                        onNavigateTab={handleSelectTab}
                      />
                    )}
                    {activeTab === 'skills' && (
                      <SkillTreeTab skills={resumeData.skills} />
                    )}
                    {activeTab === 'portfolio' && (
                      <PortfolioTab projects={resumeData.projects} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        )}

        {/* Print-Only ATS Resume Layout */}
        <PrintResumeSheet data={resumeData} />
      </KorokProvider>
    </MotionConfig>
  );
}
