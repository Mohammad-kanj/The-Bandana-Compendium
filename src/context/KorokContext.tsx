import { AnimatePresence, motion } from 'motion/react';
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
import { ASSETS } from '../data/defaultResume';
import { playKorokSound } from '../utils/korokSound';

interface KorokPopupState {
  key: number;
  korokId: string;
  x: number;
  y: number;
  phrase: string;
  totalFound: number;
}

interface KorokContextValue {
  discoveredIds: string[];
  isDiscovered: (id: string) => boolean;
  triggerKorok: (id: string, element?: HTMLElement | null, variantIndex?: number) => void;
  lastPopup: KorokPopupState | null;
}

const KorokContext = createContext<KorokContextValue | null>(null);

const KOROK_PHRASES = [
  'Yahaha! You found me!',
  'Yahaha!',
  'Ooh! A hidden Korok!',
  'Twee-hee! You found me!',
];

export function KorokProvider({ children }: { children: ReactNode }) {
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [lastPopup, setLastPopup] = useState<KorokPopupState | null>(null);
  const popupTimerRef = useRef<number | null>(null);
  const discoveredRef = useRef<string[]>([]);

  useEffect(() => {
    discoveredRef.current = discoveredIds;
  }, [discoveredIds]);

  const triggerKorok = useCallback(
    (id: string, element?: HTMLElement | null, variantIndex = 0) => {
      const alreadyFound = discoveredRef.current.includes(id);
      const nextList = alreadyFound
        ? discoveredRef.current
        : [...discoveredRef.current, id];

      if (!alreadyFound) {
        discoveredRef.current = nextList;
        setDiscoveredIds(nextList);
      }

      playKorokSound(variantIndex, 'yahaha');

      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      if (element) {
        const rect = element.getBoundingClientRect();
        x = Math.min(Math.max(rect.left + rect.width / 2, 76), window.innerWidth - 76);
        y = Math.min(Math.max(rect.top, 88), window.innerHeight - 36);
      }

      const burstKey = Date.now() + Math.random();
      const phrase =
        KOROK_PHRASES[(variantIndex + nextList.length) % KOROK_PHRASES.length];

      setLastPopup({
        key: burstKey,
        korokId: id,
        x,
        y,
        phrase,
        totalFound: nextList.length,
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
    };
  }, [triggerKorok]);

  const isDiscovered = useCallback(
    (id: string) => discoveredIds.includes(id),
    [discoveredIds]
  );

  const value = useMemo(
    () => ({
      discoveredIds,
      isDiscovered,
      triggerKorok,
      lastPopup,
    }),
    [discoveredIds, isDiscovered, triggerKorok, lastPopup]
  );

  return (
    <KorokContext.Provider value={value}>
      {children}

      {/* Global Short 'Hidden' Korok Pop-Up Animation */}
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
            className="pointer-events-none fixed -translate-x-1/2 -translate-y-full z-50 flex flex-col items-center print:hidden"
          >
            {/* Actual Hidden Korok Popping Out */}
            <motion.div
              initial={{ rotate: -10, scale: 0.7 }}
              animate={{ rotate: [0, -6, 5, 0], scale: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative flex flex-col items-center"
            >
              <span className="px-2.5 py-1 mb-1 text-xs font-display italic font-semibold text-[#FFF7DF] bg-[#161209]/95 border border-[#F3E3B4]/70 rounded-sm shadow-[0_6px_20px_rgba(243,227,180,0.38)] whitespace-nowrap">
                {lastPopup.phrase}
              </span>
              <img
                src={ASSETS.korokCharacter}
                alt=""
                referrerPolicy="no-referrer"
                className="w-12 h-12 object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)]"
              />
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
    throw new Error('useKorok must be used within a KorokProvider');
  }
  return ctx;
}
