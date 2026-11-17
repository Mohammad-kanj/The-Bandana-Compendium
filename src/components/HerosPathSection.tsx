import { Check, ExternalLink, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { ExperienceItem, ProfileData } from '../types/resume';
import { KorokNode } from './KorokNode';
import { ScrollReveal } from './ScrollReveal';

interface HerosPathSectionProps {
  experiences: ExperienceItem[];
  profile: ProfileData;
}

export function HerosPathSection({
  experiences,
  profile,
}: HerosPathSectionProps) {
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);

  const handleCopy = async (field: 'email' | 'phone', value: string) => {
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

        {/* Visual Dashed Sheikah Blue Timeline */}
        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="absolute left-4 md:left-1/2 top-2 bottom-2 -translate-x-1/2 w-[2px]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(120, 236, 255, 0.92) 0px, rgba(120, 236, 255, 0.92) 8px, transparent 8px, transparent 16px)',
              filter:
                'drop-shadow(0 0 6px rgba(76, 228, 255, 0.72)) drop-shadow(0 1px 4px rgba(0, 0, 0, 0.5))',
            }}
          />

          <div className="space-y-12">
            {experiences.map((entry, idx) => {
              const isLeftOnDesktop = idx % 2 === 0;
              const nodeTonePalette = [
                { border: 'rgba(166, 182, 146, 0.82)', surface: 'rgba(98, 122, 96, 0.46)' },
                { border: 'rgba(142, 170, 140, 0.82)', surface: 'rgba(82, 112, 96, 0.46)' },
                { border: 'rgba(122, 158, 138, 0.82)', surface: 'rgba(66, 100, 92, 0.48)' },
                { border: 'rgba(96, 138, 134, 0.82)', surface: 'rgba(48, 82, 86, 0.5)' },
                { border: 'rgba(72, 114, 120, 0.82)', surface: 'rgba(34, 66, 74, 0.54)' },
              ];
              const nodeTone =
                nodeTonePalette[Math.min(idx, nodeTonePalette.length - 1)];
              return (
                <ScrollReveal key={entry.id} variant="card">
                  <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
                    {/* Clickable Swan Waypoint Marker */}
                    <div className="absolute left-4 md:left-1/2 top-4 -translate-x-1/2 z-10 flex items-center justify-center">
                      <KorokNode
                        korokId={`korok-path-${entry.id}`}
                        variantIndex={idx + 1}
                        size="md"
                        appearance="mask"
                        borderColor={nodeTone.border}
                        surfaceColor={nodeTone.surface}
                        label={`Discover Korok at ${entry.role}`}
                      />
                    </div>

                    {/* Connector Dash from Spine to Card (Desktop) */}
                    <div
                      aria-hidden="true"
                      className={`hidden md:block absolute top-[33px] h-[2px] w-5 ${
                        isLeftOnDesktop ? 'right-1/2 mr-4' : 'left-1/2 ml-4'
                      }`}
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(to right, rgba(76, 228, 255, 0.75) 0px, rgba(76, 228, 255, 0.75) 4px, transparent 4px, transparent 8px)',
                      }}
                    />

                    <article
                      className={`pl-12 md:pl-0 ${
                        isLeftOnDesktop
                          ? 'md:col-start-1 md:pr-4'
                          : 'md:col-start-2 md:pl-4'
                      }`}
                    >
                      <div className="bg-[#0B1520]/84 backdrop-blur-md border border-[#4CE4FF]/28 hover:border-[#4CE4FF]/65 rounded-sm p-5 transition-colors shadow-[0_8px_28px_rgba(0,0,0,0.3)]">
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

                        <div className="mt-4 pt-3 border-t border-[#4CE4FF]/15 text-xs text-[#B8F2FF]/75">
                          {entry.skillsUsed.join(' · ')}
                        </div>
                      </div>
                    </article>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Separator between Hero's Path and Contact */}
      <ScrollReveal
        variant="line"
        className="relative max-w-[1440px] mx-auto px-6 sm:px-10"
      >
        <div className="flex items-center gap-4">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#4CE4FF]/35 to-[#4CE4FF]/20" />
          <KorokNode
            korokId="korok-path-separator"
            variantIndex={experiences.length + 1}
            size="sm"
            appearance="seed"
            borderColor="rgba(54, 96, 108, 0.85)"
            surfaceColor="rgba(26, 56, 68, 0.56)"
            label="Golden Korok Seed"
          />
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#4CE4FF]/35 to-[#4CE4FF]/20" />
        </div>
      </ScrollReveal>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="relative max-w-[1440px] mx-auto px-6 sm:px-10 pt-14 pb-16"
      >
        <ScrollReveal variant="header" className="mb-8">
          <div className="text-xs font-medium tracking-[0.14em] uppercase text-[#F3E3B4]/90">
            Get In Touch
          </div>
          <h2
            id="contact-heading"
            className="font-display italic text-3xl sm:text-4xl font-semibold text-[#FAF6EC] mt-1"
          >
            Contact
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Email Card */}
          <ScrollReveal variant="card" delay={0} className="h-full">
            <button
              type="button"
              onClick={() => handleCopy('email', profile.email)}
              aria-label={`Copy email ${profile.email}`}
              className="w-full h-full text-left bg-[#0B1520]/84 border border-[#F3E3B4]/22 hover:border-[#4CE4FF]/65 rounded-sm p-5 flex flex-col justify-between gap-3 transition-colors group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#4CE4FF]">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    <span>Email</span>
                  </span>
                  {copiedField === 'email' && (
                    <span className="inline-flex items-center gap-1 text-[#4CE4FF]">
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copied</span>
                    </span>
                  )}
                </div>
                <div className="mt-2.5 text-sm font-medium text-[#FAF6EC] group-hover:text-[#F3E3B4] break-all transition-colors">
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
              className="w-full h-full text-left bg-[#0B1520]/84 border border-[#F3E3B4]/22 hover:border-[#4CE4FF]/65 rounded-sm p-5 flex flex-col justify-between gap-3 transition-colors group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#4CE4FF]">
                  <span className="inline-flex items-center gap-2">
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    <span>Phone</span>
                  </span>
                  {copiedField === 'phone' && (
                    <span className="inline-flex items-center gap-1 text-[#4CE4FF]">
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copied</span>
                    </span>
                  )}
                </div>
                <div className="mt-2.5 font-mono text-sm font-medium text-[#FAF6EC] group-hover:text-[#F3E3B4] transition-colors">
                  {profile.phone}
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#FAF6EC]/70">
                <MapPin className="w-3.5 h-3.5 text-[#F3E3B4]/80" aria-hidden="true" />
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
              className="w-full h-full bg-[#0B1520]/84 border border-[#F3E3B4]/22 hover:border-[#4CE4FF]/65 rounded-sm p-5 flex flex-col justify-between gap-3 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#4CE4FF]">
                  <span className="inline-flex items-center gap-2">
                    <Github className="w-4 h-4" aria-hidden="true" />
                    <span>GitHub</span>
                  </span>
                  <ExternalLink
                    className="w-3.5 h-3.5 text-[#FAF6EC]/50 group-hover:text-[#4CE4FF] transition-colors"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-2.5 text-sm font-medium text-[#FAF6EC] group-hover:text-[#F3E3B4] transition-colors">
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
              className="w-full h-full bg-[#0B1520]/84 border border-[#F3E3B4]/22 hover:border-[#4CE4FF]/65 rounded-sm p-5 flex flex-col justify-between gap-3 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#4CE4FF]">
                  <span className="inline-flex items-center gap-2">
                    <Linkedin className="w-4 h-4" aria-hidden="true" />
                    <span>LinkedIn</span>
                  </span>
                  <ExternalLink
                    className="w-3.5 h-3.5 text-[#FAF6EC]/50 group-hover:text-[#4CE4FF] transition-colors"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-2.5 text-sm font-medium text-[#FAF6EC] group-hover:text-[#F3E3B4] break-all transition-colors">
                  {profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}
                </div>
              </div>
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
