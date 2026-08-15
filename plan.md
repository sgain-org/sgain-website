# Plan: derive blog reading time instead of hand-writing it

Replace the hand-maintained `readingTime` frontmatter field on the 8 blog posts with a
value computed at build time, following the intent of
<https://docs.astro.build/en/recipes/reading-time/>.

---

## 1. Why the current WIP doesn't work

Three separate problems in the uncommitted changes:

1. **Wrong import path.** `astro.config.mjs` imports `./remark-reading-time.mjs`, but the
   file is at `plugins/remark-reading-time.mjs`.
2. **`unified` is imported and never used.** `import { unified } from "@astrojs/markdown-remark"`
   is a real export, but nothing consumes it — the config still calls `satteri()`.
3. **The plugin is passed to the wrong hook, in the wrong shape.** `remarkReadingTime` is a
   unified transformer `(tree, file) => void`. It's being handed to satteri's `hastPlugins`,
   which expects a visitor *object* (`{ name, element: { filter, visit } }` — the shape
   `externalLinksPlugin` already uses). Satteri would silently subscribe to nothing.

Fixing (1) and (2) will not make (3) work. The recipe is written for a pipeline this project
no longer uses.

## 2. Root cause: Astro 7 swapped the Markdown engine

Verified against the installed packages:

- `astro@7.1.3` defaults `markdown.processor` to `satteri()` — see
  `node_modules/astro/dist/types/public/config.d.ts:2323`.
- `markdown.remarkPlugins` / `markdown.rehypePlugins` are **deprecated** in Astro 7
  ("Will be removed in a future major", same file, lines 2231–2264).
- `@astrojs/markdown-remark@7.2.2` still ships and still exports `unified()`, so the old
  remark/rehype pipeline is available — but only as an opt-in processor.
- Satteri is a native (Rust) parser. Its plugin API is **not** unified. From
  `satteri/dist/plugin.d.ts` and `mdast/mdast-visitor.d.ts`:
  - plugins are objects keyed by node type (`text`, `paragraph`, `heading`, `link`, …), each
    value a visitor function;
  - there is **no `root` visitor and no whole-tree hook** — you never get a `tree` to hand to
    `mdast-util-to-string`;
  - `ctx.data` is the per-document data bag, and `@astrojs/markdown-satteri` puts
    `data.astro.frontmatter` on it (module augmentation in `satteri-processor.d.ts`);
  - a plugin can be a *factory* (`() => MdastPluginDefinition`), "called once per compile so
    closures reset per document".

So the recipe's `data.astro.frontmatter.minutesRead = …` write target still exists — the
`(tree, { data })` signature to reach it does not.

## 3. Sätteri vs unified — the answer

| | Sätteri (current) | unified (`@astrojs/markdown-remark`) |
| --- | --- | --- |
| Status in Astro 7 | default processor | opt-in, legacy path |
| Reading-time plugin | must be rewritten as a visitor object | recipe works verbatim |
| Cost of switching | — | **`externalLinksPlugin` must be rewritten as a rehype plugin** (`unist-util-visit` walk) |
| Performance | native parser | JS unified pipeline |

**Do not switch to `unified`.** It buys one plugin working as-copied, at the cost of
rewriting the external-links plugin, giving up the native parser, and moving onto a code path
Astro has marked for removal. Stay on `satteri()`.

## 4. Recommended approach: skip the Markdown processor entirely

The strongest reason has nothing to do with satteri vs unified — it's the **listing page**.

