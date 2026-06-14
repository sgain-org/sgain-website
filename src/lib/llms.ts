// biome-ignore lint/correctness/noUnresolvedImports: `astro:content` is an Astro virtual module (types live in the biome-excluded .astro/ dir)
import { getCollection } from "astro:content";
import { makeUrl } from "@/lib/site.ts";

type Url = (path: string) => string;

export const PROJECT_TITLE =
  "SGAIN — Sustainability Governance of China's Global Infrastructure Investments";

export const PROJECT_SUMMARY =
  "A UKRI Future Leaders Fellowship research project at the University of Bath, led by Dr Yixian Sun, studying how China's overseas infrastructure investments shape sustainability and environmental governance across the Global South.";

export const PROJECT_INTRO = `Sustainability Governance of China's Global Infrastructure Investments (SGAIN) is a £1.7 million, seven-year research programme awarded to Dr Yixian Sun at the University of Bath by the UKRI Future Leaders Fellowship. It integrates innovative mixed methods to assess China's efforts to promote green development through overseas infrastructure investments, and the environmental and social impacts of key Chinese projects across different host contexts in the Global South.

The team brings together researchers in international relations, environmental governance and development studies based at Fudan University (China), Universitas Gadjah Mada (Indonesia), University of Dhaka (Bangladesh), Sustainable Development Policy Institute (Pakistan) and the National University of Singapore.`;

type Page = {
  title: string;
  url: string;
  description: string;
};

function staticPages(url: Url): Page[] {
  return [
    {
      title: "Home",
      url: url("/"),
      description: "Project overview and recent updates.",
    },
    {
      title: "Research",
      url: url("/research/"),
      description:
        "The project's rationale and methodology, its three key research questions and our strategic approach to answering them.",
    },
    {
      title: "Team",
      url: url("/team/"),
      description:
        "The SGAIN project team, including members from around the globe and their affiliations and research areas.",
    },
    {
      title: "Advisory Board",
      url: url("/advisory-board/"),
      description:
        "The distinguished advisors guiding the project across sustainability governance, climate policy and global development.",
    },
    {
      title: "International Partners",
      url: url("/international-partners/"),
      description:
        "The project's international partners and collaborators across Indonesia, China, Bangladesh, Pakistan and beyond.",
    },
    {
      title: "Publications",
      url: url("/publications/"),
      description:
        "Index of the SGAIN team's academic and non-academic publications and policy outputs.",
    },
    {
      title: "Articles and Book Chapters",
      url: url("/articles-and-book-chapters/"),
      description:
        "The most recent peer-reviewed articles and book chapters from members of the team.",
    },
    {
      title: "Non-Academic Publications",
      url: url("/non-academic-publications/"),
      description: "Op-eds, commentary and other non-academic writing by SGAIN team members.",
    },
    {
      title: "Policy Briefs and Reports",
      url: url("/policy-briefs-and-reports/"),
      description:
        "The SGAIN policy brief and report series — all open access and shared on the website.",
    },
    {
      title: "CGEL Database",
      url: url("/cgel-database/"),
      description:
        "China's Global Environmental Leadership (CGEL) Database — granular data on cross-border environmental governance initiatives led by Chinese state and non-state actors.",
    },
    {
      title: "Multimedia",
      url: url("/multimedia/"),
      description:
        "Conference coverage and interviews, including videos from the 2025 Bath Conference and recent media appearances.",
    },
    {
      title: "News & Events",
      url: url("/news/"),
      description: "Updates about SGAIN and events attended by team members.",
    },
    {
      title: "Blog",
      url: url("/blog/"),
      description: "Reflections and field notes from the SGAIN team and research assistants.",
    },
    {
      title: "Contact",
      url: url("/contact-information/"),
      description: "Contact form, email and social media for the SGAIN Project.",
    },
  ];
}

type Item = {
  title: string;
  url: string;
  description: string;
  body: string;
};

const slugOf = (id: string): string => id.replace(/\.md$/, "");

const stripTitleSuffix = (title: string): string =>
  title.replace(/\s*\|\s*SGAIN Project\s*$/, "").trim();

