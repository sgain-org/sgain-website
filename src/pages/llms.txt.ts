import type { APIRoute } from "astro";
import { buildLlmsTxt } from "@/lib/llms.ts";

export const GET: APIRoute = async ({ site }) => {
  return new Response(await buildLlmsTxt(site), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
