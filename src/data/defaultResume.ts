import { ProficiencyLevel, ProficiencyMeta, ResumeData } from '../types/resume';

export const ASSETS = {
  abstractBg: '/src/assets/images/abstract_hyrule_canvas_1794939084951.jpg',
  avatar: '/assets/aistudio/Tomfoolery_pfp_but_smaller_dccd5c44.jpeg',
  aicCertificatePdf:
    '/assets/aistudio/Artificial_Intelligence_Micro-Certification__AIC__Product_School_bbd1e071.pdf',
  systemsPreview: '/src/assets/images/project_systems_preview_1794928801592.jpg',
  compilerPreview: '/src/assets/images/project_compiler_preview_1794928802290.jpg',
  webappPreview: '/src/assets/images/project_webapp_preview_1794928803662.jpg',
  korokSeed: '/src/assets/images/botw_korok_seed.png',
  korokMask: '/src/assets/images/bandana_swan_only.png',
  korokCharacter: '/src/assets/images/bandana_swan_only.png',
  korokAudioYahaha: '/src/assets/audio/korok-yahaha.mp3',
  korokAudioFound: '/src/assets/audio/botw-korok-found.mp3',
};

export const PROFICIENCY_SCALE: Record<ProficiencyLevel, ProficiencyMeta> = {
  4: {
    level: 4,
    label: 'Mastered',
    description:
      'Used extensively across self-directed web and mobile builds, coursework, and debugging independently.',
  },
  3: {
    level: 3,
    label: 'Proficient',
    description:
      'Comfortable architecting features, building end-to-end application flows, and shipping reliably.',
  },
  2: {
    level: 2,
    label: 'Working Knowledge',
    description:
      'Applied in academic labs, technical articles, or prototypes with solid conceptual grounding.',
  },
  1: {
    level: 1,
    label: 'Exploring',
    description:
      'Foundational familiarity through introductory coursework, reading, and early experiments.',
  },
};

