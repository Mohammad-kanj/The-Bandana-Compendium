import { Award, ExternalLink, FileText, Github, Linkedin, Mail, MapPin, User } from 'lucide-react';
import { useState } from 'react';
import { useSound } from '../context/SoundContext';
import { ASSETS } from '../data/defaultResume';
import { ResumeData } from '../types/resume';

interface SummaryTabProps {
  data: ResumeData;
}

export function SummaryTab({ data }: SummaryTabProps) {
  const { playButton } = useSound();
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
      {/* Left Panel: Organized Overview Summary */}
      <div className="lg:col-span-7 flex flex-col">
        <section className="botw-panel rounded-sm p-4 sm:p-6 flex-1 flex flex-col">
          <div className="pb-3.5 sm:pb-4 border-b border-[#FAF6EC]/12">
            <h1 className="font-display italic text-2xl sm:text-3xl font-semibold text-[#F3E3B4] tracking-wide">
              Overview
            </h1>
            <p className="text-xs text-[#FAF6EC]/65 mt-1">
              AI Engineering, Flutter mobile apps, full-stack software, and technical content creation.
            </p>
          </div>

          <div className="mt-4 p-4 sm:p-5 bg-[#08121B]/72 border border-[#4CE4FF]/20 rounded-sm flex-1 flex flex-col">
            <p className="text-sm sm:text-[15px] leading-relaxed text-[#FAF6EC]/92">
              {data.summary}
            </p>

            <ul className="mt-4 pt-4 border-t border-[#FAF6EC]/10 space-y-3.5 text-[13.5px] sm:text-[14px] leading-relaxed text-[#FAF6EC]/88">
              {data.summaryPoints.map((point) => (
                <li key={point.label} className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-2 w-1.5 h-1.5 rotate-45 bg-[#4CE4FF] shadow-[0_0_6px_rgba(76,228,255,0.75)] shrink-0"
                  />
                  <span>
                    <strong className="font-semibold text-[#F3E3B4]">
                      {point.label}:
                    </strong>{' '}
                    {point.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Right Panel: Profile, Languages & Verified Certificates */}
      <aside className="lg:col-span-5 botw-panel rounded-sm p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3.5 sm:gap-5 pb-4 sm:pb-5 border-b border-[#FAF6EC]/12">
            <div className="relative shrink-0">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1.5 rounded-full bg-[#4CE4FF]/22 blur-md"
              />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#4CE4FF]/85 ring-4 ring-[#4CE4FF]/15 shadow-[0_0_24px_rgba(76,228,255,0.45),inset_0_0_12px_rgba(76,228,255,0.25)] bg-[#08121B]">
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
              <h2 className="font-display italic text-2xl lg:text-3xl font-semibold text-[#F3E3B4] leading-tight">
                {data.profile.fullName}
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF6EC]/80 mt-1 leading-snug">
                {data.profile.headline}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#FAF6EC]/60 mt-1.5 sm:mt-2">
                <MapPin className="w-3.5 h-3.5 text-[#E5C97B]/80 shrink-0" aria-hidden="true" />
                <span>{data.profile.location}</span>
              </div>
            </div>
          </div>

          <dl className="mt-3.5 sm:mt-4 divide-y divide-[#FAF6EC]/10 text-sm">
            <div className="py-2.5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-0.5 sm:gap-3">
              <dt className="text-[11px] sm:text-sm uppercase sm:normal-case tracking-wider sm:tracking-normal text-[#FAF6EC]/55 sm:text-[#FAF6EC]/60 shrink-0">
                Core Stack
              </dt>
              <dd className="sm:text-right font-medium text-[#FAF6EC]">
                Python · TypeScript · React · FastAPI · Flutter
              </dd>
            </div>
            <div className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-3">
              <dt className="text-[11px] sm:text-sm uppercase sm:normal-case tracking-wider sm:tracking-normal text-[#FAF6EC]/55 sm:text-[#FAF6EC]/60 shrink-0">
                Graduation
              </dt>
              <dd className="font-mono tabular-nums text-[#F3E3B4]">
                {data.profile.gradYear}
              </dd>
            </div>
            <div className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-3">
              <dt className="text-[11px] sm:text-sm uppercase sm:normal-case tracking-wider sm:tracking-normal text-[#FAF6EC]/55 sm:text-[#FAF6EC]/60 shrink-0">
                Skill Tree Nodes
              </dt>
              <dd className="font-mono tabular-nums sm:text-right text-[#FAF6EC]">
                {data.skills.length} across {new Set(data.skills.map((s) => s.category)).size} branches
              </dd>
            </div>
            <div className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-3">
              <dt className="text-[11px] sm:text-sm uppercase sm:normal-case tracking-wider sm:tracking-normal text-[#FAF6EC]/55 sm:text-[#FAF6EC]/60 shrink-0">
                Creative Media Tools
              </dt>
              <dd className="sm:text-right text-[#FAF6EC]">
                Filmcraft · Photocraft
              </dd>
            </div>
            <div className="py-2.5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-0.5 sm:gap-3">
              <dt className="text-[11px] sm:text-sm uppercase sm:normal-case tracking-wider sm:tracking-normal text-[#FAF6EC]/55 sm:text-[#FAF6EC]/60 shrink-0">
                Languages
              </dt>
              <dd className="sm:text-right text-[#FAF6EC]">
                {data.profile.spokenLanguages.join(' · ')}
              </dd>
            </div>
          </dl>

          {/* Verified Certificates (CS50x & AIC) */}
          <div className="mt-4 pt-4 border-t border-[#FAF6EC]/12 space-y-2.5">
            <div className="text-xs font-medium text-[#FAF6EC]/60">
              Verified Certificates
            </div>
            {data.certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-2.5 p-3 sm:p-2.5 bg-[#08121B]/65 border border-[#4CE4FF]/16 rounded-sm text-xs"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <Award
                    className="w-3.5 h-3.5 text-[#E5C97B] mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-[#FAF6EC] leading-snug">
                      {cert.title}
                    </div>
                    <div className="text-[#FAF6EC]/65 mt-0.5">
                      {cert.issuer} · {cert.date}
                    </div>
                  </div>
                </div>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playButton()}
                    className="inline-flex items-center gap-1.5 self-start sm:self-auto pl-5 sm:pl-0 text-xs font-medium text-[#4CE4FF] hover:text-[#9AF0FF] transition-colors whitespace-nowrap shrink-0 sm:mt-0.5"
                  >
                    {cert.isPdf ? (
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span>View Certificate</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[#FAF6EC]/12 grid grid-cols-3 gap-2 sm:gap-2.5">
          <a
            href={`mailto:${data.profile.email}`}
            onClick={() => playButton()}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[42px] px-2 sm:px-3 py-2 text-xs font-medium text-[#FAF6EC] border border-[#FAF6EC]/18 hover:border-[#E5C97B]/60 bg-[#0B0E12]/65 rounded-sm transition-colors whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5 text-[#E5C97B] shrink-0" aria-hidden="true" />
            <span>Email</span>
          </a>
          <a
            href={data.profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => playButton()}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[42px] px-2 sm:px-3 py-2 text-xs font-medium text-[#FAF6EC] border border-[#FAF6EC]/18 hover:border-[#E5C97B]/60 bg-[#0B0E12]/65 rounded-sm transition-colors whitespace-nowrap"
          >
            <Github className="w-3.5 h-3.5 text-[#E5C97B] shrink-0" aria-hidden="true" />
            <span>GitHub</span>
            <ExternalLink className="hidden sm:inline w-3 h-3 opacity-60 shrink-0" aria-hidden="true" />
          </a>
          <a
            href={data.profile.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => playButton()}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[42px] px-2 sm:px-3 py-2 text-xs font-medium text-[#FAF6EC] border border-[#FAF6EC]/18 hover:border-[#E5C97B]/60 bg-[#0B0E12]/65 rounded-sm transition-colors whitespace-nowrap"
          >
            <Linkedin className="w-3.5 h-3.5 text-[#E5C97B] shrink-0" aria-hidden="true" />
            <span>LinkedIn</span>
            <ExternalLink className="hidden sm:inline w-3 h-3 opacity-60 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </aside>
    </div>
  );
}
