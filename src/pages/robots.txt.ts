import type { APIRoute } from "astro";
import { makeUrl } from "@/lib/site.ts";

export const GET: APIRoute = ({ site }) => {
  const url = makeUrl(site);
  const body = `User-agent: *
Allow: /

Sitemap: ${url("/sitemap-index.xml")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
