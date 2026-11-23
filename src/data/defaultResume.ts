import { ProficiencyLevel, ProficiencyMeta, ResumeData } from '../types/resume';

export const ASSETS = {
  abstractBg: '/src/assets/images/abstract_hyrule_canvas_1794939084951.jpg',
  avatar: '/assets/aistudio/Tomfoolery_pfp_but_smaller_dccd5c44.jpeg',
  aicCertificatePdf:
    '/assets/aistudio/Artificial_Intelligence_Micro-Certification__AIC__Product_School_bbd1e071.pdf',
  volleyballCertificatePdf: '/assets/aistudio/Volleyball_Certificate_48549b45.pdf',
  resumeCvPdf: '/assets/aistudio/Mohamad_Kanj_CV_555ec961.pdf',
  systemsPreview: '/src/assets/images/project_systems_preview_1794928801592.jpg',
  compilerPreview: '/src/assets/images/project_compiler_preview_1794928802290.jpg',
  webappPreview: '/src/assets/images/project_webapp_preview_1794928803662.jpg',
  korokSeed: '/src/assets/images/botw_korok_seed.png',
  korokMask: '/src/assets/images/bandana_swan_only.png',
  korokCharacter: '/src/assets/images/bandana_swan_only.png',
  korokAudioYahaha: '/src/assets/audio/korok-yahaha.mp3',
  korokAudioFound: '/src/assets/audio/botw-korok-found.mp3',
  botwPuzzleSolved: '/src/assets/audio/botw-puzzle-solved.mp3',
  sheikahSlateOpen: '/src/assets/audio/sheikah-slate-open.mp3',
  sheikahSlateClose: '/src/assets/audio/sheikah-slate-close.mp3',
  sheikahTabClick: '/src/assets/audio/sheikah-tab-click.mp3',
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
    phone: '+963 939 250 560',
    university: 'Arab International University (AIU)',
    degree: 'B.S. in Artificial Intelligence Engineering',
    gradYear: 'Expected Sep 2027',
    gpa: 'CS50x Certified',
    location: 'Damascus, Syria',
    email: 'mohammad.abu.al.kanj@gmail.com',
    githubUrl: 'https://github.com/Mohammad-kanj',
    linkedinUrl: 'https://www.linkedin.com/in/mohammad-kanj-445626278',
    presentationPostUrl: 'https://lnkd.in/p/dV86hJNF',
    youtubeUrl: 'https://www.youtube.com/@bandana-boi143/videos',
    instagramUrl: 'https://www.instagram.com/bandanaboi.143?bqrl=M2VpdzdpbXhjMTRp',
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
    'Artificial Intelligence Engineering student at Arab International University building full-stack web apps, cross-platform mobile games, and technical content.',
  summaryPoints: [
    {
      label: 'Full-Stack & Mobile Development',
      text: 'Build interactive, real-time web apps and cross-platform mobile games from concept to deployment using React, TypeScript, Python (FastAPI), and Flutter/Dart.',
    },
    {
      label: 'CS & AI Foundations',
      text: 'Grounded in core coursework spanning algorithms, data structures, C memory management, relational SQL databases, RAG pipelines, and edge computing / LoRa.',
    },
    {
      label: 'Technical Writing & Content Creation',
      text: 'Publish weekly technical breakdowns on LinkedIn and produce long- & short-form video content and custom thumbnails using Filmcraft and Photocraft.',
    },
    {
      label: 'Presentation Design',
      text: 'Craft dynamic Microsoft PowerPoint decks featuring integrated 3D models, smooth slide-to-slide transitions, and clear visual storytelling.',
    },
    {
      label: 'Active & Continuous Learner',
      text: 'Constantly exploring emerging AI tools, modern software architectures, and new technologies through self-directed builds, certifications, and hands-on experimentation.',
    },
    {
      label: 'Collaboration & Leadership',
      text: 'Thrive in team-driven engineering builds and competitive environments—1st place winner in the AIU Volleyball Championship.',
    },
  ],
  summaryHighlights: [
    'AI Engineering & CS50x',
    'Flutter & Full-Stack Web',
    'Technical Writing & Media',
    'Filmcraft · Photocraft',
  ],
  certifications: [
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
      id: 'aic-product-school',
      title: 'Artificial Intelligence Micro-Certification (AIC)™',
      issuer: 'Product School, Inc.',
      date: '2026',
      credentialId: 'cert_qg8fjbm5',
      url: ASSETS.aicCertificatePdf,
      isPdf: true,
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
      yearsOrContext: 'Version Control',
      evidence:
        'Version control and collaborative branching workflows across solo and team software builds.',
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
        'YouTube thumbnail design and custom graphic assets using Adobe Photoshop and its alternative Photocraft.',
      iconKey: 'compass',
    },

    // Soft Skills (Skill Tree Branch 3)
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
        'Weekly LinkedIn writer distilling programming, IT, software engineering, and AI concepts for engineers and students.',
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
      title: 'Personal Portfolio Website (This Site)',
      subtitle: 'Breath of the Wild Interactive Resume',
      category: 'Full-Stack Web',
      year: '2026',
      description:
        'Personal resume and portfolio website modeled after the Breath of the Wild main menu, featuring an expanding Sheikah Slate workspace, Skill Tree, collectible Borok medallions, and Hero’s Path timeline.',
      highlights: [
        'Built with React, TypeScript, Tailwind CSS, and Motion with responsive single-container transitions and an ATS print resume.',
      ],
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Motion'],
      liveUrl: 'https://github.com/Mohammad-kanj',
      repoUrl: 'https://github.com/Mohammad-kanj',
      image: ASSETS.compilerPreview,
      isPlaceholder: false,
    },
    {
      id: 'family-feud-control-board',
      title: 'Family Feud Control Board',
      subtitle: 'Live Game Show Host Console',
      category: 'Full-Stack Web',
      year: '2026',
      description:
        'Interactive host control board and live presentation display for running Family Feud rounds with instant answer reveals, strike indicators, face-off buzzers, and team score tracking.',
      highlights: [
        'Designed for smooth dual-screen host control and synchronized audience scoreboard updates during live games.',
      ],
      technologies: ['React', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
      liveUrl: 'https://github.com/Mohammad-kanj',
      repoUrl: 'https://github.com/Mohammad-kanj',
      image: ASSETS.webappPreview,
      isPlaceholder: true,
    },
    {
      id: 'internet-speed-tester-banet',
      title: 'Internet Speed Tester (Banet)',
      subtitle: 'Network Diagnostics & Bandwidth Tool',
      category: 'AI & Systems',
      year: '2026',
      description:
        'Clean network diagnostics and bandwidth testing application measuring download/upload throughput, ping latency, and connection stability in real time.',
      highlights: [
        'Engineered for fast throughput sampling, latency jitter reporting, and clear visual speed diagnostics.',
      ],
      technologies: ['Python', 'Networking', 'Latency & Throughput', 'Web UI'],
      liveUrl: 'https://github.com/Mohammad-kanj',
      repoUrl: 'https://github.com/Mohammad-kanj',
      image: ASSETS.systemsPreview,
      isPlaceholder: true,
    },
    {
      id: 'krillion-leaderboard',
      title: 'Krillion Leaderboard',
      subtitle: 'Competitive Standings & Score Tracker',
      category: 'Full-Stack Web',
      year: '2026',
      description:
        'Real-time leaderboard platform built to rank players, track seasonal points, highlight top performers, and keep competitive standings organized.',
      highlights: [
        'Features responsive ranking tables, automated score updates, and quick search/filtering across player tiers.',
      ],
      technologies: ['React', 'TypeScript', 'FastAPI', 'SQL'],
      liveUrl: 'https://github.com/Mohammad-kanj',
      repoUrl: 'https://github.com/Mohammad-kanj',
      image: ASSETS.compilerPreview,
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
        'Publish weekly technical articles breaking down core IT, programming, software engineering, and AI concepts to strengthen my own mastery and help those who come after.',
      bullets: [
        'Share approachable breakdowns covering general IT fundamentals, programming & software engineering practices, and AI concepts (including RAG, LoRa, Edge Computing, and Reverse Engineering).',
      ],
      skillsUsed: ['Programming & IT', 'Software Engineering', 'AI Concepts', 'Technical Writing'],
    },
    {
      id: 'aiu-degree',
      type: 'Education',
      role: 'B.S. in Artificial Intelligence Engineering',
      organization: 'Arab International University (AIU)',
      location: 'Ghabagheb, Damascus, Syria',
      timeframe: 'Expected Sep 2027',
      summary:
        'Undergraduate degree building core foundations across artificial intelligence, algorithms, and software engineering.',
      bullets: [
        'Undergraduate AI Engineering student studying AI systems, algorithms, software engineering, and databases.',
        '1st Place University Volleyball Champion representing Faculty of Informatics Engineering (May 2026).',
      ],
      skillsUsed: ['Python', 'Algorithms & Data Structures', 'Cross-Functional Teamwork'],
    },
    {
      id: 'presentation-designer',
      type: 'Design',
      role: 'Presentation Designer',
      organization: 'Microsoft PowerPoint · Freelance',
      location: 'Damascus, Syria',
      timeframe: 'Freelance',
      summary:
        'Built dynamic PowerPoint presentations showcasing integrated 3D models, smooth transitions, and clean visual storytelling.',
      bullets: [
        'Published a LinkedIn post introducing my PowerPoint skills, highlighting 3D model integration and seamless slide-to-slide transitions.',
        'Focused on structured slide pacing and engaging motion design to present complex ideas clearly.',
      ],
      skillsUsed: ['Microsoft PowerPoint', '3D Models & Transitions', 'Visual Storytelling'],
    },
    {
      id: 'media-youtube',
      type: 'Media',
      role: 'Social Media & Content Creator',
      organization: 'Bandana-Boi · YouTube & Instagram',
      location: 'Damascus, Syria',
      timeframe: 'Apr 2026 — Aug 2026',
      summary:
        'Ran the "Bandana-Boi" chess content channel across YouTube and Instagram Reels, editing long-form videos, adapting highlights into short-form Reels, and designing custom thumbnails.',
      bullets: [
        'Produced chess videos on YouTube and edited vertical short-form clips from those videos for Instagram Reels (@bandanaboi.143).',
        'Designed custom thumbnails and graphics using Adobe Photoshop and its alternative Photocraft, and transitioned video editing from Adobe Premiere Pro to Filmcraft.',
      ],
      skillsUsed: ['Photoshop & Photocraft', 'Filmcraft', 'Instagram Reels', 'Thumbnail Design'],
    },
    {
      id: 'certifications',
      type: 'Certificates',
      role: 'CS50x & Technical Certifications',
      organization: 'Harvard University · Product School',
      location: 'Verified Online',
      timeframe: '2025 — 2026',
      summary:
        'Verified credentials spanning foundational computer science and artificial intelligence.',
      bullets: [
        'Harvard CS50x: Introduction to Computer Science (2025) — C, Python, SQL, memory management, 10 problem sets & final project.',
        'Product School Artificial Intelligence Micro-Certification (AIC)™ (2026).',
      ],
      skillsUsed: ['C', 'Python', 'SQL', 'AI Fundamentals'],
    },
  ],
};
