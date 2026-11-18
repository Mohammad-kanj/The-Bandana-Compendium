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

export function unlockWebAudio(): void {
  getAudioContext();
}

if (typeof window !== 'undefined') {
  const autoUnlock = () => {
    unlockWebAudio();
  };
  window.addEventListener('pointerdown', autoUnlock, { once: true, passive: true });
  window.addEventListener('keydown', autoUnlock, { once: true, passive: true });
}

/**
 * Plays a single soft, glassy synthesized harmonic tone using Web Audio API.
 */
function playGlassyTone(
  ctx: AudioContext,
  start: number,
  freq: number,
  duration: number,
  volume: number
): void {
  const fundamental = ctx.createOscillator();
  const harmonic = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  fundamental.type = 'sine';
  fundamental.frequency.setValueAtTime(freq, start);

  harmonic.type = 'sine';
  harmonic.frequency.setValueAtTime(freq * 2, start);

  const harmonicGain = ctx.createGain();
  harmonicGain.gain.setValueAtTime(0.22, start);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(Math.min(5200, freq * 4.2), start);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.009);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  fundamental.connect(filter);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  fundamental.start(start);
  harmonic.start(start);
  fundamental.stop(start + duration + 0.02);
  harmonic.stop(start + duration + 0.02);
}

/**
 * Synthesizes a single crisp marimba-bell note (woody triangle body + airy harmonic chime)
 * reminiscent of Korok instruments in Breath of the Wild / Tears of the Kingdom.
 */
function playKorokMarimbaNote(
  ctx: AudioContext,
  start: number,
  freq: number,
  duration: number,
  volume: number
): void {
  const woodBody = ctx.createOscillator();
  const bellOver = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const bodyGain = ctx.createGain();
  const bellGain = ctx.createGain();
  const master = ctx.createGain();

  woodBody.type = 'triangle';
  woodBody.frequency.setValueAtTime(freq, start);

  bellOver.type = 'sine';
  bellOver.frequency.setValueAtTime(freq * 2, start);

  bodyGain.gain.setValueAtTime(0.75, start);
  bellGain.gain.setValueAtTime(0.32, start);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(Math.min(5800, freq * 4.6), start);

  master.gain.setValueAtTime(0.0001, start);
  master.gain.linearRampToValueAtTime(volume, start + 0.006);
  master.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  woodBody.connect(bodyGain);
  bellOver.connect(bellGain);
  bodyGain.connect(filter);
  bellGain.connect(filter);
  filter.connect(master);
  master.connect(ctx.destination);

  woodBody.start(start);
  bellOver.start(start);
  woodBody.stop(start + duration + 0.02);
  bellOver.stop(start + duration + 0.02);
}

/**
 * Playful, upbeat BotW / TotK "Unite the 2 Koroks" mini-jingle played when pressing UI buttons.
 */
let lastJingleTime = 0;

export function playKorokUniteJingle(): void {
  if (typeof window === 'undefined') return;

  const nowMs = performance.now();
  if (nowMs - lastJingleTime < 90) return;
  lastJingleTime = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Cheerful rising Korok reunion bounce (G5 -> A5 -> C6 -> D6 -> E6)
  const notes = [
    { offset: 0.0, freq: 783.99, dur: 0.11, vol: 0.05 },
    { offset: 0.058, freq: 880.0, dur: 0.11, vol: 0.055 },
    { offset: 0.116, freq: 1046.5, dur: 0.12, vol: 0.06 },
    { offset: 0.174, freq: 1174.66, dur: 0.14, vol: 0.064 },
    { offset: 0.242, freq: 1318.51, dur: 0.26, vol: 0.07 },
  ];

  notes.forEach(({ offset, freq, dur, vol }) => {
    playKorokMarimbaNote(ctx, now + offset, freq, dur, vol);
  });
}

/**
 * Plays the Unite-the-2-Koroks jingle on navigation actions.
 */
export function playNavChime(): void {
  playKorokUniteJingle();
}

/**
 * Plays the Unite-the-2-Koroks jingle on any button press.
 */
export function playButtonChime(): void {
  playKorokUniteJingle();
}

/**
 * Short, low-volume tactile hover tick that complements the Unite-the-Koroks chime.
 * Only plays once Web Audio is unlocked by user gesture so passive hovers never trigger warnings.
 */
let lastHoverTime = 0;

export function playHoverChime(): void {
  if (typeof window === 'undefined') return;
  if (!sharedAudioCtx || sharedAudioCtx.state !== 'running') return;

  const nowMs = performance.now();
  if (nowMs - lastHoverTime < 45) return;
  lastHoverTime = nowMs;

  const ctx = sharedAudioCtx;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const overtone = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  const overGain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1174.66, now);
  osc.frequency.exponentialRampToValueAtTime(1396.91, now + 0.032);

  overtone.type = 'sine';
  overtone.frequency.setValueAtTime(2349.32, now);

  overGain.gain.setValueAtTime(0.18, now);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3400, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.024, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.052);

  osc.connect(filter);
  overtone.connect(overGain);
  overGain.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  overtone.start(now);
  osc.stop(now + 0.06);
  overtone.stop(now + 0.06);
}

/**
 * Spammable swan sound for the Secret Compendium swan button (allows rapid playful overlaps).
 */
