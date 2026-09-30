import type { CollectionConfig } from 'payload'
import { cover, httpURL, slug, tags, writes } from './shared'

export const Projects: CollectionConfig = {
  slug: 'projects', admin: { useAsTitle: 'title' },
  access: { read: ({ req }) => req.user ? true : { visible: { equals: true } }, ...writes },
  fields: [
    { name: 'title', type: 'text', required: true }, slug,
    { name: 'description', type: 'textarea', required: true }, cover,
    { name: 'category', type: 'select', options: ['web', 'mobile', 'desktop', 'other'], defaultValue: 'web' },
    { name: 'techStack', type: 'text', hasMany: true },
    { name: 'status', type: 'select', options: ['completed', 'in-progress', 'planned'], defaultValue: 'in-progress' },
    ...['liveDemo', 'sourceCode', 'visitUrl'].map((name) => ({ name, type: 'text' as const, validate: httpURL })),
    { name: 'startDate', type: 'date' }, { name: 'endDate', type: 'date' },
    { name: 'featured', type: 'checkbox', defaultValue: false }, tags,
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'visible', type: 'checkbox', defaultValue: true },
  ],
}
