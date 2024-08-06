import { defineCollection, z } from 'astro:content'

export const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
  }),
})
