// Astro Content
import { defineCollection } from "astro:content";
// Loaders
import { glob } from "astro/loaders";
// Zod
import { z } from "astro/zod";

// Define la colección blog con loader glob y schema Zod
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    ref_id: z.string(),       // ID único para relacionar traducciones ES↔EN
    title: z.string(),        // Título del post
    date: z.string(),         // Fecha de publicación (YYYY-MM-DD)
    description: z.string(),  // Descripción corta
    tags: z.array(z.string()),// Etiquetas del post
  }),
});

export const collections = { blog };
