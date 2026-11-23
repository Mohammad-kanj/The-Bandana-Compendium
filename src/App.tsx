/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MotionConfig } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { AbstractAmbientBackdrop } from './components/AbstractAmbientBackdrop';
import { AmbientWeather } from './components/AmbientWeather';
import { IntroOverlay } from './components/IntroOverlay';
import { ParallaxHorizon } from './components/ParallaxHorizon';
import { PrintResumeSheet } from './components/PrintResumeSheet';
import { SheikahEmbers } from './components/SheikahEmbers';
import { TitleScreenMenu } from './components/TitleScreenMenu';
import { MENU_TABS } from './components/TopNavBar';
import { KorokProvider } from './context/KorokContext';
import { SoundProvider, useSound } from './context/SoundContext';
import { DEFAULT_RESUME_DATA } from './data/defaultResume';
import { MenuSectionId } from './types/resume';

function AppContent() {
  const resumeData = DEFAULT_RESUME_DATA;
  const {
    playSheikahSlateOpen,
    playSheikahSlateClose,
    playTabClick,
    playButton,
  } = useSound();
  // Null = Main Title Screen (+ Hero's Path & Contact below fold); non-null = Expanded Sheikah Slate
  const [activeTab, setActiveTab] = useState<MenuSectionId | null>(null);
  const [tabDirection, setTabDirection] = useState<number>(1);
  const [showIntro, setShowIntro] = useState(true);

  const handleDismissIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleSelectTab = useCallback(
    (nextTab: MenuSectionId) => {
      if (nextTab === activeTab) return;
      let direction = 1;
      if (activeTab === null) {
        playSheikahSlateOpen();
      } else {
        playTabClick();
        const prevIdx = MENU_TABS.findIndex((t) => t.id === activeTab);
        const nextIdx = MENU_TABS.findIndex((t) => t.id === nextTab);
        direction = nextIdx >= prevIdx ? 1 : -1;
      }
      setTabDirection(direction);
      setActiveTab(nextTab);
    },
    [activeTab, playSheikahSlateOpen, playTabClick]
  );

  const handleStepTab = useCallback(
    (direction: -1 | 1) => {
      if (!activeTab) return;
      playTabClick();
      const currentIndex = MENU_TABS.findIndex((t) => t.id === activeTab);
      const nextIndex =
        (currentIndex + direction + MENU_TABS.length) % MENU_TABS.length;
      setTabDirection(direction);
      setActiveTab(MENU_TABS[nextIndex].id);
    },
    [activeTab, playTabClick]
  );

  const handleBackToTitle = useCallback(() => {
    playSheikahSlateClose();
    setActiveTab(null);
  }, [playSheikahSlateClose]);

  const handlePrint = useCallback(() => {
    playButton();
    window.print();
  }, [playButton]);

  // Arrow-key & Escape navigation inside expanded Sheikah Slate
  useEffect(() => {
    if (activeTab === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleBackToTitle();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handleStepTab(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleStepTab(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, handleBackToTitle, handleStepTab]);

  return (
    <>
      <IntroOverlay
        visible={showIntro}
        displayName={resumeData.profile.displayName}
        onComplete={handleDismissIntro}
      />

      {/* Persistent Background, Horizon & Weather Layer — Never Remounted or Altered */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden print:hidden"
      >
        <AbstractAmbientBackdrop variant="title" />
        <ParallaxHorizon />
        <SheikahEmbers intensity="vista" />
        <AmbientWeather intensity="vista" />
      </div>

      <TitleScreenMenu
        data={resumeData}
        introActive={showIntro}
        activeTab={activeTab}
        tabDirection={tabDirection}
        onSelectSection={handleSelectTab}
        onStepTab={handleStepTab}
        onBackToTitle={handleBackToTitle}
        onPrint={handlePrint}
      />

      {/* Print-Only ATS Resume Layout */}
      <PrintResumeSheet data={resumeData} />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SoundProvider>
        <KorokProvider>
          <AppContent />
        </KorokProvider>
      </SoundProvider>
    </MotionConfig>
  );
}
