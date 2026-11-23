export type ProjectCategory =
  | "All"
  | "Outreach"
  | "Infrastructure"
  | "Discipleship";

export interface ProjectMilestone {
  label: string;
  completed: boolean;
}

export interface ProjectGalleryItem {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectItem {
  slug: string;
  code: string;
  title: string;
  category: Exclude<ProjectCategory, "All">;
  status: "Active" | "In Progress" | "Ongoing";
  location: string;
  timeline: string;
  bannerImage: string;
  bannerAlt: string;
  summary: string;
  about: string[];
  purpose: {
    heading: string;
    description: string;
    objectives: string[];
  };
  progress: {
    percentage: number;
    raisedLabel: string;
    goalLabel: string;
    supportersCount: number;
    milestones: ProjectMilestone[];
  };
  gallery: ProjectGalleryItem[];
}

export const projectCategories: ProjectCategory[] = [
  "All",
  "Outreach",
  "Infrastructure",
  "Discipleship",
];

export const projectsData: ProjectItem[] = [
  {
    slug: "kudenda-community-outreach",
    code: "PRJ-01",
    title: "Kudenda Neighborhood Care & Relief",
    category: "Outreach",
    status: "Ongoing",
    location: "Kudenda, Kaduna",
    timeline: "Monthly Distribution · 2026",
    bannerImage: "/hero.avif",
    bannerAlt: "Community members gathering during Kudenda outreach",
    summary:
      "Monthly food drives, family support parcels, and practical community care for households across Kudenda and surrounding wards.",
    about: [
      "Kudenda Neighborhood Care & Relief was launched to respond consistently to the everyday needs of families within our immediate community in Kudenda, Kaduna.",
      "Every month, volunteers assemble staple food packs, household essentials, and basic healthcare kits, working alongside local community leaders to ensure parcels reach widows, elderly residents, and vulnerable households with dignity.",
    ],
    purpose: {
      heading: "Why this initiative matters",
      description:
        "True fellowship extends beyond Sunday walls. Our goal is to demonstrate tangible love and stability for neighbors facing economic pressure.",
      objectives: [
        "Distribute 120+ monthly household food and hygiene parcels across Kudenda.",
        "Build lasting relationships with local families through consistent follow-up visits.",
        "Mobilize church members and partners to serve hands-on every Saturday.",
      ],
    },
    progress: {
      percentage: 74,
      raisedLabel: "₦1,850,000",
      goalLabel: "₦2,500,000",
      supportersCount: 48,
      milestones: [
        {
          label: "Q1 & Q2 household relief distributions completed",
          completed: true,
        },
        {
          label: "Local storage & logistics hub set up in Kudenda",
          completed: true,
        },
        { label: "Q4 festive family care drive", completed: false },
      ],
    },
    gallery: [
      {
        src: "/hero.avif",
        alt: "Volunteers preparing community outreach parcels",
        caption: "Saturday morning packing and volunteer briefing in Kudenda.",
      },
      {
        src: "/belief.avif",
        alt: "Fellowship and community engagement",
        caption:
          "Connecting with families and community elders during distribution.",
      },
      {
        src: "/opengraph.webp",
        alt: "Church family gathered after outreach",
        caption:
          "Post-outreach prayer and thanksgiving with the volunteer team.",
      },
    ],
  },
  {
    slug: "sanctuary-media-acoustic-upgrade",
    code: "PRJ-02",
    title: "Gathering Space & Media Readiness",
    category: "Infrastructure",
    status: "In Progress",
    location: "Kudenda, Kaduna",
    timeline: "Phase 2 · Q4 2026",
    bannerImage: "/belief.avif",
    bannerAlt: "Main gathering space and audio setup",
    summary:
      "Improving seating comfort, acoustic clarity, and audio-visual reliability for Wednesday, Saturday, and Sunday gatherings.",
    about: [
      "As attendance across our Wednesday, Saturday, and Sunday 9:00 AM gatherings continues to grow, upgrading our physical space has become essential.",
      "This project covers acoustic treatment, durable ergonomic seating, backup power stability, and clean livestream audio capture so everyone—both in the room and joining remotely—can engage without distraction.",
    ],
    purpose: {
      heading: "Creating an unhindered worship & teaching environment",
      description:
        "Every technical and seating improvement serves one purpose: helping people focus clearly on worship, scripture, and fellowship.",
      objectives: [
        "Install full-room acoustic dampening and upgraded stage monitors.",
        "Add 150 additional comfortable seats for Sunday morning overflow.",
        "Deploy reliable solar-hybrid backup power for uninterrupted services.",
      ],
    },
    progress: {
      percentage: 62,
      raisedLabel: "₦3,100,000",
      goalLabel: "₦5,000,000",
      supportersCount: 63,
      milestones: [
        {
          label: "Front-of-house sound console & microphones installed",
          completed: true,
        },
        { label: "Acoustic wall panels fabricated", completed: true },
        {
          label: "Overflow seating & backup inverter installation",
          completed: false,
        },
      ],
    },
    gallery: [
      {
        src: "/belief.avif",
        alt: "Sanctuary acoustic and lighting layout",
        caption: "Main auditorium layout during Sunday 9:00 AM preparation.",
      },
      {
        src: "/hero.avif",
        alt: "Congregation gathered in the upgraded space",
        caption: "Worship and word session with improved sound coverage.",
      },
      {
        src: "/opengraph.webp",
        alt: "Media and hospitality team setup",
        caption: "Media desk and welcome team station at the entrance.",
      },
    ],
  },
  {
    slug: "nextgen-mentorship-hub",
    code: "PRJ-03",
    title: "Youth & Young Adults Mentorship",
    category: "Discipleship",
    status: "Active",
    location: "Kaduna",
    timeline: "Weekly Cohort · Ongoing",
    bannerImage: "/opengraph.webp",
    bannerAlt: "Young adults in a mentorship and study session",
    summary:
      "Weekly small-group mentorship, practical life skills, and scripture study designed to equip young believers and students.",
    about: [
      "The Youth & Young Adults Mentorship Hub pairs secondary school students, undergraduates, and early-career professionals with grounded mentors in our church family.",
      "Sessions blend honest Bible study with career guidance, digital literacy workshops, and peer accountability.",
    ],
    purpose: {
      heading: "Raising grounded, purposeful young leaders",
      description:
        "Young people in Kaduna face pivotal academic and career transitions. We want them rooted in faith and equipped for everyday life.",
      objectives: [
        "Run weekly small-group discipleship circles every Saturday.",
        "Host quarterly career, coding, and entrepreneurship clinics.",
        "Provide study materials and mentorship pairing for 80+ youth.",
      ],
    },
    progress: {
      percentage: 85,
      raisedLabel: "₦1,020,000",
      goalLabel: "₦1,200,000",
      supportersCount: 34,
      milestones: [
        { label: "Curriculum & mentor handbook published", completed: true },
        {
          label: "3 active Saturday mentorship cohorts running",
          completed: true,
        },
        { label: "End-of-year youth retreat sponsorship", completed: false },
      ],
    },
    gallery: [
      {
        src: "/opengraph.webp",
        alt: "Saturday youth mentorship circle",
        caption: "Saturday morning breakout discussion and scripture study.",
      },
      {
        src: "/hero.avif",
        alt: "Young adults serving during Sunday gathering",
        caption: "Cohort members serving across hospitality and media teams.",
      },
      {
        src: "/belief.avif",
        alt: "Workshop and Q&A session",
        caption: "Interactive career and faith Q&A session.",
      },
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  return projectsData.find((project) => project.slug === slug);
}