export function cleanText(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h[1-6]|li|div|figure|figcaption|blockquote)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#39;/g, "'")
    .replace(/&#34;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/^[ \t]+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function getPublications(url: Url): Promise<Item[]> {
  const entries = await getCollection("publications");
  return entries
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((entry) => ({
      title: stripTitleSuffix(entry.data.title),
      url: url(`/publications/${slugOf(entry.id)}/`),
      description: entry.data.description,
      body: entry.body ?? "",
    }));
}

export async function getBlog(url: Url): Promise<Item[]> {
  const entries = await getCollection("blog");
  return entries
    .sort((a, b) => b.data.date.localeCompare(a.data.date))
    .map((entry) => ({
      title: stripTitleSuffix(entry.data.title),
      url: url(`/blog/${slugOf(entry.id)}/`),
      description: [entry.data.author, entry.data.date].filter(Boolean).join(" · "),
      body: entry.body ?? "",
    }));
}

export async function getNews(url: Url): Promise<{ current: Item[]; archive: Item[] }> {
  const entries = await getCollection("news");
  const toItem = (entry: (typeof entries)[number]): Item => {
    const displayDate = entry.data.displayDate ?? "";
    const year = entry.data.year ? String(entry.data.year) : "";
    const description =
      year && !displayDate.includes(year) ? `${displayDate} ${year}`.trim() : displayDate || year;
    return {
      title: stripTitleSuffix(entry.data.title),
      url: url(`/news/${slugOf(entry.id)}/`),
      description,
      body: entry.body ?? "",
    };
  };

  const current = entries
    .filter((entry) => entry.data.type === "post")
    .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
    .map(toItem);

  const archive = entries
    .filter((entry) => entry.data.type === "archived")
    .sort(
      (a, b) =>
        (b.data.year ?? 0) - (a.data.year ?? 0) || (b.data.order ?? 0) - (a.data.order ?? 0),
    )
    .map(toItem);

  return { current, archive };
}

const oneLine = (text: string): string =>
  text
    .replace(/\\[nrt]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function linkLine({ title, url, description }: Page | Item): string {
  const desc = oneLine(description);
  return desc ? `- [${oneLine(title)}](${url}): ${desc}` : `- [${oneLine(title)}](${url})`;
}

function section(heading: string, lines: string[]): string {
  return [`## ${heading}`, ...lines].join("\n");
}

export async function buildLlmsTxt(site: URL | undefined): Promise<string> {
  const url = makeUrl(site);
  const [publications, blog, news] = await Promise.all([
    getPublications(url),
    getBlog(url),
    getNews(url),
  ]);

  const blocks = [
    `# ${PROJECT_TITLE}`,
    `> ${PROJECT_SUMMARY}`,
    PROJECT_INTRO,
    section("Pages", staticPages(url).map(linkLine)),
    section("Publications", publications.map(linkLine)),
    section("Blog", blog.map(linkLine)),
    section("News", news.current.map(linkLine)),
    section("News archive", news.archive.map(linkLine)),
  ];

  return `${blocks.join("\n\n")}\n`;
}

function fullEntry(item: Item): string {
  const lines = [`### ${oneLine(item.title)}`, `Source: ${item.url}`];
  const desc = oneLine(item.description);
  if (desc) {
    lines.push(desc);
  }
  const body = cleanText(item.body);
  if (body) {
    lines.push("", body);
  }
  return lines.join("\n");
}

function fullSection(heading: string, items: Item[]): string {
  return [`## ${heading}`, ...items.map(fullEntry)].join("\n\n");
}

export async function buildLlmsFullTxt(site: URL | undefined): Promise<string> {
  const url = makeUrl(site);
  const [publications, blog, news] = await Promise.all([
    getPublications(url),
    getBlog(url),
    getNews(url),
  ]);

  const blocks = [
    `# ${PROJECT_TITLE}`,
    `> ${PROJECT_SUMMARY}`,
    PROJECT_INTRO,
    fullSection("Publications", publications),
    fullSection("Blog", blog),
    fullSection("News", news.current),
    fullSection("News archive", news.archive),
  ];

  return `${blocks.join("\n\n")}\n`;
}
