import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {
  playButtonChime,
  playChestOpenSound,
  playCollectibleChime,
  playCompendiumFanfare,
  playHoverChime,
  playKorokShakeSound,
  playMenuHoverClickSound,
  playNavChime,
  playSheikahSlateCloseSound,
  playSheikahSlateOpenSound,
  playSwanSpamSound,
  playTabClickSound,
} from '../utils/korokSound';

interface SoundContextValue {
  playNav: () => void;
  playButton: () => void;
  playHover: () => void;
  playMenuHoverClick: () => void;
  playCollectible: (variantIndex?: number) => void;
  playFanfare: () => void;
  playChestOpen: () => void;
  playSheikahSlateOpen: () => void;
  playSheikahSlateClose: () => void;
  playTabClick: () => void;
  playShake: (variantIndex?: number, requireUnlocked?: boolean) => void;
  playSwanSpam: (tapCount?: number) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const playNav = useCallback(() => {
    playNavChime();
  }, []);

  const playButton = useCallback(() => {
    playButtonChime();
  }, []);

  const playHover = useCallback(() => {
    playHoverChime();
  }, []);

  const playMenuHoverClick = useCallback(() => {
    playMenuHoverClickSound();
  }, []);

  const playCollectible = useCallback((variantIndex = 0) => {
    playCollectibleChime(variantIndex);
  }, []);

  const playFanfare = useCallback(() => {
    playCompendiumFanfare();
  }, []);

  const playChestOpen = useCallback(() => {
    playChestOpenSound();
  }, []);

  const playSheikahSlateOpen = useCallback(() => {
    playSheikahSlateOpenSound();
  }, []);

  const playSheikahSlateClose = useCallback(() => {
    playSheikahSlateCloseSound();
  }, []);

  const playTabClick = useCallback(() => {
    playTabClickSound();
  }, []);

  const playShake = useCallback((variantIndex = 0, requireUnlocked = false) => {
    playKorokShakeSound(variantIndex, requireUnlocked);
  }, []);

  const playSwanSpam = useCallback((tapCount = 0) => {
    playSwanSpamSound(tapCount);
  }, []);

  // Delegated low-volume hover feedback on interactive buttons, slots, tabs, and links
  // (respects [data-silent-hover="true"] and [data-korok-node] elements that have custom sounds)
  useEffect(() => {
    let lastHoveredEl: HTMLElement | null = null;

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const target = event.target as HTMLElement | null;
      if (!target) {
        lastHoveredEl = null;
        return;
      }

      const interactive = target.closest<HTMLElement>(
        'button, a[href], [role="tab"]'
      );
      if (!interactive) {
        lastHoveredEl = null;
        return;
      }

      if (interactive === lastHoveredEl) return;
      lastHoveredEl = interactive;

      if (
        interactive.closest('[data-silent-hover="true"]') ||
        interactive.hasAttribute('data-korok-node') ||
        interactive.hasAttribute('disabled')
      ) {
        return;
      }

      playHoverChime();
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (!lastHoveredEl) return;
      const related = event.relatedTarget as Node | null;
      if (!related || !lastHoveredEl.contains(related)) {
        lastHoveredEl = null;
      }
    };

    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('pointerout', handlePointerOut, { passive: true });
    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
    };
  }, []);

  const value = useMemo(
    () => ({
      playNav,
      playButton,
      playHover,
      playMenuHoverClick,
      playCollectible,
      playFanfare,
      playChestOpen,
      playSheikahSlateOpen,
      playSheikahSlateClose,
      playTabClick,
      playShake,
      playSwanSpam,
    }),
    [
      playNav,
      playButton,
      playHover,
      playMenuHoverClick,
      playCollectible,
      playFanfare,
      playChestOpen,
      playSheikahSlateOpen,
      playSheikahSlateClose,
      playTabClick,
      playShake,
      playSwanSpam,
    ]
  );

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return ctx;
}
