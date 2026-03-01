import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false)
  })
});

const thoughts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/thoughts' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    mood: z.string().optional()
  })
});

const resume = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/resume' }),
  schema: z.object({
    title: z.string(),
    lastUpdated: z.coerce.date()
  })
});

export const collections = { blog, thoughts, resume };
