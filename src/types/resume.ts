export type MenuSectionId = 'adventure' | 'skills' | 'portfolio';

export type SkillCategory =
  | 'Programming Languages'
  | 'Tools'
  | 'Soft Skills';

export type ProficiencyLevel = 1 | 2 | 3 | 4;

export interface ProficiencyMeta {
  level: ProficiencyLevel;
  label: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  tier: 1 | 2 | 3;
  yearsOrContext: string;
  evidence: string;
  iconKey: string;
}

export type ProjectCategory =
  | 'Full-Stack Web'
  | 'Mobile App'
  | 'AI & Systems';

export interface ProjectGalleryImage {
  src: string;
  caption?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  year: string;
  description: string;
  highlights: string[];
  technologies: string[];
  liveUrl?: string;
  repoUrl?: string;
  image: string;
  gallery?: ProjectGalleryImage[];
  mediaOrientation?: 'landscape' | 'portrait';
  isPlaceholder?: boolean;
}

export interface ExperienceItem {
  id: string;
  type: 'Experience' | 'Education' | 'Milestone' | 'Certificates' | 'Media' | 'Design';
  role: string;
  organization: string;
  location: string;
  timeframe: string;
  summary: string;
  bullets: string[];
  skillsUsed: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
  isPdf?: boolean;
}

export interface ProfileData {
  fullName: string;
  displayName: string;
  headline: string;
  phone: string;
  university: string;
  degree: string;
  gradYear: string;
  gpa: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  presentationPostUrl?: string;
  youtubeUrl: string;
  instagramUrl?: string;
  coursework: string[];
  spokenLanguages: string[];
}

export interface SummaryPoint {
  label: string;
  text: string;
}

export interface ResumeData {
  profile: ProfileData;
  summary: string;
  summaryPoints: SummaryPoint[];
  summaryHighlights: string[];
  certifications: CertificationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  experiences: ExperienceItem[];
}
