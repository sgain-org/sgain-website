type Redirect = { from: string; to: string };

type SlugEntry = string | readonly [from: string, slug: string];

const buildRedirects = (prefix: string, slugs: readonly SlugEntry[]): Redirect[] =>
  slugs.map((entry) => {
    const [from, slug] = typeof entry === "string" ? [entry, entry] : entry;
    return { from, to: `${prefix}${slug}/` };
  });

const publicationSlugs = [
  "assessing-climate-ambition-through-policy-outputs-a-comparative-measure-of-35-major-emitters",
  "china-and-global-sustainability-transition-outlook-2025",
  "china-aspires-to-be-an-environmental-leader-how-should-the-rest-of-the-world-engage",
  [
    "climate-governance-in-china-a-multi-actor-perspective",
    "climate-governance-in-china-a-multiactor-perspective",
  ],
  "compound-path-dependence-in-green-transitions-a-comparative-analysis-of-ev-policy-coordination-in-indonesia-and-thailand",
  "dataset-development-in-earth-system-governance-learnings-stakes-and-pathways-for-impact",
  "environmental-governance-in-china",
  [
    "essential-concepts-for-implementing-the-sustainable-development-goals-an-a-z-guide",
    "essential-concepts-for-implementing-the-sustainable-development-goals-an-az-guide",
  ],
  "from-solar-boom-to-green-industrialization-policy-pathways-to-localizing-solar-value-chains-in-pakistan",
  "global-climate-governance-remains-resilient-under-trump-20",
  [
    "global-environmental-politics-amid-geopolitical-turbulence-copy",
    "global-environmental-politics-amid-geopolitical-turbulence",
  ],
  "how-can-the-world-engage-with-china-to-strengthen-global-environmental-governance",
  "how-much-has-bangladesh-achieved-from-bri",
  [
    "is-goal-setting-an-effective-strategy-for-global-sustainability-governance-insights-from-the-sustainable-development-goals-copy",
    "is-goalsetting-an-effective-strategy-for-global-sustainability-governance-insights-from-the-sustainable-development-goals",
  ],
  "steering-political-conflicts-for-climate-stability-the-case-of-china",
  "the-world-needs-climate-change-leadership-its-time-for-china-to-step-up",
  "towards-a-just-transition-integrating-fair-share-equity-and-justice-into-climate-transition-plans",
  [
    "unpacking-chinas-climate-policy-mixes-shows-a-disconnect-between-policy-density-and-intensity-in-the-post-paris-era",
    "unpacking-chinas-climate-policy-mixes-shows-a-disconnect-between-policy-density-and-intensity-in-the-postparis-era",
  ],
  [
    "varieties-of-local-implementation-for-net-zero-in-china-evidence-from-three-cities-copy",
    "varieties-of-local-implementation-for-net-zero-in-china-evidence-from-three-cities",
  ],
  "what-would-it-take-for-china-to-be-a-global-environmental-leader",
  "will-china-lead-the-way",
] as const satisfies readonly SlugEntry[];

const blogSlugs = [
  "china-and-the-global-sustainability-transition-reflecting-on-my-first-conference-experience",
  "exploring-europe-reflections-on-the-globalgoals2024-summer-school-and-conference-utrecht-netherlands",
  "mercy-mercy-me-things-aint-what-they-used-to-be-field-notes-from-purwakarta-west-java",
  "reflections-on-the-global-china-workshop-with-redefine-and-sgain",
  "reflections-researching-global-china-conference-by-redefine",
  "researching-with-data-reflections-on-the-climbio-database-workshop-in-utrecht-netherlands",
  "where-is-the-local-community-fieldwork-reflections-on-chinas-involvement-in-indonesias-energy-transition-at-cirata-floating-solar-power-plant",
] as const satisfies readonly SlugEntry[];

const newsSlugs = [
  "bath-conference-on-china-and-global-sustainability-transition",
] as const satisfies readonly SlugEntry[];

const pageRedirects: readonly Redirect[] = [
  { from: "academic-publications-and-policy-reports", to: "/articles-and-book-chapters/" },
  { from: "archive", to: "/news/archive/" },
  { from: "blogs", to: "/blog/" },
  { from: "network", to: "/international-partners/" },
  { from: "news-and-events", to: "/news/" },
];

export const redirects: readonly Redirect[] = [
  ...pageRedirects,
  ...buildRedirects("/publications/", publicationSlugs),
  ...buildRedirects("/blog/", blogSlugs),
  ...buildRedirects("/news/", newsSlugs),
];