[blog/index.astro:51](src/pages/blog/index.astro#L51) renders reading time on every card. Any
processor-plugin approach puts the value in `remarkPluginFrontmatter`, which is only reachable
via `await render(post)`. The listing would have to render all 8 posts just to print a label.

Reading time is a pure function of the raw Markdown body, and the body is already on the
entry — `.astro/content.d.ts:129` types every collection entry with `body?: string`. Compute it
in `src/lib/content.ts` next to `formatDate` and `byDateDesc`, and both pages get it from a
plain synchronous call with no `render()` and no processor coupling.

This also means the next time Astro changes Markdown engines, nothing here breaks.

**Verified**: counting the raw body (Markdown syntax and all) versus a syntax-stripped body
gives an *identical* result on all 8 posts, so no stripping step is needed.

## 5. Steps

1. **Revert the WIP config changes.** Restore `astro.config.mjs` to the committed version —
   both new imports and the `hastPlugins` change go away. (Step 3 then edits it again, for a
   different reason.)

2. **Trim the dependencies.** Keep `reading-time` (it ships its own `index.d.ts`). Drop the
   two that were only there for the unified recipe:

   ```sh
   pnpm remove @astrojs/markdown-remark mdast-util-to-string
   ```

3. **Move `externalLinksPlugin` out of `astro.config.mjs` into `plugins/`.** Delete
   `plugins/remark-reading-time.mjs` and create `plugins/external-links.ts` in its place, so
   the directory ends up holding the one plugin the project actually uses:

   ```ts
   // plugins/external-links.ts
   import type { SatteriProcessorOptions } from "@astrojs/markdown-satteri";
   import { isExternalHref } from "../src/lib/links.ts";

   type HastPlugin = NonNullable<SatteriProcessorOptions["hastPlugins"]>[number];

   /** Off-site links in Markdown get the same new-tab treatment as the components. */
   export const externalLinksPlugin: HastPlugin = {
     name: "external-links",
     element: {
       filter: ["a"],
       visit(node, ctx) {
         const href = node.properties?.href;
         if (typeof href === "string" && isExternalHref(href)) {
           ctx.setProperty(node, "target", "_blank");
           ctx.setProperty(node, "rel", "noopener noreferrer");
         }
       },
     },
   };
   ```

   `astro.config.mjs` then loses the whole `externalLinksPlugin` block and the
   `isExternalHref` import, and gains one line:

   ```js
   import { externalLinksPlugin } from "./plugins/external-links.ts";
   ```

   Four things that make this work, each verified against the installed setup:

   - **`.ts`, not `.mjs`.** `astro.config.mjs` already imports `./src/lib/links.ts` with an
     explicit extension, and `astro/tsconfigs/base.json` sets `allowImportingTsExtensions`.
     A `.ts` file gets a real type annotation instead of the JSDoc cast the config uses now,
     and `tsconfig.json` includes `**/*`, so `pnpm check` covers it.
   - **Derive the type from `@astrojs/markdown-satteri`, never import `satteri` directly.**
     `satteri` is a transitive dep and is *not* hoisted — there is no `node_modules/satteri`,
     so `import type { HastPluginDefinition } from "satteri"` will not resolve. Indexing into
     `SatteriProcessorOptions` (a direct dep) gets the identical type.
   - **Use a relative import for `isExternalHref`, not the `@/` alias.** The alias is a
     `tsconfig.json` path, and `astro.config.mjs` is loaded before the app's resolver is in
     play — the config already uses `./src/lib/links.ts` for exactly this reason.
   - **No `knip.jsonc` change needed.** knip treats `astro.config.mjs` as an entry and follows
     its imports — `pnpm unused` currently reports the broken `./remark-reading-time.mjs` as
     an *unresolved import at `astro.config.mjs:8`*, which only happens if it is walking that
     file. A resolvable `plugins/external-links.ts` will be reachable and won't be flagged.

4. **Add the helper** to [src/lib/content.ts](src/lib/content.ts), below `formatDate`:

   ```ts
   import getReadingTime from "reading-time";

   /** "4 min read" from the raw Markdown body. Syntax noise doesn't shift the estimate. */
   export const readingTime = (body: string | undefined): string | undefined =>
     body ? getReadingTime(body).text : undefined;
   ```

5. **Drop the schema field.** Remove `readingTime: z.string(),` from
   [src/content.config.ts:13](src/content.config.ts#L13).

6. **Strip `readingTime:` from all 8 post files.** The `blog` schema is `.strict()`, so a
   leftover line fails `pnpm check` rather than being ignored:

   ```text
   src/content/blog/2024/exploring-europe-reflections-on-the-globalgoals2024-summer-school-and-conference-utrecht-netherlands.md
   src/content/blog/2024/reflections-on-the-global-china-workshop-with-redefine-and-sgain.md
   src/content/blog/2024/researching-with-data-reflections-on-the-climbio-database-workshop-in-utrecht-netherlands.md
   src/content/blog/2025/china-and-the-global-sustainability-transition-reflecting-on-my-first-conference-experience.md
   src/content/blog/2025/mercy-mercy-me-things-aint-what-they-used-to-be-field-notes-from-purwakarta-west-java.md
   src/content/blog/2025/reflections-researching-global-china-conference-by-redefine.md
   src/content/blog/2025/where-is-the-local-community-fieldwork-reflections-on-chinas-involvement-in-indonesias-energy-transition-at-cirata-floating-solar-power-plant.md
   src/content/blog/2026/reflections-iscc-summer-placement.md
   ```

7. **Update the post page.** In [src/pages/blog/[slug].astro](src/pages/blog/[slug].astro),
   import `readingTime`, compute once in the frontmatter script, and swap the guard at
   [line 38](src/pages/blog/[slug].astro#L38):

   ```astro
   const minutesRead = readingTime(post.body);
   ---
   {minutesRead && <> · {minutesRead}</>}
   ```

8. **Update the listing page.** In [src/pages/blog/index.astro](src/pages/blog/index.astro),
   compute alongside the grouping rather than inline in the map, so it's called once per post:

   ```ts
   const postGroups = postYears.map((year) => ({
     year,
     posts: posts
       .filter((post) => entryYear(post.data.date) === year)
       .map((post) => ({ post, minutesRead: readingTime(post.body) })),
   }));
   ```

   Then destructure `{ post, minutesRead }` in the map and use `minutesRead` at
   [line 51](src/pages/blog/index.astro#L51).

9. **Update `AGENTS.md`.** Two additions to Conventions:
   - Near the ordering rules: blog reading time is derived from the body via `readingTime` in
     `src/lib/content.ts` — don't add a `readingTime` frontmatter field back (the `.strict()`
     schema will reject it anyway).
   - Near the "Source lives in `src/`" line: Markdown-processor plugins live in `plugins/`,
     typed off `@astrojs/markdown-satteri` rather than importing `satteri` directly.

10. **Verify**: `pnpm lint:fix && pnpm check && pnpm build && pnpm unused`, then spot-check
    `/blog/` and one post page. `pnpm unused` should come back clean — it currently reports
    the orphaned plugin file, both dead dependencies, and the broken config import.

## 6. Expected change to displayed values

The hand-written values were mostly a minute low. Computed with `reading-time`'s default
200 wpm:

| Post | Current | Computed | Words |
| --- | --- | --- | --- |
| 2024/exploring-europe-… | 4 min read | **5 min read** | 893 |
| 2024/reflections-on-the-global-china-workshop-… | 3 min read | **4 min read** | 618 |
| 2024/researching-with-data-… | 3 min read | **4 min read** | 652 |
| 2025/china-and-the-global-sustainability-transition-… | 4 min read | **6 min read** | 1028 |
| 2025/mercy-mercy-me-… | 3 min read | **4 min read** | 673 |
| 2025/reflections-researching-global-china-conference-… | 4 min read | **3 min read** | 526 |
| 2025/where-is-the-local-community-… | 4 min read | **5 min read** | 810 |
| 2026/reflections-iscc-summer-placement | 4 min read | **5 min read** | 985 |

Every post shifts. If the old numbers should be preserved, pass a `wordsPerMinute` option to
`getReadingTime` — but the computed values are the more defensible ones.

## 7. Alternative, if the value must live in `remarkPluginFrontmatter`

Only worth it if something outside the two blog pages needs it on the rendered result. This
is the recipe ported to satteri — **verified working** against `satteri@0.9.5`, including the
per-document reset:

```ts
// plugins/reading-time.ts
import type { SatteriProcessorOptions } from "@astrojs/markdown-satteri";
import getReadingTime from "reading-time";

type MdastPlugin = NonNullable<SatteriProcessorOptions["mdastPlugins"]>[number];

/**
 * Satteri has no whole-tree hook, so accumulate text as the walk visits it and rewrite the
 * frontmatter on each visit — the last write wins, and the object is read back after the
 * compile. Factory form, so the accumulator resets per document.
 */
export const readingTimePlugin = (): MdastPlugin => {
  let text = "";
  const collect: MdastPlugin["text"] = (node, ctx) => {
    text += `${node.value} `;
    const frontmatter = ctx.data.astro?.frontmatter;
    if (frontmatter) frontmatter.minutesRead = getReadingTime(text).text;
  };
  return { name: "reading-time", text: collect, inlineCode: collect };
};
```

```js
// astro.config.mjs
processor: satteri({
  mdastPlugins: [satteriReadingTime],   // note: mdastPlugins, not hastPlugins
  hastPlugins: [externalLinksPlugin],
}),
```

Read it with `const { remarkPluginFrontmatter } = await render(post)` →
`remarkPluginFrontmatter.minutesRead`.

Caveats, all of which are why this is the fallback and not the plan:

- The listing page needs `await Promise.all(posts.map(render))` to show it on cards.
- **The factory form doesn't type-check.** `SatteriProcessorOptions` declares
  `mdastPlugins?: MdastPluginDefinition[]`, while satteri's own `CompileOptions` accepts
  `MdastPluginInput[]` — definition *or* factory (`satteri/dist/compile.d.ts:124`). The
  wrapper's public type is narrower than what it forwards, so passing the factory works at
  runtime but fails `pnpm check`. It needs a cast, or a plugin object with a module-level
  accumulator that resets on some other signal.
- `getReadingTime` re-runs per text node — O(n²) in node count. Negligible at blog length,
  but it is a real cost that the `entry.body` approach doesn't have.
- `ctx.data.astro` only type-checks where the `@astrojs/markdown-satteri` module augmentation
  is loaded.
- Ties the feature to satteri's plugin API — the exact coupling that broke this the first time.

## 8. Don't

- Don't switch `markdown.processor` to `unified()` — it forces a rewrite of
  `externalLinksPlugin` onto a deprecated path.
- Don't use top-level `markdown.remarkPlugins` — deprecated in Astro 7, and it's ignored while
  a `processor` is set.
- Don't keep `readingTime` in the schema as `.optional()` "just in case". The `.strict()`
  schema is what stops the field drifting back in by hand.
