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

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    oldUrl: z.string().optional(),
    type: z.enum(["page", "archive-index", "archived"]).default("page"),
    displayDate: z.string().optional(),
    year: z.number().int().optional(),
    order: z.number().int().positive().optional(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    section: z.enum(["bath", "partners", "advisory", "alumni"]),
    group: z
      .enum(["bath", "causal-map", "indonesia", "china", "bangladesh", "pakistan"])
      .optional(),
    order: z.number().int().positive(),
    profileUrl: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().default(""),
  }),
});

export const collections = { blog, news, team };
