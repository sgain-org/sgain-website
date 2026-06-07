import { defineCollection } from "astro/content/config";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    oldUrl: z.string(),
    author: z.string(),
    date: z.string(),
    readingTime: z.string(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { blog };
