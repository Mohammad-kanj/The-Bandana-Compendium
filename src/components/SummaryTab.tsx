import { Award, Check, Copy, ExternalLink, FileText, Github, Linkedin, Mail, MapPin, User } from 'lucide-react';
import { useState } from 'react';
import { ASSETS } from '../data/defaultResume';
import { MenuSectionId, ResumeData } from '../types/resume';

interface SummaryTabProps {
  data: ResumeData;
  onNavigateTab: (tab: MenuSectionId) => void;
}

export function SummaryTab({ data, onNavigateTab }: SummaryTabProps) {
  const [copied, setCopied] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(data.summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Panel: Concrete Professional Summary + Education & Certificates */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        <section className="botw-panel rounded-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#FAF6EC]/12">
            <div>
              <h1 className="font-display italic text-2xl sm:text-3xl font-semibold text-[#F3E3B4] tracking-wide">
                Adventure Log · Summary
              </h1>
              <p className="text-xs text-[#FAF6EC]/65 mt-1">
                AI Engineering, Flutter mobile apps, and full-stack software development.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#F3E3B4] border border-[#E5C97B]/35 hover:border-[#E5C97B] bg-[#0B0E12]/60 rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#4CE4FF]" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-5 p-5 bg-[#08121B]/72 border border-[#4CE4FF]/20 rounded-sm">
            <p className="text-[15px] leading-relaxed text-[#FAF6EC]/92">
              {data.summary}
            </p>
            <div className="mt-4 pt-3 border-t border-[#FAF6EC]/10 flex flex-wrap items-center gap-2 text-xs text-[#B8F2FF]/80">
              {data.summaryHighlights.map((item, i) => (
                <span key={item} className="inline-flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-[#4CE4FF]/55">
                      ·
                    </span>
                  )}
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Academic Background & Verified Certifications */}
        <section className="botw-panel rounded-sm p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-[#FAF6EC]/12">
              <h2 className="font-display italic text-2xl font-semibold text-[#F3E3B4]">
                Education &amp; Certifications
              </h2>
              <span className="font-mono text-xs tabular-nums text-[#E5C97B]">
                {data.profile.gradYear}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <div className="text-base font-semibold text-[#FAF6EC]">
                  {data.profile.degree}
                </div>
                <div className="text-sm text-[#FAF6EC]/70 mt-0.5">
                  {data.profile.university}
                </div>
              </div>
              <div className="text-sm font-mono tabular-nums text-[#4CE4FF]">
                {data.profile.gpa}
              </div>
            </div>

            {/* Verified Certificates List (including attached Product School AIC PDF) */}
            <div className="mt-4 pt-3 border-t border-[#FAF6EC]/10 space-y-2.5">
              <div className="text-xs font-medium text-[#FAF6EC]/60">
                Verified Certificates
              </div>
              {data.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-1.5 text-xs"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <Award
                      className="w-3.5 h-3.5 text-[#E5C97B] mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <span className="font-semibold text-[#FAF6EC]">
                        {cert.title}
                      </span>
                      <span className="text-[#FAF6EC]/65">
                        {' '}
                        · {cert.issuer} · {cert.date}
                      </span>
                    </div>
                  </div>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4CE4FF] hover:text-[#9AF0FF] transition-colors whitespace-nowrap shrink-0"
                    >
                      {cert.isPdf ? (
                        <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      <span>{cert.isPdf ? 'View Certificate (PDF)' : 'Verify'}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#FAF6EC]/10">
              <div className="text-xs font-medium text-[#FAF6EC]/60 mb-1.5">
                Core Coursework &amp; Languages
              </div>
              <div className="text-sm text-[#FAF6EC]/85 leading-relaxed">
                {data.profile.coursework.join(' · ')}
              </div>
              <div className="text-xs text-[#FAF6EC]/65 mt-2">
                {data.profile.spokenLanguages.join(' · ')}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#FAF6EC]/10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('skills')}
              className="px-4 py-2 text-xs font-medium text-[#F3E3B4] border border-[#E5C97B]/35 hover:border-[#E5C97B] bg-[#0B0E12]/60 rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
            >
              Open Skill Tree
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('portfolio')}
              className="px-4 py-2 text-xs font-medium text-[#FAF6EC]/85 border border-[#FAF6EC]/20 hover:border-[#FAF6EC]/50 bg-[#0B0E12]/60 rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
            >
              Inspect Portfolio Equipment
            </button>
          </div>
        </section>
      </div>

      {/* Right Panel: Candidate Profile with Attached PFP in Smooth Circular Avatar */}
      <aside className="lg:col-span-5 botw-panel rounded-sm p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-5 pb-5 border-b border-[#FAF6EC]/12">
            <div className="relative shrink-0">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1.5 rounded-full bg-[#4CE4FF]/22 blur-md"
              />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#4CE4FF]/85 ring-4 ring-[#4CE4FF]/15 shadow-[0_0_24px_rgba(76,228,255,0.45),inset_0_0_12px_rgba(76,228,255,0.25)] bg-[#08121B]">
                {!avatarError ? (
                  <img
                    src={ASSETS.avatar}
                    alt={`${data.profile.fullName} profile photo`}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarError(true)}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#161D24] to-[#0B0E12] text-[#4CE4FF]">
                    <User className="w-8 h-8" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-xs font-mono text-[#4CE4FF]">
                Candidate Profile
              </div>
              <h2 className="font-display italic text-2xl sm:text-3xl font-semibold text-[#F3E3B4] leading-tight mt-0.5">
                {data.profile.fullName}
              </h2>
              <p className="text-sm text-[#FAF6EC]/80 mt-1 leading-snug">
                {data.profile.headline}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#FAF6EC]/60 mt-2">
                <MapPin className="w-3.5 h-3.5 text-[#E5C97B]/80" aria-hidden="true" />
                <span>{data.profile.location}</span>
              </div>
            </div>
          </div>

          <dl className="mt-5 divide-y divide-[#FAF6EC]/10 text-sm">
            <div className="py-3 flex items-center justify-between gap-4">
              <dt className="text-[#FAF6EC]/60">Core Stack</dt>
              <dd className="text-right font-medium text-[#FAF6EC]">
                Python · TypeScript · React · FastAPI · Flutter
              </dd>
            </div>
            <div className="py-3 flex items-center justify-between gap-4">
              <dt className="text-[#FAF6EC]/60">Graduation</dt>
              <dd className="font-mono tabular-nums text-[#F3E3B4]">
                {data.profile.gradYear}
              </dd>
            </div>
            <div className="py-3 flex items-center justify-between gap-4">
              <dt className="text-[#FAF6EC]/60">Skill Tree Nodes</dt>
              <dd className="font-mono tabular-nums text-[#FAF6EC]">
                {data.skills.length} across 4 branches
              </dd>
            </div>
            <div className="py-3 flex items-center justify-between gap-4">
              <dt className="text-[#FAF6EC]/60">Creative Media Tools</dt>
              <dd className="text-right text-[#FAF6EC]">
                Filmcraft · Photocraft
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 pt-5 border-t border-[#FAF6EC]/12 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <a
            href={`mailto:${data.profile.email}`}
            className="inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-[#FAF6EC] border border-[#FAF6EC]/18 hover:border-[#E5C97B]/60 bg-[#0B0E12]/65 rounded-sm transition-colors whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5 text-[#E5C97B]" aria-hidden="true" />
            <span>Email</span>
          </a>
          <a
            href={data.profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-[#FAF6EC] border border-[#FAF6EC]/18 hover:border-[#E5C97B]/60 bg-[#0B0E12]/65 rounded-sm transition-colors whitespace-nowrap"
          >
            <Github className="w-3.5 h-3.5 text-[#E5C97B]" aria-hidden="true" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
          </a>
          <a
            href={data.profile.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-[#FAF6EC] border border-[#FAF6EC]/18 hover:border-[#E5C97B]/60 bg-[#0B0E12]/65 rounded-sm transition-colors whitespace-nowrap"
          >
            <Linkedin className="w-3.5 h-3.5 text-[#E5C97B]" aria-hidden="true" />
            <span>LinkedIn</span>
            <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
          </a>
        </div>
      </aside>
    </div>
  );
}
