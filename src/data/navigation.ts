export type IconName =
  | "research"
  | "database"
  | "team"
  | "partners"
  | "advisory"
  | "publications"
  | "articles"
  | "policy"
  | "nonAcademic"
  | "multimedia"
  | "news"
  | "conference"
  | "archive"
  | "blog";

type NavLink = {
  href: string;
  label: string;
  description: string;
  icon: IconName;
};

export type NavSection = {
  label: string;
  links: NavLink[];
};

export const homeLink = { href: "/", label: "Home" };
export const contactLink = { href: "/contact-information/", label: "Contact" };

export const navSections: NavSection[] = [
  {
    label: "Research",
    links: [
      {
        href: "/research/",
        label: "Research",
        description: "Our research programme and themes.",
        icon: "research",
      },
      {
        href: "/cgel-database/",
        label: "CGEL Database",
        description: "Explore the CGEL dataset.",
        icon: "database",
      },
    ],
  },
  {
    label: "Team",
    links: [
      {
        href: "/team/",
        label: "Team",
        description: "Meet the Bath-based research team.",
        icon: "team",
      },
      {
        href: "/international-partners/",
        label: "International Partners",
        description: "Our collaborating institutions worldwide.",
        icon: "partners",
      },
      {
        href: "/advisory-board/",
        label: "Advisory Board",
        description: "Experts guiding the project.",
        icon: "advisory",
      },
    ],
  },
  {
    label: "Publications",
    links: [
      {
        href: "/publications/",
        label: "Publications",
        description: "All research outputs.",
        icon: "publications",
      },
      {
        href: "/articles-and-book-chapters/",
        label: "Articles and Book Chapters",
        description: "Peer-reviewed academic work.",
        icon: "articles",
      },
      {
        href: "/policy-briefs-and-reports/",
        label: "Policy Briefs and Reports",
        description: "Applied research for policymakers.",
        icon: "policy",
      },
      {
        href: "/non-academic-publications/",
        label: "Non-Academic Publications",
        description: "Media, blogs and wider writing.",
        icon: "nonAcademic",
      },
      {
        href: "/multimedia/",
        label: "Multimedia",
        description: "Videos, talks and visual content.",
        icon: "multimedia",
      },
    ],
  },
  {
    label: "News & Events",
    links: [
      {
        href: "/news/",
        label: "News & Events",
        description: "Latest updates and upcoming events.",
        icon: "news",
      },
      {
        href: "/news/bath-conference-on-china-and-global-sustainability-transition/",
        label: "Bath Conference",
        description: "China & global sustainability transition.",
        icon: "conference",
      },
      {
        href: "/news/archive/",
        label: "Archive",
        description: "Past news and events by year.",
        icon: "archive",
      },
      {
        href: "/blog/",
        label: "Blog",
        description: "Reflections and field notes.",
        icon: "blog",
      },
    ],
  },
];
