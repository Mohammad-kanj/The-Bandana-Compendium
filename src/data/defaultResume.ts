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
  fraudCheckTitle: '/assets/enhanced/fraudcheck_1.jpg',
  fraudCheckModes: '/assets/enhanced/fraudcheck_2.jpg',
  fraudCheckCategories: '/assets/enhanced/fraudcheck_3.jpg',
  fraudCheckPlayers: '/assets/enhanced/fraudcheck_4.jpg',
  top100Menu: '/assets/enhanced/top100_menu.png',
  top100Gameplay: '/assets/enhanced/top100_gameplay.png',
  top100Setup: '/assets/enhanced/top100_setup.png',
  top100Online: '/assets/enhanced/top100_online.png',
  top100Teams: '/assets/enhanced/top100_teams.png',
  top100Dealing: '/assets/enhanced/top100_dealing.png',
  krillionBoards: '/assets/enhanced/krillion_1.jpg',
  krillionFilters: '/assets/enhanced/krillion_2.jpg',
  krillionSubmit: '/assets/enhanced/krillion_3.jpg',
  krillionPlayers: '/assets/enhanced/krillion_4.jpg',
  banetLiveHud: '/assets/enhanced/banet_1.png',
  banetSpeedTest: '/assets/enhanced/banet_2.png',
  banetAnalytics: '/assets/enhanced/banet_3.png',
  banetHistory: '/assets/enhanced/banet_4.png',
  familyFeudRevealed: '/assets/enhanced/familyfeud_revealed.png',
  familyFeudSteal: '/assets/enhanced/familyfeud_steal.png',
  familyFeudFaceoff: '/assets/enhanced/familyfeud_faceoff.png',
  familyFeudFullscreen: '/assets/enhanced/familyfeud_fullscreen.png',
  portfolioMain: '/assets/enhanced/portfolio_main.png',
  portfolioHerosPath: '/assets/enhanced/portfolio_herospath.png',
  portfolioCompendium: '/assets/enhanced/portfolio_compendium.png',
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
    'Artificial Intelligence Engineering student at Arab International University building full-stack web apps, Android mobile games, and technical content.',
  summaryPoints: [
    {
      label: 'Full-Stack & Mobile Development',
      text: 'Build interactive, real-time web apps and Android mobile games from concept to deployment using React, TypeScript, Python (FastAPI), and Flutter/Dart.',
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
        'Built mobile game state and UI interactions for Fraud Check on Android.',
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
      yearsOrContext: 'Android Mobile',
      evidence:
        'Engineered Fraud Check end-to-end with Flutter for smooth Android mobile gameplay.',
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
      title: 'Top 100',
      subtitle: 'Multiplayer Web Trivia Game',
      category: 'Full-Stack Web',
      year: 'Present',
      description:
        'Interactive multiplayer browser trivia game where teams compete across ranked categories to guess entries and earn higher scores for lower-ranked answers.',
      highlights: [
        'Built Single Round, Multi-Round, and Boss Rush modes with live turn timers, team scoreboards, and online multiplayer lobbies supporting room codes for up to 8 teams.',
        'Architected a responsive React and TypeScript frontend paired with an asynchronous Python and FastAPI backend for room state, guess validation, and live ranking.',
      ],
      technologies: ['React', 'TypeScript', 'Python', 'FastAPI'],
      repoUrl: 'https://github.com/Mohammad-kanj/Top-100-Game-',
      image: ASSETS.top100Menu,
      mediaOrientation: 'landscape',
      gallery: [
        { src: ASSETS.top100Menu, caption: 'Main Menu' },
        { src: ASSETS.top100Gameplay, caption: 'Gameplay' },
        { src: ASSETS.top100Setup, caption: 'Match Setup' },
        { src: ASSETS.top100Online, caption: 'Online Lobby' },
        { src: ASSETS.top100Teams, caption: 'Team Setup' },
        { src: ASSETS.top100Dealing, caption: 'Round Transition' },
      ],
      isPlaceholder: false,
    },
    {
      id: 'fraud-check',
      title: 'Fraud Check',
      subtitle: 'Social Deduction Game',
      category: 'Mobile App',
      year: 'Present',
      description:
        'English-language multiplayer social deduction party game where players ask strategic questions to expose the fraud who does not know the secret word.',
      highlights: [
        'Designed 4 playable game modes (Classic, Two Frauds, Undercover, and Chaos) for 3–10 players across a variety of categories.',
        'Implemented entirely with Flutter and Dart for smooth mobile performance on Android.',
      ],
      technologies: ['Flutter', 'Dart', 'Android'],
      repoUrl: 'https://github.com/Mohammad-kanj/Fraud-Check',
      image: ASSETS.fraudCheckTitle,
      mediaOrientation: 'portrait',
      gallery: [
        { src: ASSETS.fraudCheckTitle, caption: 'Title Screen' },
        { src: ASSETS.fraudCheckModes, caption: 'Game Modes' },
        { src: ASSETS.fraudCheckCategories, caption: 'Category Selection' },
        { src: ASSETS.fraudCheckPlayers, caption: 'Player Lobby' },
      ],
      isPlaceholder: false,
    },
    {
      id: 'hyrule-resume',
      title: 'Personal Portfolio',
      subtitle: 'Breath of the Wild Interactive Resume',
      category: 'Full-Stack Web',
      year: '2026',
      description:
        'Personal resume and portfolio website modeled after the Breath of the Wild main menu, featuring an expanding Sheikah Slate workspace, Skill Tree, collectible Borok medallions, and Hero’s Path timeline.',
      highlights: [
        'Built with React, TypeScript, and Tailwind CSS with responsive single-container transitions and an ATS print resume.',
      ],
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      repoUrl: 'https://github.com/Mohammad-kanj/The-Bandana-Compendium',
      image: ASSETS.portfolioMain,
      mediaOrientation: 'landscape',
      gallery: [
        { src: ASSETS.portfolioMain, caption: 'Main Menu' },
        { src: ASSETS.portfolioHerosPath, caption: "Hero's Path" },
        { src: ASSETS.portfolioCompendium, caption: 'Secret Compendium' },
      ],
      isPlaceholder: false,
    },
    {
      id: 'family-feud-control-board',
      title: 'Family Feud Control Board',
      subtitle: 'Live Game Show Host Console',
      category: 'Full-Stack Web',
      year: '2026',
      description:
        'Interactive host control board and live presentation display for running Family Feud games with face-offs, instant answer reveals, strike & steal mechanics, sound cues, and team score tracking.',
      highlights: [
        'Built full Host Controls with Intro, Outro, and Applause audio triggers, live answer matching, strike tracking, steal scoring, and round/game progression.',
        'Includes a dedicated Fullscreen audience display mode for clean big-screen presentation without exposing host controls.',
      ],
      technologies: ['React', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
      repoUrl: 'https://github.com/Mohammad-kanj/family-fued-game',
      image: ASSETS.familyFeudFullscreen,
      mediaOrientation: 'landscape',
      gallery: [
        { src: ASSETS.familyFeudFullscreen, caption: 'Fullscreen Display' },
        { src: ASSETS.familyFeudRevealed, caption: 'Revealed Board' },
        { src: ASSETS.familyFeudSteal, caption: 'Round Steal' },
      ],
      isPlaceholder: false,
    },
    {
      id: 'internet-speed-tester-banet',
      title: 'Banet',
      subtitle: 'Internet Troubleshooting',
      category: 'AI & Systems',
      year: '2026',
      description:
        'Local zero-config network monitor and speed benchmark app measuring live latency, RFC 3550 jitter, packet loss, interface throughput, and historical connection quality in real time.',
      highlights: [
        'Built a Live HUD streaming continuous ping, jitter, packet loss, and download/upload adapter I/O across selectable edge targets (Cloudflare, Google, Quad9, and local router).',
        'Added full speed benchmarks with Gaming, Streaming, Video Call, and Bufferbloat grades plus filterable Analytics charts, history records, and CSV/JSON export.',
      ],
      technologies: ['Python', 'Networking', 'Web UI'],
      repoUrl: 'https://github.com/Mohammad-kanj/banet-network-dashboard',
      image: ASSETS.banetLiveHud,
      mediaOrientation: 'landscape',
      gallery: [
        { src: ASSETS.banetLiveHud, caption: 'Live HUD' },
        { src: ASSETS.banetSpeedTest, caption: 'Speed Test' },
        { src: ASSETS.banetAnalytics, caption: 'Analytics' },
        { src: ASSETS.banetHistory, caption: 'Speed Test History' },
      ],
      isPlaceholder: false,
    },
    {
      id: 'krillion-leaderboard',
      title: 'Krillion Leaderboard',
      subtitle: 'Web App',
      category: 'Full-Stack Web',
      year: '2026',
      description:
        'Mobile-first deep-sea themed web leaderboard built for tracking daily Krillion trivia dives, medal standings, dive depth scores, and player lifetime statistics.',
      highlights: [
        'Supports 5 ranking views (Highest Score, Daily Score, Highest Average, Lowest Score, and One in a Krillion) with live score submission and persistent player profiles.',
        'Designed with a clean mobile-first interface featuring bottom-tab navigation across Boards, Submit, and Players views.',
      ],
      technologies: ['Python', 'SQL', 'Web UI', 'PythonAnywhere'],
      repoUrl: 'https://github.com/Mohammad-kanj/Krillion-Leaderboard',
      image: ASSETS.krillionBoards,
      mediaOrientation: 'portrait',
      gallery: [
        { src: ASSETS.krillionBoards, caption: 'Leaderboard' },
        { src: ASSETS.krillionSubmit, caption: 'Submit Score' },
        { src: ASSETS.krillionPlayers, caption: 'Players' },
        { src: ASSETS.krillionFilters, caption: 'Board Filters' },
      ],
      isPlaceholder: false,
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
