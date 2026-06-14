import type { APIRoute } from "astro";
import { buildLlmsFullTxt } from "@/lib/llms.ts";

export const GET: APIRoute = async () => {
  return new Response(await buildLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
