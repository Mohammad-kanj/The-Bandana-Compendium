import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useSound } from '../context/SoundContext';
import { PROFICIENCY_SCALE } from '../data/defaultResume';
import { ProficiencyLevel, SkillCategory, SkillItem } from '../types/resume';
import { BotWSlotFrame, SheikahProficiencyGauge } from './BotWSlotFrame';
import { SkillIcon } from './SkillIcon';

interface SkillTreeTabProps {
  skills: SkillItem[];
}

const BRANCH_CATEGORIES: ('All Branches' | SkillCategory)[] = [
  'All Branches',
  'Programming Languages',
  'Tools',
  'Soft Skills',
];

const BRANCH_ORDER: SkillCategory[] = [
  'Programming Languages',
  'Tools',
  'Soft Skills',
];

const TIER_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Foundation',
  2: 'Applied',
  3: 'Specialized',
};

export function SkillTreeTab({ skills }: SkillTreeTabProps) {
  const { playButton } = useSound();
  const [branchFilter, setBranchFilter] = useState<'All Branches' | SkillCategory>(
    'All Branches'
  );
  const [filterDirection, setFilterDirection] = useState<number>(1);
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.id ?? '');

  const visibleBranches = useMemo(() => {
    if (branchFilter === 'All Branches') return BRANCH_ORDER;
    return [branchFilter];
  }, [branchFilter]);

  const filteredSkills = useMemo(() => {
    if (branchFilter === 'All Branches') return skills;
    return skills.filter((s) => s.category === branchFilter);
  }, [skills, branchFilter]);

  useEffect(() => {
    if (!filteredSkills.some((s) => s.id === selectedSkillId) && filteredSkills[0]) {
      setSelectedSkillId(filteredSkills[0].id);
    }
  }, [filteredSkills, selectedSkillId]);

  const selectedSkill =
    filteredSkills.find((s) => s.id === selectedSkillId) || filteredSkills[0];

  const handleSelectBranch = (nextBranch: 'All Branches' | SkillCategory) => {
    playButton();
    const prevIdx = BRANCH_CATEGORIES.indexOf(branchFilter);
    const nextIdx = BRANCH_CATEGORIES.indexOf(nextBranch);
    setFilterDirection(nextIdx >= prevIdx ? 1 : -1);
    setBranchFilter(nextBranch);
  };

  const proficiencyMeta = selectedSkill
    ? PROFICIENCY_SCALE[selectedSkill.proficiency]
    : PROFICIENCY_SCALE[3];

  return (
    <div className="space-y-5">
      {/* Branch Filter Toolbar */}
      <div className="botw-panel rounded-sm px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="tablist"
          aria-label="Skill Tree Branches"
        >
          {BRANCH_CATEGORIES.map((branch) => {
            const active = branchFilter === branch;
            return (
              <button
                key={branch}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleSelectBranch(branch)}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF] ${
                  active
                    ? 'bg-[#4CE4FF]/16 text-[#9AF0FF] border border-[#4CE4FF]/60'
                    : 'text-[#FAF6EC]/70 hover:text-[#FAF6EC] border border-transparent'
                }`}
              >
                {branch}
              </button>
            );
          })}
        </div>

        <span className="font-mono text-xs tabular-nums text-[#FAF6EC]/60">
          {filteredSkills.length} nodes
        </span>
      </div>

      {/* Skill Tree + Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Visual Branching Skill Tree */}
        <div className="lg:col-span-7 botw-panel rounded-sm p-5 sm:p-6 overflow-hidden">
          <div className="flex items-baseline justify-between gap-4 pb-3 mb-5 border-b border-[#4CE4FF]/20">
            <h1 className="font-display italic text-2xl font-semibold text-[#F3E3B4]">
              Skill Tree
            </h1>
            <span className="text-xs text-[#4CE4FF]">
              Core Foundation → Applied → Specialized
            </span>
          </div>

          <AnimatePresence mode="wait" custom={filterDirection}>
            <motion.div
              key={branchFilter}
              custom={filterDirection}
              initial={{ opacity: 0, x: filterDirection * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -filterDirection * 32 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-7"
            >
              {visibleBranches.map((branch) => {
                const branchSkills = skills.filter((s) => s.category === branch);
                const tier1 = branchSkills.filter((s) => s.tier === 1);
                const tier2 = branchSkills.filter((s) => s.tier === 2);
                const tier3 = branchSkills.filter((s) => s.tier === 3);

                return (
                  <div key={branch} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="w-2 h-2 rotate-45 bg-[#4CE4FF] shadow-[0_0_8px_rgba(76,228,255,0.85)]"
                      />
                      <h2 className="text-xs font-semibold tracking-[0.08em] uppercase text-[#9AF0FF]">
                        {branch}
                      </h2>
                      <span className="h-[1px] flex-1 bg-gradient-to-r from-[#4CE4FF]/35 to-transparent" />
                    </div>

                    {/* 3-Tier Connected Tree Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative items-stretch">
                      {[tier1, tier2, tier3].map((tierNodes, tierIdx) => (
                        <div
                          key={tierIdx}
                          className="relative flex flex-col gap-2.5 justify-center"
                        >
                          {/* Glowing Connector Line between tiers on desktop */}
                          {tierIdx < 2 && (
                            <span
                              aria-hidden="true"
                              className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-[2px] bg-[#4CE4FF]/55 shadow-[0_0_6px_rgba(76,228,255,0.75)]"
                            />
                          )}

                          <div className="text-[10px] font-mono text-[#FAF6EC]/45 uppercase tracking-wider">
                            {TIER_LABELS[(tierIdx + 1) as 1 | 2 | 3]}
                          </div>

                          {tierNodes.map((skill) => {
                            const isSelected = selectedSkill?.id === skill.id;
                            return (
                              <BotWSlotFrame
                                key={skill.id}
                                selected={isSelected}
                                onClick={() => {
                                  playButton();
                                  setSelectedSkillId(skill.id);
                                }}
                                ariaLabel={`${skill.name} — ${PROFICIENCY_SCALE[skill.proficiency].label}`}
                                className="p-3 flex items-center justify-between gap-2.5"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className={`p-1.5 rounded-sm border shrink-0 ${
                                      isSelected
                                        ? 'text-[#4CE4FF] border-[#4CE4FF]/55 bg-[#4CE4FF]/12'
                                        : 'text-[#FAF6EC]/75 border-[#FAF6EC]/12 bg-[#0B0E12]/60'
                                    }`}
                                  >
                                    <SkillIcon iconKey={skill.iconKey} className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold text-[#FAF6EC] truncate">
                                      {skill.name}
                                    </div>
                                    <div className="mt-1.5">
                                      <SheikahProficiencyGauge
                                        level={skill.proficiency}
                                        showNumeric={false}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </BotWSlotFrame>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Skill Node Inspector */}
        <aside className="lg:col-span-5 botw-panel rounded-sm p-6 flex flex-col justify-between">
          {selectedSkill ? (
            <div>
              <div className="flex items-center justify-between gap-3 text-xs text-[#4CE4FF]">
                <span>
                  {selectedSkill.category} · {TIER_LABELS[selectedSkill.tier]}
                </span>
                <span className="font-mono tabular-nums text-[#FAF6EC]/65">
                  {selectedSkill.yearsOrContext}
                </span>
              </div>

              <div className="mt-2 pb-4 border-b border-[#FAF6EC]/12 flex items-center gap-3.5">
                <div className="p-3 rounded-sm border border-[#4CE4FF]/45 bg-[#08121B]/85 text-[#4CE4FF]">
                  <SkillIcon iconKey={selectedSkill.iconKey} className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display italic text-3xl font-semibold text-[#F3E3B4] leading-none">
                    {selectedSkill.name}
                  </h2>
                  <div className="mt-2.5 flex flex-wrap items-center gap-3">
                    <SheikahProficiencyGauge
                      level={selectedSkill.proficiency}
                      size="md"
                    />
                    <span className="text-xs font-semibold text-[#FAF6EC]">
                      {proficiencyMeta.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <div className="text-xs font-medium text-[#FAF6EC]/60 mb-1">
                    Applied Evidence
                  </div>
                  <p className="text-sm leading-relaxed text-[#FAF6EC]/90">
                    {selectedSkill.evidence}
                  </p>
                </div>

                <div className="p-3.5 bg-[#08121B]/75 border border-[#4CE4FF]/20 rounded-sm">
                  <div className="text-xs font-semibold text-[#9AF0FF]">
                    Proficiency Tier · {proficiencyMeta.label}
                  </div>
                  <p className="text-xs text-[#FAF6EC]/72 mt-1 leading-relaxed">
                    {proficiencyMeta.description}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-[#FAF6EC]/65">
              Select a node in the Skill Tree to inspect details.
            </div>
          )}

          {/* Proficiency Scale Legend */}
          <div className="mt-6 pt-4 border-t border-[#FAF6EC]/12">
            <div className="text-xs font-semibold text-[#FAF6EC]/80 mb-2.5">
              Sheikah Proficiency Gauge Scale
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              {([4, 3, 2, 1] as ProficiencyLevel[]).map((lvl) => (
                <div key={lvl} className="flex items-center justify-between gap-2">
                  <span className="text-[#FAF6EC]/75">
                    {PROFICIENCY_SCALE[lvl].label}
                  </span>
                  <SheikahProficiencyGauge level={lvl} showNumeric={false} />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
