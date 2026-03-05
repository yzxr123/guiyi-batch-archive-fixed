import { defineCollection, z } from "astro:content";

const site = defineCollection({
  type: "data",
  schema: z.object({
    allianceName: z.string(),
    slogan: z.string(),
    intro: z.string(),
    logoPath: z.string().default("/assets/logo.png"),
    capabilities: z.array(
      z.object({
        title: z.string(),
        items: z.array(z.string()),
      })
    ).default([]),
  }),
});

const studios = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    focus: z.string(),
    order: z.number().int().default(100),
    isPublic: z.boolean().default(true),
  }),
});

// YAML frontmatter may parse YYYY-MM-DD into a Date object.
// Accept both Date and string to be robust (Decap CMS / manual edits).
const dateLike = z.union([z.string(), z.date()]);

const evidenceItem = z.object({
  kind: z.enum(["image", "text"]).default("image"),
  date: dateLike, // YYYY-MM-DD or Date
  group: z.string(),
  title: z.string().optional(),
  note: z.string().optional(),
  image: z.string().optional(),
  body: z.string().optional(),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    studio: z.string(), // studio slug (filename)
    type: z.string().optional(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    created: dateLike,
    updated: dateLike,
    isPublic: z.boolean().default(true),
    pinned: z.boolean().default(false),
    proofStatement: z.string(),
    techNotes: z.string().optional(),
    evidence: z.array(evidenceItem).default([]),
  }),
});

export const collections = { site, studios, projects };
