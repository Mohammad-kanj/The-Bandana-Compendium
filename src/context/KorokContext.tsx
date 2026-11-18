import { AnimatePresence, motion } from 'motion/react';
import { Check, Feather, X } from 'lucide-react';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ASSETS, DEFAULT_RESUME_DATA } from '../data/defaultResume';
import { CHAMPION_STYLES, ChampionTheme } from '../components/KorokNode';
import { useSound } from './SoundContext';

export interface CollectibleMeta {
  id: string;
  title: string;
  numberLabel: string;
  theme: ChampionTheme;
  kind: 'seed' | 'swan';
}

export const COLLECTIBLES_CATALOG: CollectibleMeta[] =
  DEFAULT_RESUME_DATA.experiences.map((exp, idx) => {
    const total = String(DEFAULT_RESUME_DATA.experiences.length).padStart(2, '0');
    const num = String(idx + 1).padStart(2, '0');
    return {
      id: `korok-path-${exp.id}`,
      title: `Borok #${idx + 1}`,
      numberLabel: `${num} / ${total}`,
      theme: 'urbosa' as const,
      kind: 'swan' as const,
    };
  });

export const TOTAL_COLLECTIBLES = COLLECTIBLES_CATALOG.length;

interface KorokPopupState {
  key: number;
  korokId: string;
  x: number;
  y: number;
  phrase: string;
  theme: ChampionTheme;
  totalFound: number;
}

interface KorokContextValue {
  discoveredIds: string[];
  totalCollectibles: number;
  isDiscovered: (id: string) => boolean;
  triggerKorok: (id: string, element?: HTMLElement | null, variantIndex?: number) => void;
  lastPopup: KorokPopupState | null;
  compendiumOpen: boolean;
  setCompendiumOpen: (open: boolean) => void;
}

const KorokContext = createContext<KorokContextValue | null>(null);

const KOROK_PHRASES = [
  'Yahaha! You found me!',
  'Yahaha!',
  'Ooh! A hidden collectible!',
  'Twee-hee! You found me!',
];