export const DEFAULT_RESUME_DATA: ResumeData = {
  profile: {
    fullName: 'Mohammad Kanj Abo Alkanj',
    displayName: 'Mohammad Kanj',
    headline: 'AI Engineering · Flutter & Full-Stack Software Developer',
    phone: '0939250560',
    university: 'Arab International University (AIU)',
    degree: 'B.S. in Artificial Intelligence Engineering',
    gradYear: 'Expected Sep 2027',
    gpa: 'CS50x Certified',
    location: 'Damascus, Syria',
    email: 'mohammad.abu.al.kanj@gmail.com',
    githubUrl: 'https://github.com/Mohammad-kanj',
    linkedinUrl: 'https://www.linkedin.com/in/mohammad-kanj-445626278',
    youtubeUrl: 'https://github.com/Mohammad-kanj',
    coursework: [
      'CS50x (Harvard University)',
      'Algorithms & Data Structures',
      'Memory Management (C)',
      'RAG & AI Architectures',
      'Edge Computing & LoRa',
      'Relational Databases (SQL)',
    ],
    spokenLanguages: [
      'Arabic (Native)',
      'English (Fluent)',
      'German (A2 In Progress)',
    ],
  },
  summary:
    'Artificial Intelligence Engineering student at Arab International University and Harvard CS50x graduate building full-stack web and cross-platform mobile software. Experienced in taking interactive, real-time multiplayer applications from concept to deployment using React, TypeScript, Python (FastAPI), and Flutter/Dart, backed by core systems grounding in C, SQL, and modern AI architectures such as RAG and edge computing. Complemented by weekly technical writing and hands-on media production using Filmcraft and Photocraft.',
  summaryHighlights: [
    'AI Engineering & CS50x Foundation',
    'Flutter & Dart Mobile Apps',
    'React, TypeScript & FastAPI',
    'Technical Writing & Filmcraft / Photocraft',
  ],
  certifications: [
    {
      id: 'aic-product-school',
      title: 'Artificial Intelligence Micro-Certification (AIC)™',
      issuer: 'Product School, Inc.',
      date: 'Jan 14, 2026',
      credentialId: 'cert_qg8fjbm5',
      url: ASSETS.aicCertificatePdf,
      isPdf: true,
    },
    {
      id: 'cs50x-harvard',
      title: 'CS50x: Introduction to Computer Science',
      issuer: 'Harvard University',
      date: '2025',
      credentialId: '46a4433a-b4f1-4fce-9f1e-e548d8de319c',
      url: 'https://cs50.harvard.edu/certificates/46a4433a-b4f1-4fce-9f1e-e548d8de319c',
      isPdf: false,
    },
    {
      id: 'github-basics',
      title: 'GitHub Basics Certificate of Completion',
      issuer: 'Simplilearn SkillUP',
      date: 'Oct 2026',
      credentialId: '10905178',
    },
  ],
  skills: [
    // Programming Languages (Skill Tree Branch 1)
    {
      id: 'c-lang',
      name: 'C',
      category: 'Programming Languages',
      proficiency: 3,
      tier: 1,
      yearsOrContext: 'CS50x Systems',
      evidence:
        'Completed intensive Harvard CS50x problem sets covering pointers, memory management, and foundational algorithms.',
      iconKey: 'layers',
    },
    {
      id: 'python',
      name: 'Python',
      category: 'Programming Languages',
      proficiency: 4,
      tier: 2,
      yearsOrContext: 'FastAPI & AI',
      evidence:
        'Primary backend language for asynchronous FastAPI multiplayer servers, validation logic, and AI engineering work.',
      iconKey: 'terminal',
    },
    {
      id: 'sql',
      name: 'SQL',
      category: 'Programming Languages',
      proficiency: 3,
      tier: 2,
      yearsOrContext: 'Relational Data',
      evidence:
        'Applied relational schema modeling and queries across CS50x projects and backend persistence.',
      iconKey: 'database',
    },
    {
      id: 'ts',
      name: 'TypeScript',
      category: 'Programming Languages',
      proficiency: 4,
      tier: 3,
      yearsOrContext: 'Web & UI State',
      evidence:
        'Core language for responsive, type-safe React browser games, real-time leaderboards, and this portfolio.',
      iconKey: 'code',
    },
    {
      id: 'dart',
      name: 'Dart',
      category: 'Programming Languages',
      proficiency: 3,
      tier: 3,
      yearsOrContext: 'Flutter Mobile',
      evidence:
        'Built cross-platform mobile game state and UI interactions for Fraud Check on Android and iOS.',
      iconKey: 'cpu',
    },

    // Tools (Skill Tree Branch 2)
    {
      id: 'git',
      name: 'Git & GitHub',
      category: 'Tools',
      proficiency: 4,
      tier: 1,
      yearsOrContext: 'Certified Workflow',
      evidence:
        'Version control across solo and team software builds; Simplilearn GitHub Basics certified.',
      iconKey: 'gitBranch',
    },
    {
      id: 'react',
      name: 'React',
      category: 'Tools',
      proficiency: 4,
      tier: 2,
      yearsOrContext: 'Frontend UI',
      evidence:
        'Built state-driven multiplayer web interfaces, leaderboards, and interactive round progression in "Top 100".',
      iconKey: 'layout',
    },
    {
      id: 'fastapi',
      name: 'FastAPI',
      category: 'Tools',
      proficiency: 4,
      tier: 2,
      yearsOrContext: 'Async Python APIs',
      evidence:
        'Architected low-latency room management, answer ranking validation, and scoring endpoints.',
      iconKey: 'server',
    },
    {
      id: 'flutter',
      name: 'Flutter',
      category: 'Tools',
      proficiency: 4,
      tier: 3,
      yearsOrContext: 'Android & iOS',
      evidence:
        'Engineered "Fraud Check" end-to-end with Flutter for smooth cross-platform mobile gameplay.',
      iconKey: 'box',
    },
    {
      id: 'filmcraft',
      name: 'Filmcraft',
      category: 'Tools',
      proficiency: 3,
      tier: 3,
      yearsOrContext: 'Formerly Premiere Pro',
      evidence:
        'Video editing for YouTube content production after moving from Adobe Premiere Pro to Filmcraft.',
      iconKey: 'workflow',
    },
    {
      id: 'photocraft',
      name: 'Photocraft',
      category: 'Tools',
      proficiency: 3,
      tier: 3,
      yearsOrContext: 'Formerly Photoshop',
      evidence:
        'Visual editing, thumbnails, and presentation assets after moving from Adobe Photoshop to Photocraft.',
      iconKey: 'compass',
    },

    // Methodologies (Skill Tree Branch 3)
    {
      id: 'algo-ds',
      name: 'Algorithms & Data Structures',
      category: 'Methodologies',
      proficiency: 4,
      tier: 1,
      yearsOrContext: 'CS50x & AIU',
      evidence:
        'Strong grounding in algorithmic problem solving, memory safety, and complexity analysis.',
      iconKey: 'check',
    },
    {
      id: 'rag-ai',
      name: 'RAG & AI Architectures',
      category: 'Methodologies',
      proficiency: 3,
      tier: 2,
      yearsOrContext: 'AI Engineering',
      evidence:
        'Focused study and technical writing on Retrieval-Augmented Generation and practical AI architectures.',
      iconKey: 'network',
    },
    {
      id: 'lora-edge',
      name: 'LoRa & Edge Computing',
      category: 'Methodologies',
      proficiency: 2,
      tier: 2,
      yearsOrContext: 'Systems Research',
      evidence:
        'Published clear engineering breakdowns on low-power networking and edge computing concepts.',
      iconKey: 'globe',
    },
    {
      id: 'rev-eng',
      name: 'Reverse Engineering',
      category: 'Methodologies',
      proficiency: 2,
      tier: 3,
      yearsOrContext: 'Binary & Systems',
      evidence:
        'Explored reverse engineering principles and communicated core concepts through technical posts.',
      iconKey: 'shield',
    },

    // Soft Skills (Skill Tree Branch 4)
    {
      id: 'problem-solving',
      name: 'Analytical Problem Solving',
      category: 'Soft Skills',
      proficiency: 4,
      tier: 1,
      yearsOrContext: 'Concept to Deploy',
      evidence:
        'Ships self-directed multiplayer games and full-stack software from initial mechanics to deployment.',
      iconKey: 'target',
    },
    {
      id: 'tech-writing',
      name: 'Technical Writing',
      category: 'Soft Skills',
      proficiency: 4,
      tier: 2,
      yearsOrContext: 'LinkedIn & Docs',
      evidence:
        'Weekly LinkedIn writer distilling RAG, LoRa, and software engineering topics for engineers and students.',
      iconKey: 'book',
    },
    {
      id: 'teamwork',
      name: 'Cross-Functional Teamwork',
      category: 'Soft Skills',
      proficiency: 4,
      tier: 2,
      yearsOrContext: 'Teams & Sports',
      evidence:
        'Collaborated in competitive team sprints and won 1st place in the AIU Volleyball Championship.',
      iconKey: 'users',
    },
    {
      id: 'public-speaking',
      name: 'Public Speaking & Media',
      category: 'Soft Skills',
      proficiency: 3,
      tier: 3,
      yearsOrContext: 'YouTube & Pitches',
      evidence:
        'Scripted and recorded a weekly chess YouTube channel; preparing a programming & tech channel.',
      iconKey: 'message',
    },
  ],
  projects: [
    {
      id: 'top-100',
      title: '"Top 100" — Multiplayer Web Trivia Game',
      subtitle: 'Real-Time Browser Game',
      category: 'Full-Stack Web',
      year: 'Present',
      description:
        'Interactive multiplayer browser game inspired by the Sidemen "Top 100" format, where players compete to guess entries within a category and earn higher scores for lower-ranked answers.',
      highlights: [
        'Built a responsive, state-driven frontend in React and TypeScript for live player guesses, leaderboards, and round progression.',
        'Architected an asynchronous Python and FastAPI backend managing game rooms, answer ranking validation, and point calculation.',
      ],
      technologies: ['React', 'TypeScript', 'Python', 'FastAPI'],
      liveUrl: 'https://github.com/Mohammad-kanj',
      repoUrl: 'https://github.com/Mohammad-kanj',
      image: ASSETS.webappPreview,
      isPlaceholder: false,
    },
    {
      id: 'fraud-check',
      title: '"Fraud Check" — Social Deduction Mobile Game',
      subtitle: 'Cross-Platform Party Game',
      category: 'Cross-Platform Mobile',
      year: 'Present',
      description:
        'English-language multiplayer social deduction party game (inspired by Barra Al Salfa), where players ask strategic questions to expose the "fraud" who does not know the secret word.',
      highlights: [
        'Designed the complete round loop, role assignment, and deduction mechanics from concept to mobile build.',
        'Implemented entirely with Flutter and Dart for smooth cross-platform performance on both Android and iOS.',
      ],
      technologies: ['Flutter', 'Dart', 'Android', 'iOS'],
      liveUrl: 'https://github.com/Mohammad-kanj',
      repoUrl: 'https://github.com/Mohammad-kanj',
      image: ASSETS.systemsPreview,
      isPlaceholder: false,
    },
    {
      id: 'hyrule-resume',
      title: 'Hyrule Slate — Interactive Portfolio',
      subtitle: 'Breath of the Wild Menu Website',
      category: 'Full-Stack Web',
      year: '2026',
      description:
        'Personal resume and portfolio website modeled after the Breath of the Wild main title screen, Sheikah Slate showcase, Skill Tree, and Hero’s Path timeline.',
      highlights: [
        'Built with React, TypeScript, Tailwind CSS, and Motion transitions with a printable single-page ATS resume.',
      ],
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Motion'],
      liveUrl: 'https://github.com/Mohammad-kanj',
      repoUrl: 'https://github.com/Mohammad-kanj',
      image: ASSETS.compilerPreview,
      isPlaceholder: false,
    },
    {
      id: 'ai-placeholder',
      title: '[Project Placeholder] — Upcoming AI / Tech Build',
      subtitle: 'Reserved Capstone / Repo Slot',
      category: 'AI & Systems',
      year: '2026–2027',
      description:
        'Placeholder slot reserved for an upcoming Artificial Intelligence Engineering project (such as a RAG workflow, Edge/LoRa prototype, or final-year capstone).',
      highlights: [
        'Ready to swap in project title, summary, stack, and live repository links directly in source code.',
      ],
      technologies: ['Python', 'RAG', 'AI Engineering', 'SQL'],
      liveUrl: 'https://github.com/Mohammad-kanj',
      repoUrl: 'https://github.com/Mohammad-kanj',
      image: ASSETS.systemsPreview,
      isPlaceholder: true,
    },
  ],
  experiences: [
    {
      id: 'linkedin-creator',
      type: 'Experience',
      role: 'Technical Content Creator',
      organization: 'LinkedIn',
      location: 'Remote',
      timeframe: 'Present',
      summary:
        'Publish weekly technical posts breaking down emerging AI and systems topics for engineers and students.',
      bullets: [
        'Covers RAG (Retrieval-Augmented Generation), LoRa, Edge Computing, and Reverse Engineering.',
      ],
      skillsUsed: ['RAG & AI Architectures', 'LoRa & Edge Computing', 'Technical Writing'],
    },
    {
      id: 'aiu-degree',
      type: 'Education',
      role: 'B.S. in Artificial Intelligence Engineering',
      organization: 'Arab International University (AIU)',
      location: 'Ghabagheb, Damascus, Syria',
      timeframe: 'Expected Sep 2027',
      summary:
        'Final-year AI Engineering student; 1st Place University Volleyball Champion representing Faculty of Informatics Engineering (May 2026).',
      bullets: [
        'Coursework in AI systems, algorithms, software engineering, and databases.',
      ],
      skillsUsed: ['Python', 'Algorithms & Data Structures', 'Cross-Functional Teamwork'],
    },
    {
      id: 'media-youtube',
      type: 'Experience',
      role: 'YouTube Content Creator & Presentation Designer',
      organization: 'Chess & Upcoming Tech Channel · Freelance',
      location: 'Damascus, Syria',
      timeframe: 'Ongoing',
      summary:
        'Managed scripting, recording, and editing for a weekly chess strategy channel using Filmcraft & Photocraft; designed an academic Master’s presentation in Dentistry.',
      bullets: [
        'Transitioned media workflow from Premiere Pro & Photoshop to Filmcraft & Photocraft; preparing a new programming & technology channel.',
      ],
      skillsUsed: ['Filmcraft', 'Photocraft', 'Public Speaking & Media'],
    },
    {
      id: 'certifications',
      type: 'Milestone',
      role: 'CS50x & Technical Certifications',
      organization: 'Harvard University · Product School · Simplilearn',
      location: 'Verified Online',
      timeframe: '2025 — 2026',
      summary:
        'Harvard CS50x (C, Python, SQL, memory management, 10 problem sets & final project), Product School Artificial Intelligence Micro-Certification (Jan 2026), and GitHub Basics (Oct 2026).',
      bullets: [
        'Verified CS50x Certificate: cs50.harvard.edu/certificates/46a4433a-b4f1-4fce-9f1e-e548d8de319c',
      ],
      skillsUsed: ['C', 'Python', 'SQL', 'Git & GitHub'],
    },
    {
      id: 'startup-syria',
      type: 'Experience',
      role: 'Startup Team Collaborator (Two-Time Participant)',
      organization: 'Startup Syria',
      location: 'Syria',
      timeframe: '2025 — 2026',
      summary:
        'Worked in cross-functional startup teams under tight deadlines to evaluate product ideas, validate business models, and pitch solutions.',
      bullets: [
        'Partnered with product and engineering teammates to prepare structured startup pitches.',
      ],
      skillsUsed: ['Cross-Functional Teamwork', 'Analytical Problem Solving'],
    },
  ],
};
