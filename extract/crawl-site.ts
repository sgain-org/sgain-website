// scripts/crawl-site.ts
import { chromium } from "playwright";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const sitemapPath = path.join(here, "sitemap.xml");
const htmlDir = path.join(here, "migration/html");
const mdDir = path.join(here, "migration/md");
const turndown = new TurndownService();

const sitemap = await fs.readFile(sitemapPath, "utf8");
const $sitemap = cheerio.load(sitemap, { xmlMode: true });
const urls = [
  ...new Set(
    $sitemap("url > loc")
      .map((_, element) => $sitemap(element).text().trim())
      .get()
      .filter(Boolean),
  ),
];

if (urls.length === 0) {
  throw new Error(`No URLs found in ${sitemapPath}`);
}

console.log(`Found ${urls.length} URLs in ${sitemapPath}`);

const browser = await chromium.launch();
const page = await browser.newPage();
page.setDefaultNavigationTimeout(60_000);

await fs.ensureDir(htmlDir);
await fs.ensureDir(mdDir);

const failed: Array<{ url: string; error: string }> = [];

for (const [index, url] of urls.entries()) {
  try {
    console.log(`[${index + 1}/${urls.length}] Crawling ${url}`);
    await page.goto(url, { waitUntil: "networkidle" });

    const html = await page.content();
    const $ = cheerio.load(html);

    $("script, style, noscript, svg").remove();

    const title =
      $("meta[property='og:title']").attr("content") ||
      $("h1").first().text().trim() ||
      $("title").text().trim();

    const description =
      $("meta[name='description']").attr("content") ||
      $("meta[property='og:description']").attr("content") ||
      "";

    const mainHtml =
      $("main").html() ||
      $("article").html() ||
      $("body").html() ||
      "";

    const markdown = turndown.turndown(mainHtml);

    const pathname = new URL(url).pathname.replace(/^\/|\/$/g, "") || "index";
    const filename = pathname.replaceAll("/", "__");

    await fs.writeFile(path.join(htmlDir, `${filename}.html`), html);

    await fs.writeFile(
      path.join(mdDir, `${filename}.md`),
      `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\noldUrl: ${JSON.stringify(url)}\n---\n\n${markdown}\n`,
    );
  } catch (error) {
    failed.push({
      url,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

await browser.close();

if (failed.length > 0) {
  console.error(`Failed to crawl ${failed.length} URLs:`);
  for (const failure of failed) {
    console.error(`- ${failure.url}: ${failure.error}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Done. Wrote HTML to ${htmlDir} and Markdown to ${mdDir}`);
}