export function KorokProvider({ children }: { children: ReactNode }) {
  const { playCollectible, playFanfare, playButton, playSwanSpam } = useSound();
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [lastPopup, setLastPopup] = useState<KorokPopupState | null>(null);
  const [showCelebrationToast, setShowCelebrationToast] = useState(false);
  const [badgeCompact, setBadgeCompact] = useState(false);
  const [compendiumOpen, setCompendiumOpen] = useState(false);
  const [swanTapCount, setSwanTapCount] = useState(0);
  const [summonedItem, setSummonedItem] = useState<{ id: string; key: number } | null>(
    null
  );

  const [swanBurstActive, setSwanBurstActive] = useState(false);

  const popupTimerRef = useRef<number | null>(null);
  const swanBurstTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const discoveredRef = useRef<string[]>([]);

  useEffect(() => {
    discoveredRef.current = discoveredIds;
  }, [discoveredIds]);

  const showPopupAtElement = useCallback(
    (
      id: string,
      element: HTMLElement | null | undefined,
      variantIndex: number,
      count: number,
      themeOverride?: ChampionTheme,
      phraseOverride?: string
    ) => {
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      if (element) {
        const rect = element.getBoundingClientRect();
        x = Math.min(Math.max(rect.left + rect.width / 2, 96), window.innerWidth - 96);
        y = Math.min(Math.max(rect.top, 112), window.innerHeight - 36);
      }

      const matchedMeta = COLLECTIBLES_CATALOG.find((item) => item.id === id);
      const theme: ChampionTheme = themeOverride ?? matchedMeta?.theme ?? 'urbosa';
      const burstKey = Date.now() + Math.random();
      const phrase =
        phraseOverride ?? KOROK_PHRASES[(variantIndex + count) % KOROK_PHRASES.length];

      setLastPopup({
        key: burstKey,
        korokId: id,
        x,
        y,
        phrase,
        theme,
        totalFound: count,
      });

      if (popupTimerRef.current !== null) {
        window.clearTimeout(popupTimerRef.current);
      }
      popupTimerRef.current = window.setTimeout(() => {
        setLastPopup(null);
        popupTimerRef.current = null;
      }, 1350);
    },
    []
  );

  const triggerKorok = useCallback(
    (id: string, element?: HTMLElement | null, variantIndex = 0) => {
      const alreadyFound = discoveredRef.current.includes(id);
      const nextList = alreadyFound
        ? discoveredRef.current
        : [...discoveredRef.current, id];

      if (!alreadyFound) {
        discoveredRef.current = nextList;
        setDiscoveredIds(nextList);

        if (nextList.length === TOTAL_COLLECTIBLES) {
          playFanfare();
          setShowCelebrationToast(true);
          if (toastTimerRef.current !== null) {
            window.clearTimeout(toastTimerRef.current);
          }
          toastTimerRef.current = window.setTimeout(() => {
            setShowCelebrationToast(false);
            toastTimerRef.current = null;
          }, 5600);
        } else {
          playCollectible(variantIndex);
        }
      } else {
        playCollectible(variantIndex);
      }

      showPopupAtElement(id, element, variantIndex, nextList.length);
    },
    [playCollectible, playFanfare, showPopupAtElement]
  );

  // Global document click detector for any designated [data-korok-node] icon element
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const korokEl = target.closest<HTMLElement>('[data-korok-node]');
      if (!korokEl) return;

      const korokId = korokEl.getAttribute('data-korok-node') || 'korok-default';
      const variantAttr = korokEl.getAttribute('data-korok-variant');
      const variantIndex = variantAttr ? Number.parseInt(variantAttr, 10) || 0 : 0;

      triggerKorok(korokId, korokEl, variantIndex);
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      if (popupTimerRef.current !== null) {
        window.clearTimeout(popupTimerRef.current);
      }
      if (swanBurstTimerRef.current !== null) {
        window.clearTimeout(swanBurstTimerRef.current);
      }
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, [triggerKorok]);

  // Close Secret Compendium modal on Escape
  useEffect(() => {
    if (!compendiumOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCompendiumOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [compendiumOpen]);

  const isDiscovered = useCallback(
    (id: string) => discoveredIds.includes(id),
    [discoveredIds]
  );

  const allFound = discoveredIds.length >= TOTAL_COLLECTIBLES;
  const totalSwans = useMemo(
    () => COLLECTIBLES_CATALOG.filter((item) => item.kind === 'swan').length,
    []
  );
  const swansCollected = useMemo(
    () =>
      COLLECTIBLES_CATALOG.filter(
        (item) => item.kind === 'swan' && discoveredIds.includes(item.id)
      ).length,
    [discoveredIds]
  );

  const handleSpamSwan = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const btnEl = event.currentTarget;
      const nextCount = swanTapCount + 1;
      setSwanTapCount(nextCount);
      setSwanBurstActive(true);
      if (swanBurstTimerRef.current !== null) {
        window.clearTimeout(swanBurstTimerRef.current);
      }
      swanBurstTimerRef.current = window.setTimeout(() => {
        setSwanBurstActive(false);
        swanBurstTimerRef.current = null;
      }, 560);

      playSwanSpam(nextCount);
      showPopupAtElement('compendium-swan', btnEl, nextCount, swansCollected, 'urbosa');
    },
    [playSwanSpam, showPopupAtElement, swanTapCount, swansCollected]
  );

  const handleSummonSwan = useCallback(
    (
      item: CollectibleMeta,
      idx: number,
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      const rowEl = event.currentTarget;
      const key = Date.now() + Math.random();
      setSummonedItem({ id: item.id, key });
      playCollectible(idx + 1);
      showPopupAtElement(
        item.id,
        rowEl,
        idx + 1,
        swansCollected,
        item.theme,
        `${item.title}!`
      );
    },
    [playCollectible, showPopupAtElement, swansCollected]
  );

  const value = useMemo(
    () => ({
      discoveredIds,
      totalCollectibles: TOTAL_COLLECTIBLES,
      isDiscovered,
      triggerKorok,
      lastPopup,
      compendiumOpen,
      setCompendiumOpen,
    }),
    [discoveredIds, isDiscovered, triggerKorok, lastPopup, compendiumOpen]
  );

  return (
    <KorokContext.Provider value={value}>
      {children}

      {/* Global Short Collectible Pop-Up Animation */}
      <AnimatePresence>
        {lastPopup && (
          <motion.div
            key={lastPopup.key}
            initial={{ opacity: 0, y: 18, scale: 0.45 }}
            animate={{ opacity: 1, y: -14, scale: 1 }}
            exit={{ opacity: 0, y: -28, scale: 0.72 }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            style={{
              left: `${lastPopup.x}px`,
              top: `${lastPopup.y}px`,
            }}
            aria-hidden="true"
            className="pointer-events-none fixed -translate-x-1/2 -translate-y-full z-[70] flex flex-col items-center print:hidden"
          >
            <motion.div
              initial={{ rotate: -10, scale: 0.7 }}
              animate={{ rotate: [0, -6, 5, 0], scale: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative flex flex-col items-center"
            >
              <span
                style={{
                  borderColor: CHAMPION_STYLES[lastPopup.theme].borderColor,
                  boxShadow: `0 6px 20px rgba(0,0,0,0.45), ${CHAMPION_STYLES[lastPopup.theme].accentGlow}`,
                }}
                className="px-2.5 py-1 mb-1 text-xs font-display italic font-semibold text-[#FFF7DF] bg-[#0B1724]/95 border rounded-sm whitespace-nowrap"
              >
                {lastPopup.phrase}
              </span>
              <img
                src={ASSETS.korokMask}
                alt=""
                referrerPolicy="no-referrer"
                style={{ filter: CHAMPION_STYLES[lastPopup.theme].filter }}
                className="w-11 h-11 object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom-Left Ancient-Slate Collectibles Tracker Pill (Fades in After First Discovery) */}
      <AnimatePresence>
        {discoveredIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-4 bottom-4 sm:left-6 sm:bottom-6 z-40 print:hidden"
          >
            {allFound ? (
              <motion.button
                type="button"
                onClick={() => {
                  playButton();
                  setCompendiumOpen((prev) => !prev);
                }}
                aria-expanded={compendiumOpen}
                aria-label="Open Secret Compendium"
                initial={false}
                animate={{
                  paddingLeft: badgeCompact ? 10 : 14,
                  paddingRight: badgeCompact ? 10 : 14,
                  paddingTop: badgeCompact ? 10 : 8,
                  paddingBottom: badgeCompact ? 10 : 8,
                }}
                transition={{ duration: 0.56, ease: [0.33, 0.02, 0.22, 1] }}
                className="inline-flex items-center justify-center rounded-full bg-[#091724]/92 backdrop-blur-md border border-[#F3E3B4]/65 hover:border-[#F3E3B4] text-xs font-medium text-[#FFF6DC] shadow-[0_6px_22px_rgba(0,0,0,0.42),0_0_16px_rgba(243,227,180,0.22)] transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
              >
                <motion.img
                  src={ASSETS.korokMask}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  referrerPolicy="no-referrer"
                  initial={false}
                  animate={{
                    width: badgeCompact ? 20 : 16,
                    height: badgeCompact ? 20 : 16,
                  }}
                  transition={{ duration: 0.56, ease: [0.33, 0.02, 0.22, 1] }}
                  style={{ filter: CHAMPION_STYLES.urbosa.filter }}
                  className="object-contain pointer-events-none shrink-0 drop-shadow-[0_0_8px_rgba(250,204,21,0.55)]"
                />
                <AnimatePresence initial={false}>
                  {!badgeCompact && (
                    <motion.span
                      key="borok-badge-counter"
                      initial={{ opacity: 1, width: 'auto', marginLeft: 8 }}
                      animate={{ opacity: 1, width: 'auto', marginLeft: 8 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.46, ease: [0.33, 0.02, 0.22, 1] }}
                      className="overflow-hidden inline-flex items-center font-mono tabular-nums font-semibold"
                    >
                      {discoveredIds.length}/{TOTAL_COLLECTIBLES}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ) : (
              <div
                aria-live="polite"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#08131E]/82 backdrop-blur-md border border-[#4CE4FF]/32 text-xs text-[#E8F9FF] shadow-[0_6px_20px_rgba(0,0,0,0.35)] whitespace-nowrap select-none"
              >
                <Feather className="w-3.5 h-3.5 text-[#F3E3B4]" aria-hidden="true" />
                <span>
                  Collectibles:{' '}
                  <strong className="font-mono tabular-nums font-semibold text-[#9AF0FF]">
                    {discoveredIds.length} / {TOTAL_COLLECTIBLES}
                  </strong>
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebratory Toast Notification When All Boroks Are Found */}
      <AnimatePresence>
        {showCelebrationToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            className="fixed left-4 bottom-16 sm:left-6 sm:bottom-20 z-40 max-w-xs sm:max-w-sm bg-[#091826]/94 backdrop-blur-md border border-[#F3E3B4]/60 rounded-xl p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.55),0_0_24px_rgba(243,227,180,0.18)] print:hidden"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#161209]/90 border border-[#FACC15]/55 flex items-center justify-center shrink-0">
                <img
                  src={ASSETS.korokMask}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  referrerPolicy="no-referrer"
                  style={{ filter: CHAMPION_STYLES.urbosa.filter }}
                  className="w-5 h-5 object-contain pointer-events-none drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display italic text-base font-semibold text-[#FFF6DC] leading-tight">
                  All {TOTAL_COLLECTIBLES} Boroks Found!
                </div>
                <p className="text-xs text-[#FAF6EC]/80 mt-0.5 leading-relaxed">
                  You uncovered every hidden borok along the path. Secret Compendium unlocked.
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playButton();
                      setShowCelebrationToast(false);
                      setCompendiumOpen(true);
                    }}
                    className="px-3 py-1 text-xs font-semibold text-[#08121B] bg-[#F3E3B4] hover:bg-[#FFF5D6] rounded-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                  >
                    Open Compendium
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playButton();
                      setShowCelebrationToast(false);
                      setBadgeCompact(true);
                    }}
                    className="px-2 py-1 text-xs text-[#FAF6EC]/65 hover:text-[#FAF6EC] cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggleable "Secret Compendium" Modal / Developer Note */}
      <AnimatePresence>
        {compendiumOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 bg-[#040A10]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:hidden"
            onClick={() => setCompendiumOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="secret-compendium-title"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl my-auto bg-[#091522]/96 border border-[#4CE4FF]/45 rounded-xl p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_40px_rgba(76,228,255,0.16)] text-[#FAF6EC]"
            >
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#4CE4FF]/20">
                <div>
                  <h2
                    id="secret-compendium-title"
                    className="font-display italic text-2xl sm:text-3xl font-semibold text-[#F3E3B4]"
                  >
                    Secret Compendium
                  </h2>
                </div>

                {/* Top-Right: Spammable Swan Button (48x48px hit-box) + 5/5 on Right + Close */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative inline-flex items-center justify-center">
                    <AnimatePresence>
                      {swanBurstActive && (
                        <motion.span
                          key={`compendium-ring-${swanTapCount}`}
                          initial={{ opacity: 0.85, scale: 0.65 }}
                          animate={{ opacity: 0, scale: 1.9 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.48, ease: 'easeOut' }}
                          aria-hidden="true"
                          className="pointer-events-none absolute w-9 h-9 rounded-full border border-[#F3E3B4]"
                        />
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="button"
                      onClick={handleSpamSwan}
                      aria-label="Play borok sound"
                      title="Click as much as you like!"
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.92 }}
                      animate={
                        swanBurstActive
                          ? {
                              rotate: [0, -10, 10, -5, 0],
                              scale: [1, 1.16, 1],
                            }
                          : { rotate: 0, scale: 1 }
                      }
                      transition={{ duration: 0.36, ease: 'easeInOut' }}
                      className="relative w-12 h-12 flex items-center justify-center cursor-pointer rounded-full bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                    >
                      <span className="w-9 h-9 p-1.5 rounded-full bg-[#0C1F2E]/96 border border-[#FACC15]/70 hover:border-[#FACC15] shadow-[0_0_16px_rgba(250,204,21,0.3)] flex items-center justify-center">
                        <img
                          src={ASSETS.korokMask}
                          alt=""
                          draggable={false}
                          referrerPolicy="no-referrer"
                          style={{ filter: CHAMPION_STYLES.urbosa.filter }}
                          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]"
                        />
                      </span>
                    </motion.button>
                  </div>

                  <div
                    title="Boroks collected"
                    className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#061019]/85 border border-[#4CE4FF]/30 text-xs font-mono tabular-nums font-semibold text-[#9AF0FF]"
                  >
                    {swansCollected}/{totalSwans}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playButton();
                      setCompendiumOpen(false);
                    }}
                    aria-label="Close Secret Compendium"
                    className="p-1.5 rounded-sm border border-[#4CE4FF]/30 hover:border-[#4CE4FF] text-[#FAF6EC]/75 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <p className="text-sm leading-relaxed text-[#FAF6EC]/90">
                  Hey! Listen! Thank you for taking the time to wander through the corners of this
                  land, from the featured build, to the path along the way to discover every hidden
                  borok. I wanted to build a world that expressed myself, and I took inspiration from
                  my favourite game, Zelda. I hope to see you on this voyage once again, and I
                  leave you with my favorite Zelda quote:
                </p>

                <blockquote className="relative rounded-lg bg-[#0D1E2E]/75 border border-[#F3E3B4]/35 px-4 py-3 text-center shadow-[0_0_24px_rgba(243,227,180,0.12)]">
                  <p className="font-display italic text-base sm:text-lg text-[#F3E3B4] leading-snug drop-shadow-[0_0_12px_rgba(243,227,180,0.35)]">
                    &ldquo;But courage need not be remembered&hellip; for it is never forgotten.&rdquo;
                  </p>
                </blockquote>

                <div className="bg-[#061019]/80 border border-[#4CE4FF]/20 rounded-lg p-3.5">
                  <div className="flex items-center justify-between gap-2 text-xs mb-2.5">
                    <span className="font-medium text-[#9AF0FF]">
                      Discovered Collectibles Log
                    </span>
                    <span className="text-[11px] text-[#FAF6EC]/50">
                      Click any borok to summon
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs">
                    {COLLECTIBLES_CATALOG.map((item, idx) => {
                      const found = discoveredIds.includes(item.id);
                      const isJustSummoned = summonedItem?.id === item.id;
                      const styleMeta = CHAMPION_STYLES[item.theme];

                      return (
                        <li key={item.id}>
                          <motion.button
                            type="button"
                            onClick={(e) => handleSummonSwan(item, idx, e)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.985 }}
                            className="w-full flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-md border border-transparent hover:border-[#4CE4FF]/30 hover:bg-[#0D1E2E]/70 transition-all text-left cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
                          >
                            <span className="inline-flex items-center gap-2.5 min-w-0">
                              <span className="relative inline-flex items-center justify-center shrink-0">
                                {isJustSummoned && summonedItem && (
                                  <motion.span
                                    key={`summon-ring-${summonedItem.key}`}
                                    initial={{ opacity: 0.85, scale: 0.7 }}
                                    animate={{ opacity: 0, scale: 1.85 }}
                                    transition={{ duration: 0.55, ease: 'easeOut' }}
                                    style={{ borderColor: styleMeta.borderColor }}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute w-7 h-7 rounded-full border"
                                  />
                                )}
                                <motion.span
                                  key={
                                    isJustSummoned && summonedItem
                                      ? `summon-crest-${summonedItem.key}`
                                      : 'idle'
                                  }
                                  animate={
                                    isJustSummoned
                                      ? { rotate: [0, -10, 10, -4, 0], scale: [1, 1.18, 1] }
                                      : { rotate: 0, scale: 1 }
                                  }
                                  transition={{ duration: 0.38, ease: 'easeInOut' }}
                                  style={{
                                    borderColor: styleMeta.borderColor,
                                    boxShadow: styleMeta.accentGlow,
                                  }}
                                  className="w-7 h-7 p-1 rounded-full bg-[#091522]/96 border flex items-center justify-center"
                                >
                                  <img
                                    src={ASSETS.korokMask}
                                    alt=""
                                    draggable={false}
                                    referrerPolicy="no-referrer"
                                    style={{ filter: styleMeta.filter }}
                                    className="w-full h-full object-contain pointer-events-none"
                                  />
                                </motion.span>
                              </span>

                              <span className="inline-flex items-center gap-1.5 font-medium text-[#FAF6EC] group-hover:text-[#FFF5D6] transition-colors min-w-0">
                                <span className="truncate">{item.title}</span>
                                <Check
                                  className={`w-3 h-3 shrink-0 ${
                                    found ? 'text-[#4CE4FF]' : 'text-[#FAF6EC]/25'
                                  }`}
                                  aria-hidden="true"
                                />
                              </span>
                            </span>

                            <span className="font-mono tabular-nums text-[11px] text-[#FAF6EC]/50 group-hover:text-[#F3E3B4]/85 shrink-0 transition-colors">
                              {item.numberLabel}
                            </span>
                          </motion.button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1 text-xs text-[#F3E3B4]/85">
                  <span>— {DEFAULT_RESUME_DATA.profile.displayName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      playButton();
                      setCompendiumOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-[#061018] bg-[#4CE4FF] hover:bg-[#9AF0FF] rounded-sm transition-colors cursor-pointer"
                  >
                    Close Compendium
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </KorokContext.Provider>
  );
}

export function useKorok(): KorokContextValue {
  const ctx = useContext(KorokContext);
  if (!ctx) {
    throw new Error('useKorok must be used within a Sound/KorokProvider');
  }
  return ctx;
}
