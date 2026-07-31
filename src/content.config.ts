import { defineCollection } from "astro/content/config";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    author: z.string(),
    date: z.iso.date(),
    readingTime: z.string(),
    heroImage: z.string().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    type: z.enum(["page", "news"]).default("page"),
    // Sorts the listing and groups it by year. For a multi-day event, use the day it started.
    date: z.iso.date(),
    // Overrides the rendered date, for spans and approximations ("4-5 December 2024", "Spring 2026").
    displayDate: z.string().optional(),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    // Set on publications surfaced by the listing pages.
    category: z.enum(["article", "book-chapter", "non-academic", "policy-report"]).optional(),
    citation: z.string().optional(),
    summary: z.string().optional(),
    // Publication date, newest first on the listing pages.
    date: z.iso.date(),
    image: z.string().optional(),
    imageAlt: z.string().default(""),
    link: z.string().optional(),
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
  }),
});

export const collections = { blog, news, team, publications };
