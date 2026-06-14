import type { APIRoute } from "astro";
import { buildLlmsTxt } from "@/lib/llms.ts";

export const GET: APIRoute = async () => {
  return new Response(await buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
