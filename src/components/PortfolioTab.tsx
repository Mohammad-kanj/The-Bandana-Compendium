import { Code2, ExternalLink, FolderGit2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useSound } from '../context/SoundContext';
import { ProjectCategory, ProjectItem } from '../types/resume';

interface PortfolioTabProps {
  projects: ProjectItem[];
}

const PROJECT_CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'Full-Stack Web',
  'Cross-Platform Mobile',
  'AI & Systems',
];

const CARD_SURFACE_TONES = [
  'bg-[#0D1E2E]/72 hover:bg-[#13293D]/84',
  'bg-[#101C2B]/74 hover:bg-[#16273B]/86',
  'bg-[#0B202C]/72 hover:bg-[#112C3C]/84',
  'bg-[#131E29]/74 hover:bg-[#1A2938]/86',
];

export function PortfolioTab({ projects }: PortfolioTabProps) {
  const { playButton } = useSound();
  const [categoryFilter, setCategoryFilter] = useState<'All' | ProjectCategory>('All');
  const [filterDirection, setFilterDirection] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string>(projects[0]?.id ?? '');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredProjects = useMemo(() => {
    if (categoryFilter === 'All') return projects;
    return projects.filter((p) => p.category === categoryFilter);
  }, [projects, categoryFilter]);

  useEffect(() => {
    if (!filteredProjects.some((p) => p.id === selectedId) && filteredProjects[0]) {
      setSelectedId(filteredProjects[0].id);
    }
  }, [filteredProjects, selectedId]);

  const selectedProject =
    filteredProjects.find((p) => p.id === selectedId) || filteredProjects[0];

  const markImageFailed = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleSelectCategory = (nextCat: 'All' | ProjectCategory) => {
    playButton();
    const prevIdx = PROJECT_CATEGORIES.indexOf(categoryFilter);
    const nextIdx = PROJECT_CATEGORIES.indexOf(nextCat);
    setFilterDirection(nextIdx >= prevIdx ? 1 : -1);
    setCategoryFilter(nextCat);
  };

  return (
    <div className="space-y-6">
      {/* Full-Width Rounded Category Bar */}
      <div
        className="bg-[#091521]/78 backdrop-blur-md border border-[#4CE4FF]/22 rounded-3xl p-2 grid grid-cols-2 sm:grid-cols-4 gap-2 w-full shadow-[0_10px_28px_rgba(0,0,0,0.3)]"
        role="tablist"
        aria-label="Project Categories"
      >
        {PROJECT_CATEGORIES.map((category) => {
          const active = categoryFilter === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleSelectCategory(category)}
              className={`w-full px-4 py-2.5 text-xs font-medium rounded-2xl transition-all whitespace-nowrap text-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF] ${
                active
                  ? 'bg-[#E5C97B]/24 text-[#F3E3B4] border border-[#E5C97B]/65 shadow-[0_0_14px_rgba(229,201,123,0.16)]'
                  : 'bg-[#0E1E2E]/60 text-[#FAF6EC]/75 hover:text-[#FAF6EC] hover:bg-[#14293D]/80 border border-transparent'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Independent Floating Sections: Individual Project Cards (Left) & Separated Inspector Blocks (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left: Independent Rounded Project Cards (No Single Enclosing Blob) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0A1826]/72 backdrop-blur-md border border-[#4CE4FF]/20 rounded-3xl px-5 py-3.5 flex items-baseline justify-between gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
            <h2 className="font-display italic text-2xl font-semibold text-[#F3E3B4]">
              Portfolio Inventory
            </h2>
            <span className="text-xs text-[#4CE4FF]">Select item to inspect</span>
          </div>

          <AnimatePresence mode="wait" custom={filterDirection}>
            <motion.div
              key={categoryFilter}
              custom={filterDirection}
              initial={{ opacity: 0, x: filterDirection * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -filterDirection * 32 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {filteredProjects.map((project, idx) => {
                const isSelected = selectedProject?.id === project.id;
                const imgFailed = failedImages[project.id];
                const surfaceTone = CARD_SURFACE_TONES[idx % CARD_SURFACE_TONES.length];

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      playButton();
                      setSelectedId(project.id);
                    }}
                    aria-label={`Inspect ${project.title}`}
                    aria-pressed={isSelected}
                    className={`group relative text-left rounded-3xl p-4 backdrop-blur-md border transition-all flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF] shadow-[0_12px_30px_rgba(0,0,0,0.34)] ${
                      isSelected
                        ? 'bg-[#152B3F]/88 border-[#F3E3B4]/80 ring-2 ring-[#4CE4FF]/25 -translate-y-0.5'
                        : `${surfaceTone} border-[#FAF6EC]/14 hover:border-[#E5C97B]/50`
                    }`}
                  >
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#FAF6EC]/14 bg-[#071018]">
                      {!imgFailed ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          onError={() => markImageFailed(project.id)}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#161E26] to-[#0B0E12] text-[#E5C97B]/80 p-3 text-center">
                          <Code2 className="w-6 h-6 mb-1" aria-hidden="true" />
                          <span className="text-xs font-medium text-[#FAF6EC]/80">
                            {project.subtitle}
                          </span>
                        </div>
                      )}

                      {/* Subtle BotW Sheikah Tech Stack Tooltip on Hover / Focus */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-2 bottom-2 z-20 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-200 ease-out"
                      >
                        <div className="relative rounded-sm bg-[#060F17]/92 backdrop-blur-md border border-[#E5C97B]/55 px-2.5 py-2 shadow-[0_10px_24px_rgba(0,0,0,0.75),0_0_12px_rgba(76,228,255,0.16)]">
                          <span className="absolute -top-[2px] -left-[2px] w-1.5 h-1.5 border-t border-l border-[#F3E3B4]" />
                          <span className="absolute -top-[2px] -right-[2px] w-1.5 h-1.5 border-t border-r border-[#F3E3B4]" />
                          <span className="absolute -bottom-[2px] -left-[2px] w-1.5 h-1.5 border-b border-l border-[#F3E3B4]" />
                          <span className="absolute -bottom-[2px] -right-[2px] w-1.5 h-1.5 border-b border-r border-[#F3E3B4]" />

                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase text-[#9AF0FF]">
                              <span className="w-1.5 h-1.5 rotate-45 bg-[#4CE4FF] shadow-[0_0_6px_rgba(76,228,255,0.85)]" />
                              <span>Tech Stack</span>
                            </span>
                            <span className="text-[10px] italic font-display text-[#F3E3B4]/85">
                              {project.subtitle}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-[#0D1E2E]/95 text-[#FAF6EC]/90 border border-[#4CE4FF]/30"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3.5">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-[#4CE4FF]">
                        <span className="truncate">{project.category}</span>
                        <span className="font-mono tabular-nums text-[#FAF6EC]/65 shrink-0">
                          {project.year}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-[#FAF6EC] mt-1 leading-snug line-clamp-1">
                        {project.title}
                      </div>
                      <div className="text-xs text-[#FAF6EC]/60 mt-1 truncate">
                        {project.technologies.slice(0, 3).join(' · ')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Independent Floating Inspector Blocks (Broken Out Into Distinct Cards) */}
        <aside className="lg:col-span-6 flex flex-col gap-4">
          {selectedProject ? (
            <>
              {/* Block 1: Preview Media + Title Header */}
              <div className="bg-[#091522]/78 backdrop-blur-md border border-[#4CE4FF]/22 rounded-3xl p-5 shadow-[0_12px_32px_rgba(0,0,0,0.36)]">
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#E5C97B]/30 bg-[#050A10]">
                  {!failedImages[selectedProject.id] ? (
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      referrerPolicy="no-referrer"
                      onError={() => markImageFailed(selectedProject.id)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#161E26] to-[#0B0E12] text-[#E5C97B]">
                      <Code2 className="w-8 h-8 mb-2" aria-hidden="true" />
                      <span className="text-sm font-medium text-[#FAF6EC]/80">
                        {selectedProject.title}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4CE4FF]">
                    <span>
                      {selectedProject.category} · {selectedProject.subtitle}
                    </span>
                    <span className="font-mono tabular-nums text-[#FAF6EC]/65">
                      {selectedProject.year}
                    </span>
                  </div>
                  <h3 className="font-display italic text-3xl font-semibold text-[#F3E3B4] mt-1 leading-tight">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Block 2: Description & Highlights */}
              <div className="bg-[#0E1E2E]/74 backdrop-blur-md border border-[#FAF6EC]/12 rounded-3xl p-5 shadow-[0_12px_32px_rgba(0,0,0,0.32)]">
                <p className="text-sm leading-relaxed text-[#FAF6EC]/90">
                  {selectedProject.description}
                </p>

                <ul className="mt-3.5 space-y-2 text-sm text-[#FAF6EC]/80">
                  {selectedProject.highlights.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 w-1.5 h-1.5 rotate-45 bg-[#E5C97B] shrink-0"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Block 3: Technologies & Action Links */}
              <div className="bg-[#0B1722]/82 backdrop-blur-md border border-[#E5C97B]/20 rounded-3xl p-5 flex flex-col gap-4 shadow-[0_12px_32px_rgba(0,0,0,0.34)]">
                <div>
                  <div className="text-xs font-medium text-[#FAF6EC]/60 mb-1">
                    Technologies &amp; Skills Used
                  </div>
                  <div className="text-sm text-[#F3E3B4]/90">
                    {selectedProject.technologies.join(' · ')}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#FAF6EC]/10 flex flex-wrap items-center gap-3">
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playButton()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#0B0E12] bg-[#E5C97B] hover:bg-[#F3E3B4] rounded-2xl transition-colors whitespace-nowrap shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Live Example</span>
                  </a>
                  <a
                    href={selectedProject.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playButton()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#FAF6EC] border border-[#FAF6EC]/25 hover:border-[#E5C97B]/65 bg-[#0C1824]/85 rounded-2xl transition-colors whitespace-nowrap shrink-0"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-[#E5C97B]" aria-hidden="true" />
                    <span>Code Repository</span>
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#091522]/78 backdrop-blur-md border border-[#FAF6EC]/12 rounded-3xl p-6 text-sm text-[#FAF6EC]/65">
              Select a project slot to inspect its architecture and links.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
