import { Check, ExternalLink, FileText, Github, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from '../context/SoundContext';
import { ASSETS } from '../data/defaultResume';
import { ExperienceItem, ProfileData } from '../types/resume';
import { AncientBeacon } from './AncientBeacon';
import { ChampionTheme, KorokNode } from './KorokNode';
import { ScrollReveal } from './ScrollReveal';

interface HerosPathSectionProps {
  experiences: ExperienceItem[];
  profile: ProfileData;
}

const CHAMPION_SWAN_THEMES: ChampionTheme[] = [
  'urbosa', // Gold & amber borok
  'urbosa', // Gold & amber borok
  'urbosa', // Gold & amber borok
  'urbosa', // Gold & amber borok
  'urbosa', // Gold & amber borok
];

export function HerosPathSection({
  experiences,
  profile,
}: HerosPathSectionProps) {
  const { playButton } = useSound();
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);
  const [visibleMilestones, setVisibleMilestones] = useState<Record<number, boolean>>({});
  const [litSpineHeight, setLitSpineHeight] = useState<number>(0);
  const [totalSpineHeight, setTotalSpineHeight] = useState<number>(0);

  const timelineRef = useRef<HTMLDivElement | null>(null);
  const spineRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMilestoneVisibility = useCallback((idx: number, visible: boolean) => {
    setVisibleMilestones((prev) => {
      if (Boolean(prev[idx]) === visible) return prev;
      return { ...prev, [idx]: visible };
    });
  }, []);

  // Highest milestone index currently visible in viewport
  let highestVisibleIdx = -1;
  for (let i = 0; i < experiences.length; i += 1) {
    if (visibleMilestones[i]) highestVisibleIdx = i;
  }

  const measureSpineToNode = useCallback(() => {
    const spineEl = spineRef.current;
    if (!spineEl) return;

    const spineRect = spineEl.getBoundingClientRect();
    const lastNode = nodeRefs.current[experiences.length - 1];
    if (lastNode) {
      const lastRect = lastNode.getBoundingClientRect();
      const endCenterY = lastRect.top - spineRect.top + lastRect.height / 2;
      setTotalSpineHeight(Math.max(0, Math.round(endCenterY)));
    }

    if (highestVisibleIdx < 0) {
      setLitSpineHeight(0);
      return;
    }

    const targetNode = nodeRefs.current[highestVisibleIdx];
    if (!targetNode) return;

    const nodeRect = targetNode.getBoundingClientRect();
    const targetCenterY = nodeRect.top - spineRect.top + nodeRect.height / 2;
    setLitSpineHeight(Math.max(0, Math.round(targetCenterY)));
  }, [experiences.length, highestVisibleIdx]);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(measureSpineToNode);
    window.addEventListener('resize', measureSpineToNode);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && timelineRef.current) {
      ro = new ResizeObserver(measureSpineToNode);
      ro.observe(timelineRef.current);
    }
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measureSpineToNode);
      ro?.disconnect();
    };
  }, [measureSpineToNode]);

  const handleCopy = async (field: 'email' | 'phone', value: string) => {
    playButton();
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => {
        setCopiedField((prev) => (prev === field ? null : prev));
      }, 1800);
    } catch {
      setCopiedField(null);
    }
  };

  return (
    <div className="relative z-10 w-full print:hidden">
      {/* HERO'S PATH TIMELINE (Full Container Width, Transparent Over Continuous Ambient Backdrop) */}
      <section
        id="heros-path"
        aria-labelledby="heros-path-heading"
        className="relative max-w-[1440px] mx-auto px-6 sm:px-10 pt-16 pb-14"
      >
        <ScrollReveal
          variant="header"
          className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-[#F3E3B4]/30"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 w-full">
            <div>
              <div className="text-xs font-semibold tracking-[0.14em] uppercase text-[#9AF0FF] drop-shadow-[0_2px_10px_rgba(4,12,18,0.88)]">
                Journey &amp; Milestones
              </div>
              <h2
                id="heros-path-heading"
                className="font-display italic text-3xl sm:text-4xl font-semibold text-[#FAF6EC] mt-1 drop-shadow-[0_3px_16px_rgba(4,10,16,0.85)]"
              >
                Hero&apos;s Path
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#FAF6EC]/90 max-w-md drop-shadow-[0_2px_10px_rgba(4,10,16,0.85)]">
              Tracing education, software builds, technical writing, and leadership milestones.
            </p>
          </div>
        </ScrollReveal>

        {/* ScrollReveal-Driven Vertical Spine & Sequenced Card Branches */}
        <div ref={timelineRef} className="relative mt-12">
          {/* Continuous Vertical Center Spine (Terminates Cleanly at Final Borok Center) */}
          <div
            ref={spineRef}
            aria-hidden="true"
            style={{ height: totalSpineHeight > 0 ? `${totalSpineHeight}px` : '0px' }}
            className="pointer-events-none absolute left-4 md:left-1/2 -translate-x-1/2 top-2 w-[2px] z-[2]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#7BE8FF]/18 via-[#4CE4FF]/24 to-[#7BE8FF]/18 rounded-full" />
            <motion.div
              initial={false}
              animate={{
                height: Math.min(litSpineHeight, totalSpineHeight || litSpineHeight),
                opacity: highestVisibleIdx >= 0 ? 1 : 0,
              }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full rounded-full bg-gradient-to-b from-[#9AF0FF]/85 via-[#4CE4FF] to-[#B8F6FF] shadow-[0_0_14px_rgba(76,228,255,0.68)]"
            />
          </div>

          <div className="space-y-12">
            {experiences.map((entry, idx) => {
              const isLeftOnDesktop = idx % 2 === 0;

              // Solid backdrop tones matched to AbstractAmbientBackdrop's 44%->91% vertical gradient
              const nodeTonePalette = [
                { border: 'rgba(164, 184, 146, 0.85)', surface: 'rgba(104, 132, 108, 0.94)' },
                { border: 'rgba(130, 162, 138, 0.85)', surface: 'rgba(82, 116, 104, 0.94)' },
                { border: 'rgba(98, 138, 134, 0.86)', surface: 'rgba(56, 94, 96, 0.95)' },
                { border: 'rgba(72, 114, 122, 0.88)', surface: 'rgba(36, 70, 80, 0.95)' },
                { border: 'rgba(54, 92, 104, 0.9)', surface: 'rgba(22, 48, 60, 0.96)' },
              ];
              const nodeTone =
                nodeTonePalette[Math.min(idx, nodeTonePalette.length - 1)];

              const isMilestoneActive = idx <= highestVisibleIdx;
              const championTheme = CHAMPION_SWAN_THEMES[idx % CHAMPION_SWAN_THEMES.length];

              return (
                <div
                  key={entry.id}
                  className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start"
                >
                  {/* Accessible 48x48px Borok Waypoint Centered on the Spine */}
                  <div
                    ref={(el) => {
                      nodeRefs.current[idx] = el;
                    }}
                    className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 z-10 flex items-center justify-center"
                  >
                    <KorokNode
                      korokId={`korok-path-${entry.id}`}
                      variantIndex={idx + 1}
                      size="md"
                      appearance="mask"
                      championTheme={championTheme}
                      trailLit={isMilestoneActive}
                      borderColor={nodeTone.border}
                      surfaceColor={nodeTone.surface}
                      label={`Discover hidden borok at ${entry.role}`}
                    />
                  </div>

                  {/* Seamless Horizontal Light Branch (Mobile: left=32px..50px overlapping circle & card) */}
                  <div
                    aria-hidden="true"
                    className="md:hidden pointer-events-none absolute top-[31px] left-[32px] w-[18px] h-[2px] z-[5]"
                  >
                    <div className="absolute inset-0 bg-[#4CE4FF]/15 rounded-full" />
                    <motion.div
                      initial={false}
                      animate={{
                        scaleX: isMilestoneActive ? 1 : 0,
                        opacity: isMilestoneActive ? 1 : 0,
                      }}
                      transition={{
                        duration: 0.36,
                        delay: isMilestoneActive ? 0.2 : 0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{ transformOrigin: 'left' }}
                      className="h-full w-full rounded-full bg-gradient-to-r from-[#9AF0FF] to-[#4CE4FF] shadow-[0_0_12px_rgba(76,228,255,0.85)]"
                    />
                  </div>

                  {/* Seamless Horizontal Light Branch (Desktop: 16px..46px overlapping circle at 18px & card at 44px) */}
                  <div
                    aria-hidden="true"
                    className={`hidden md:block pointer-events-none absolute top-[31px] h-[2px] w-[30px] z-[5] ${
                      isLeftOnDesktop ? 'right-1/2 mr-[16px]' : 'left-1/2 ml-[16px]'
                    }`}
                  >
                    <div className="absolute inset-0 bg-[#4CE4FF]/15 rounded-full" />
                    <motion.div
                      initial={false}
                      animate={{
                        scaleX: isMilestoneActive ? 1 : 0,
                        opacity: isMilestoneActive ? 1 : 0,
                      }}
                      transition={{
                        duration: 0.36,
                        delay: isMilestoneActive ? 0.2 : 0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{ transformOrigin: isLeftOnDesktop ? 'right' : 'left' }}
                      className={`h-full w-full rounded-full shadow-[0_0_12px_rgba(76,228,255,0.85)] ${
                        isLeftOnDesktop
                          ? 'bg-gradient-to-l from-[#9AF0FF] via-[#4CE4FF] to-[#B8F6FF]'
                          : 'bg-gradient-to-r from-[#9AF0FF] via-[#4CE4FF] to-[#B8F6FF]'
                      }`}
                    />
                  </div>

                  <article
                    className={`pl-12 md:pl-0 ${
                      isLeftOnDesktop
                        ? 'md:col-start-1 md:pr-5'
                        : 'md:col-start-2 md:pl-5'
                    }`}
                  >
                    <ScrollReveal
                      variant="card"
                      onVisibilityChange={(visible) =>
                        handleMilestoneVisibility(idx, visible)
                      }
                    >
                      <div
                        className={`relative overflow-hidden bg-[#060E17]/95 backdrop-blur-md border rounded-sm p-5 transition-all duration-500 ${
                          isMilestoneActive
                            ? 'border-[#7BE8FF]/80 shadow-[0_10px_34px_rgba(0,0,0,0.52),0_0_22px_rgba(76,228,255,0.22),inset_0_0_12px_rgba(76,228,255,0.06)] delay-[320ms]'
                            : 'border-[#4CE4FF]/22 shadow-[0_8px_28px_rgba(0,0,0,0.42)] hover:border-[#4CE4FF]/55'
                        }`}
                      >
                        {/* Subtle Dark-Slate Sweep Overlay */}
                        <motion.div
                          aria-hidden="true"
                          initial={false}
                          animate={{
                            scaleX: isMilestoneActive ? 1 : 0,
                            opacity: isMilestoneActive ? 1 : 0,
                          }}
                          transition={{
                            duration: 0.42,
                            delay: isMilestoneActive ? 0.32 : 0,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{ transformOrigin: isLeftOnDesktop ? 'right' : 'left' }}
                          className="pointer-events-none absolute inset-0 rounded-sm bg-gradient-to-r from-[#06131F]/40 via-[#4CE4FF]/5 to-[#06131F]/40"
                        />

                        <div className="relative z-10">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                              <span className="font-medium text-[#4CE4FF] drop-shadow-[0_0_8px_rgba(76,228,255,0.45)]">
                                {entry.type} · {entry.organization}
                              </span>
                              <span className="font-mono tabular-nums text-[#7BE8FF]">
                                {entry.timeframe}
                              </span>
                            </div>

                        <h3 className="font-display italic text-2xl font-semibold text-[#FAF6EC] mt-1.5 leading-snug">
                          {entry.role}
                        </h3>

                        <p className="mt-2.5 text-sm leading-relaxed text-[#FAF6EC]/85">
                          {entry.summary}
                        </p>

                        {entry.bullets.length > 0 && (
                          <ul className="mt-3 space-y-1.5 text-xs text-[#FAF6EC]/75 leading-relaxed">
                            {entry.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2">
                                <span
                                  aria-hidden="true"
                                  className="mt-1.5 w-1.5 h-1.5 rotate-45 bg-[#4CE4FF] shrink-0"
                                />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="mt-4 pt-3 border-t border-[#4CE4FF]/15 flex flex-wrap items-center justify-between gap-2 text-xs text-[#B8F2FF]/75">
                          <span>{entry.skillsUsed.join(' · ')}</span>
                          {entry.id === 'aiu-degree' && (
                            <a
                              href={ASSETS.volleyballCertificatePdf}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => playButton()}
                              className="inline-flex items-center gap-1 text-[#F3E3B4] hover:text-white transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Volleyball Certificate</span>
                            </a>
                          )}
                          {entry.id === 'certifications' && (
                            <div className="flex items-center gap-3">
                              <a
                                href={ASSETS.aicCertificatePdf}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => playButton()}
                                className="inline-flex items-center gap-1 text-[#4CE4FF] hover:text-[#9AF0FF] transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>AIC Certificate</span>
                              </a>
                              <a
                                href="https://cs50.harvard.edu/certificates/46a4433a-b4f1-4fce-9f1e-e548d8de319c"
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => playButton()}
                                className="inline-flex items-center gap-1 text-[#4CE4FF] hover:text-[#9AF0FF] transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>CS50x Certificate</span>
                              </a>
                            </div>
                          )}
                          {entry.id === 'presentation-designer' && (
                            <a
                              href={profile.presentationPostUrl ?? profile.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => playButton()}
                              className="inline-flex items-center gap-1 text-[#4CE4FF] hover:text-[#9AF0FF] transition-colors"
                            >
                              <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Presentation Post</span>
                            </a>
                          )}
                          {entry.id === 'media-youtube' && (
                            <a
                              href={profile.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => playButton()}
                              className="inline-flex items-center gap-1 text-[#4CE4FF] hover:text-[#9AF0FF] transition-colors"
                            >
                              <Youtube className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Bandana-Boi</span>
                            </a>
                          )}
                          {entry.id === 'linkedin-creator' && (
                            <a
                              href={profile.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => playButton()}
                              className="inline-flex items-center gap-1 text-[#4CE4FF] hover:text-[#9AF0FF] transition-colors"
                            >
                              <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>LinkedIn</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    </ScrollReveal>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Separator between Hero's Path and Warm Signal Beacon Contact */}
      <ScrollReveal
        variant="line"
        className="relative max-w-[1440px] mx-auto px-6 sm:px-10"
      >
        <div className="flex items-center gap-4">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#F3C87B]/45 to-[#F3C87B]/25" />
          <KorokNode
            korokId="korok-path-separator"
            variantIndex={experiences.length + 1}
            size="sm"
            appearance="seed"
            borderColor="rgba(196, 152, 86, 0.72)"
            surfaceColor="rgba(36, 26, 16, 0.62)"
            label="Discover Beacon Trail Seed"
          />
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#F3C87B]/45 to-[#F3C87B]/25" />
        </div>
      </ScrollReveal>

      {/* WARM "SIGNAL BEACON" CONTACT SECTION */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="relative max-w-[1440px] mx-auto px-6 sm:px-10 pt-14 pb-20"
      >
        {/* Warm Campfire / Signal Beacon Atmospheric Backlighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-6 bottom-6 -z-10 rounded-3xl blur-[80px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 58%, rgba(255, 178, 72, 0.24) 0%, rgba(224, 146, 52, 0.12) 48%, transparent 78%)',
          }}
        />

        <div className="relative rounded-2xl bg-[#161009]/70 backdrop-blur-md border border-[#F3C87B]/32 p-6 sm:p-9 shadow-[0_16px_54px_rgba(0,0,0,0.45),0_0_60px_rgba(245,166,65,0.12)]">
          <ScrollReveal variant="header" className="mb-8">
            <div className="text-xs font-semibold tracking-[0.14em] uppercase text-[#F7B955]">
              Signal Beacon · Get In Touch
            </div>
            <div className="mt-1.5 flex items-center gap-3">
              <AncientBeacon />
              <h2
                id="contact-heading"
                className="font-display italic text-3xl sm:text-4xl font-semibold text-[#FFF4DC] drop-shadow-[0_2px_14px_rgba(247,185,85,0.28)]"
              >
                Contact
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Email Card */}
            <ScrollReveal variant="card" delay={0} className="h-full">
              <button
                type="button"
                onClick={() => handleCopy('email', profile.email)}
                aria-label={`Copy email ${profile.email}`}
                className="w-full h-full text-left bg-[#1A130C]/86 border border-[#F3C87B]/30 hover:border-[#FFD88A]/85 hover:bg-[#241A0F]/94 hover:shadow-[0_0_26px_rgba(247,185,85,0.22)] rounded-xl p-5 flex flex-col justify-between gap-3 transition-all group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B955]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#F7C56E]">
                    <span className="inline-flex items-center gap-2">
                      <Mail className="w-4 h-4" aria-hidden="true" />
                      <span>Email</span>
                    </span>
                    {copiedField === 'email' && (
                      <span className="inline-flex items-center gap-1 text-[#FFD88A]">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Copied</span>
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5 text-sm font-medium text-[#FAF6EC] group-hover:text-[#FFF3D1] break-all transition-colors">
                    {profile.email}
                  </div>
                </div>
              </button>
            </ScrollReveal>

            {/* Phone Card */}
            <ScrollReveal variant="card" delay={0.05} className="h-full">
              <button
                type="button"
                onClick={() => handleCopy('phone', profile.phone)}
                aria-label={`Copy phone number ${profile.phone}`}
                className="w-full h-full text-left bg-[#1A130C]/86 border border-[#F3C87B]/30 hover:border-[#FFD88A]/85 hover:bg-[#241A0F]/94 hover:shadow-[0_0_26px_rgba(247,185,85,0.22)] rounded-xl p-5 flex flex-col justify-between gap-3 transition-all group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B955]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#F7C56E]">
                    <span className="inline-flex items-center gap-2">
                      <Phone className="w-4 h-4" aria-hidden="true" />
                      <span>Phone</span>
                    </span>
                    {copiedField === 'phone' && (
                      <span className="inline-flex items-center gap-1 text-[#FFD88A]">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Copied</span>
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5 font-mono text-sm font-medium text-[#FAF6EC] group-hover:text-[#FFF3D1] transition-colors">
                    {profile.phone}
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-[#F3E3B4]/75">
                  <MapPin className="w-3.5 h-3.5 text-[#F7B955]" aria-hidden="true" />
                  <span>{profile.location}</span>
                </div>
              </button>
            </ScrollReveal>

            {/* GitHub */}
            <ScrollReveal variant="card" delay={0.1} className="h-full">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => playButton()}
                className="w-full h-full bg-[#1A130C]/86 border border-[#F3C87B]/30 hover:border-[#FFD88A]/85 hover:bg-[#241A0F]/94 hover:shadow-[0_0_26px_rgba(247,185,85,0.22)] rounded-xl p-5 flex flex-col justify-between gap-3 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#F7C56E]">
                    <span className="inline-flex items-center gap-2">
                      <Github className="w-4 h-4" aria-hidden="true" />
                      <span>GitHub</span>
                    </span>
                    <ExternalLink
                      className="w-3.5 h-3.5 text-[#F3E3B4]/55 group-hover:text-[#FFD88A] transition-colors"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-2.5 text-sm font-medium text-[#FAF6EC] group-hover:text-[#FFF3D1] transition-colors">
                    github.com/Mohammad-kanj
                  </div>
                </div>
              </a>
            </ScrollReveal>

            {/* LinkedIn */}
            <ScrollReveal variant="card" delay={0.15} className="h-full">
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => playButton()}
                className="w-full h-full bg-[#1A130C]/86 border border-[#F3C87B]/30 hover:border-[#FFD88A]/85 hover:bg-[#241A0F]/94 hover:shadow-[0_0_26px_rgba(247,185,85,0.22)] rounded-xl p-5 flex flex-col justify-between gap-3 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#F7C56E]">
                    <span className="inline-flex items-center gap-2">
                      <Linkedin className="w-4 h-4" aria-hidden="true" />
                      <span>LinkedIn</span>
                    </span>
                    <ExternalLink
                      className="w-3.5 h-3.5 text-[#F3E3B4]/55 group-hover:text-[#FFD88A] transition-colors"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-2.5 text-sm font-medium text-[#FAF6EC] group-hover:text-[#FFF3D1] break-all transition-colors">
                    {profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}
                  </div>
                </div>
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
