import { chromium } from "playwright";
import * as cheerio from "cheerio";
import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITEMAP_URL = "https://old.sgain.org/sitemap.xml";

const here = path.dirname(fileURLToPath(import.meta.url));
const sitemapPath = path.join(here, "sitemap.xml");
const htmlDir = path.join(here, "migration/html");

console.log(`Fetching sitemap from ${SITEMAP_URL}`);
const sitemapResponse = await fetch(SITEMAP_URL);
if (!sitemapResponse.ok) {
  throw new Error(
    `Failed to fetch sitemap: ${sitemapResponse.status} ${sitemapResponse.statusText}`,
  );
}
const sitemap = await sitemapResponse.text();
await fs.writeFile(sitemapPath, sitemap);

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
  throw new Error(`No URLs found in ${SITEMAP_URL}`);
}

console.log(`Found ${urls.length} URLs in sitemap`);

const browser = await chromium.launch();
const page = await browser.newPage();
page.setDefaultNavigationTimeout(60_000);

await fs.emptyDir(htmlDir);

const failed: Array<{ url: string; error: string }> = [];

for (const [index, url] of urls.entries()) {
  try {
    console.log(`[${index + 1}/${urls.length}] Crawling ${url}`);
    await page.goto(url, { waitUntil: "networkidle" });

    const html = await page.content();
    const $ = cheerio.load(html);

    $("script, style, noscript").remove();

    const pathname = new URL(url).pathname.replace(/^\/|\/$/g, "") || "index";
    const filename = pathname.replaceAll("/", "__");

    await fs.writeFile(path.join(htmlDir, `${filename}.html`), $.html());
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
  console.log(`Done. Wrote HTML to ${htmlDir}`);
}
