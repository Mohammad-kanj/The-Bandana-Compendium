import { ASSETS } from '../data/defaultResume';

let sharedAudioCtx: AudioContext | null = null;
let activeClip: HTMLAudioElement | null = null;
let lastShakeTime = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
  window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
}

/**
 * Fallback Web Audio chime if native MP3 playback is blocked or unavailable.
 */
function playSynthKorokFallback(variantIndex = 0): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const semitoneShift = ((variantIndex % 5) - 2) * 0.5;
  const pitchFactor = Math.pow(2, semitoneShift / 12);

  const chimeNotes = [
    { offset: 0.0, freq: 783.99 * pitchFactor, dur: 0.14, vol: 0.14 },
    { offset: 0.09, freq: 987.77 * pitchFactor, dur: 0.16, vol: 0.15 },
    { offset: 0.18, freq: 1174.66 * pitchFactor, dur: 0.28, vol: 0.17 },
    { offset: 0.24, freq: 1567.98 * pitchFactor, dur: 0.35, vol: 0.12 },
  ];

  chimeNotes.forEach(({ offset, freq, dur, vol }) => {
    const start = now + offset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  });
}

/**
 * Plays a crisp, organic Breath of the Wild-inspired Korok shake / leaf-maraca rattle sound.
 * Throttled briefly to prevent overlapping noise when brushing across nodes rapidly.
 */
export function playKorokShakeSound(variantIndex = 0): void {
  if (typeof window === 'undefined') return;

  const nowMs = performance.now();
  if (nowMs - lastShakeTime < 220) return;
  lastShakeTime = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const pitchShift = 1 + ((variantIndex % 4) - 1.5) * 0.04;

  // Short organic noise buffer for crisp Korok maraca / seed-pod shake
  const sampleRate = ctx.sampleRate;
  const noiseDuration = 0.055;
  const bufferSize = Math.floor(sampleRate * noiseDuration);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const channelData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const env = Math.pow(1 - i / bufferSize, 2.0);
    channelData[i] = (Math.random() * 2 - 1) * env;
  }

  // Classic BotW Korok double-triple wooden maraca shake rhythm ("ch-chk, ch-chk")
  const shakeHits = [
    { offset: 0.0, centerFreq: 2700 * pitchShift, gainVal: 0.14, woodFreq: 740 * pitchShift },
    { offset: 0.065, centerFreq: 3200 * pitchShift, gainVal: 0.16, woodFreq: 860 * pitchShift },
    { offset: 0.145, centerFreq: 2800 * pitchShift, gainVal: 0.12, woodFreq: 780 * pitchShift },
    { offset: 0.21, centerFreq: 3350 * pitchShift, gainVal: 0.08, woodFreq: 920 * pitchShift },
  ];

  shakeHits.forEach(({ offset, centerFreq, gainVal, woodFreq }) => {
    const start = now + offset;

    // 1. Hollow maraca / dry seed-pod shake burst
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(centerFreq, start);
    filter.Q.setValueAtTime(2.9, start);

    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.001, start);
    nGain.gain.linearRampToValueAtTime(gainVal, start + 0.006);
    nGain.gain.exponentialRampToValueAtTime(0.0001, start + noiseDuration);

    noiseSource.connect(filter);
    filter.connect(nGain);
    nGain.connect(ctx.destination);
    noiseSource.start(start);

    // 2. Wooden Korok rattle pitch click
    const osc = ctx.createOscillator();
    const oGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(woodFreq, start);
    osc.frequency.exponentialRampToValueAtTime(woodFreq * 0.78, start + 0.04);

    oGain.gain.setValueAtTime(0.001, start);
    oGain.gain.linearRampToValueAtTime(gainVal * 0.45, start + 0.004);
    oGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.048);

    osc.connect(oGain);
    oGain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.055);
  });
}

/**
 * Plays the Breath of the Wild Korok game sound ("Yahaha!" or fanfare).
 * Falls back gracefully to synthesized chime if audio element fails to play.
 */
export function playKorokSound(
  variantIndex = 0,
  kind: 'yahaha' | 'found' = 'yahaha'
): void {
  if (typeof window === 'undefined') return;

  try {
    if (activeClip) {
      activeClip.pause();
      activeClip.currentTime = 0;
    }

    const src =
      kind === 'found' ? ASSETS.korokAudioFound : ASSETS.korokAudioYahaha;
    const audio = new Audio(src);
    audio.volume = kind === 'found' ? 0.45 : 0.6;
    activeClip = audio;

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        playSynthKorokFallback(variantIndex);
      });
    }
  } catch {
    playSynthKorokFallback(variantIndex);
  }
}
