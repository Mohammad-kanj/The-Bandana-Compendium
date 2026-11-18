import { ResumeData, SkillCategory } from '../types/resume';

interface PrintResumeSheetProps {
  data: ResumeData;
}

const SKILL_CATEGORIES: SkillCategory[] = [
  'Programming Languages',
  'Tools',
  'Soft Skills',
];

export function PrintResumeSheet({ data }: PrintResumeSheetProps) {
  const experienceEntries = data.experiences.filter((e) => e.type !== 'Education');
  const educationEntries = data.experiences.filter((e) => e.type === 'Education');

  return (
    <div className="hidden print:block bg-white text-neutral-900 font-sans text-[10.5pt] leading-snug">
      <header className="border-b border-neutral-800 pb-2 mb-3">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          {data.profile.fullName}
        </h1>
        <div className="text-xs text-neutral-700 mt-0.5">
          {data.profile.location} · {data.profile.phone} · {data.profile.email} ·{' '}
          {data.profile.githubUrl} · {data.profile.linkedinUrl}
        </div>
      </header>

      <section className="mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-300 pb-0.5 mb-1.5">
          Summary
        </h2>
        <p className="text-xs text-neutral-800">{data.summary}</p>
      </section>

      <section className="mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-300 pb-0.5 mb-1.5">
          Education &amp; Certifications
        </h2>
        {educationEntries.map((edu) => (
          <div key={edu.id} className="mb-1.5">
            <div className="flex justify-between font-semibold text-xs">
              <span>
                {edu.role} — {edu.organization}
              </span>
              <span>{edu.timeframe}</span>
            </div>
            <div className="text-xs text-neutral-700 mt-0.5">{edu.summary}</div>
            <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-xs text-neutral-800">
              {edu.bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-300 pb-0.5 mb-1.5">
          Skills &amp; Tools
        </h2>
        <div className="space-y-1 text-xs">
          {SKILL_CATEGORIES.map((category) => {
            const list = data.skills
              .filter((s) => s.category === category)
              .map((s) => s.name)
              .join(', ');
            return (
              <div key={category}>
                <span className="font-semibold text-neutral-900">{category}: </span>
                <span className="text-neutral-800">{list}</span>
              </div>
            );
          })}
          <div>
            <span className="font-semibold text-neutral-900">Languages: </span>
            <span className="text-neutral-800">
              {data.profile.spokenLanguages.join(', ')}
            </span>
          </div>
        </div>
      </section>

      <section className="mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-300 pb-0.5 mb-1.5">
          Experience &amp; Milestones
        </h2>
        <div className="space-y-2">
          {experienceEntries.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between font-semibold text-xs">
                <span>
                  {exp.role} · {exp.organization}
                </span>
                <span>{exp.timeframe}</span>
              </div>
              <p className="text-xs text-neutral-800 mt-0.5">{exp.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-300 pb-0.5 mb-1.5">
          Technical Projects
        </h2>
        <div className="space-y-2">
          {data.projects
            .filter((p) => !p.isPlaceholder)
            .map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between font-semibold text-xs">
                  <span>
                    {proj.title} ({proj.technologies.join(', ')})
                  </span>
                  <span>{proj.year}</span>
                </div>
                <p className="text-xs text-neutral-800 mt-0.5">{proj.description}</p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
