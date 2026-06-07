/** Entry `id` -> public URL slug. Content is filed under `<year>/`, but URLs stay flat. */
export const entrySlug = (id: string): string => id.replace(/\.md$/, "").replace(/^\d{4}\//, "");