export function playSwanSpamSound(tapCount = 0): void {
  if (typeof window === 'undefined') return;

  try {
    const audio = new Audio(ASSETS.korokAudioYahaha);
    audio.volume = 0.45;
    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => playSynthCollectibleFallback(tapCount));
    }
  } catch {
    playSynthCollectibleFallback(tapCount);
  }
}

/**
 * Synthesized glassy fallback chime if audio file playback is blocked.
 */
function playSynthCollectibleFallback(variantIndex = 0): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const semitoneShift = ((variantIndex % 5) - 2) * 0.5;
  const pitchFactor = Math.pow(2, semitoneShift / 12);

  const notes = [
    { offset: 0.0, freq: 783.99 * pitchFactor, dur: 0.16, vol: 0.075 },
    { offset: 0.07, freq: 987.77 * pitchFactor, dur: 0.2, vol: 0.08 },
    { offset: 0.145, freq: 1318.51 * pitchFactor, dur: 0.34, vol: 0.085 },
  ];

  notes.forEach(({ offset, freq, dur, vol }) => {
    playGlassyTone(ctx, now + offset, freq, dur, vol);
  });
}

/**
 * Plays the Breath of the Wild Korok appearing sound ("Yahaha!") when pressing
 * any seed or swan collectible, with synthesized chime fallback.
 */
export function playCollectibleChime(variantIndex = 0): void {
  if (typeof window === 'undefined') return;

  try {
    if (activeClip) {
      activeClip.pause();
      activeClip.currentTime = 0;
    }

    const audio = new Audio(ASSETS.korokAudioYahaha);
    audio.volume = 0.55;
    activeClip = audio;

    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => playSynthCollectibleFallback(variantIndex));
    }
  } catch {
    playSynthCollectibleFallback(variantIndex);
  }
}

/**
 * Celebratory Korok discovery fanfare when all collectibles are found.
 */
export function playCompendiumFanfare(): void {
  if (typeof window === 'undefined') return;

  try {
    if (activeClip) {
      activeClip.pause();
      activeClip.currentTime = 0;
    }

    const audio = new Audio(ASSETS.korokAudioFound);
    audio.volume = 0.5;
    activeClip = audio;

    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const notes = [
          { offset: 0.0, freq: 659.25, dur: 0.2, vol: 0.07 },
          { offset: 0.08, freq: 783.99, dur: 0.2, vol: 0.075 },
          { offset: 0.16, freq: 987.77, dur: 0.24, vol: 0.08 },
          { offset: 0.25, freq: 1318.51, dur: 0.42, vol: 0.09 },
          { offset: 0.36, freq: 1567.98, dur: 0.55, vol: 0.075 },
        ];
        notes.forEach(({ offset, freq, dur, vol }) => {
          playGlassyTone(ctx, now + offset, freq, dur, vol);
        });
      });
    }
  } catch {
    playSynthCollectibleFallback(0);
  }
}

/**
 * Synthesizes an organic wooden maraca / leaf-rattle Korok shake sound via Web Audio API.
 * When `requireUnlocked` is true (e.g., scroll-triggered appear), waits until Web Audio
 * has been unlocked by user interaction so no autoplay console warnings occur.
 */
export function playKorokShakeSound(
  variantIndex = 0,
  requireUnlocked = false
): void {
  if (typeof window === 'undefined') return;

  if (requireUnlocked && (!sharedAudioCtx || sharedAudioCtx.state !== 'running')) {
    return;
  }

  const nowMs = performance.now();
  if (nowMs - lastShakeTime < 220) return;
  lastShakeTime = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const pitchShift = 1 + ((variantIndex % 4) - 1.5) * 0.04;

  const sampleRate = ctx.sampleRate;
  const noiseDuration = 0.055;
  const bufferSize = Math.floor(sampleRate * noiseDuration);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const channelData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const env = Math.pow(1 - i / bufferSize, 2.0);
    channelData[i] = (Math.random() * 2 - 1) * env;
  }

  const shakeHits = [
    { offset: 0.0, centerFreq: 2700 * pitchShift, gainVal: 0.09, woodFreq: 740 * pitchShift },
    { offset: 0.065, centerFreq: 3200 * pitchShift, gainVal: 0.1, woodFreq: 860 * pitchShift },
    { offset: 0.145, centerFreq: 2800 * pitchShift, gainVal: 0.08, woodFreq: 780 * pitchShift },
    { offset: 0.21, centerFreq: 3350 * pitchShift, gainVal: 0.055, woodFreq: 920 * pitchShift },
  ];

  shakeHits.forEach(({ offset, centerFreq, gainVal, woodFreq }) => {
    const start = now + offset;

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

    const osc = ctx.createOscillator();
    const oGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(woodFreq, start);
    osc.frequency.exponentialRampToValueAtTime(woodFreq * 0.78, start + 0.04);

    oGain.gain.setValueAtTime(0.001, start);
    oGain.gain.linearRampToValueAtTime(gainVal * 0.4, start + 0.004);
    oGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.048);

    osc.connect(oGain);
    oGain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.055);
  });
}

export function playKorokSound(variantIndex = 0): void {
  playCollectibleChime(variantIndex);
}
