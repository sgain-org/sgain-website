// biome-ignore lint/correctness/noUnresolvedImports: astro:content is a virtual module resolved by Astro at build time
import { getCollection, render } from "astro:content";

export type TeamSectionId = "bath" | "partners" | "advisory" | "alumni";
export type TeamGroupId = "bath" | "causal-map" | "indonesia" | "china" | "bangladesh" | "pakistan";

export type TeamAsset = {
  src: string;
  alt: string;
};

/** Load every team member with its rendered markdown body. */
export const loadTeamMembers = async () =>
  Promise.all(
    (await getCollection("team")).map(async (entry) => {
      const { Content } = await render(entry);
      return { ...entry, Content };
    }),
  );

export type TeamMember = Awaited<ReturnType<typeof loadTeamMembers>>[number];

export type TeamGroup = {
  id: string;
  title?: string;
  asset?: TeamAsset;
  members: TeamMember[];
};

export type TeamSectionData = {
  id: string;
  title?: string;
  asset?: TeamAsset;
  groups: TeamGroup[];
};

const compareMembers = (first: TeamMember, second: TeamMember) => {
  if (first.data.order !== second.data.order) {
    return first.data.order - second.data.order;
  }

  return first.data.name.localeCompare(second.data.name);
};

/** Members in a section (optionally a group), sorted by order then name. */
export const selectMembers = (members: TeamMember[], section: TeamSectionId, group?: TeamGroupId) =>
  members
    .filter(
      (member) => member.data.section === section && (group ? member.data.group === group : true),
    )
    .sort(compareMembers);

/** Drop groups that have no members. */
export const withMembers = (groups: TeamGroup[]) =>
  groups.filter((group) => group.members.length > 0);
