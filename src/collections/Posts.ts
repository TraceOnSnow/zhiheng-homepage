import type { CollectionConfig } from 'payload'
import { cover, publishedRead, slug, tags, writes } from './shared'

export const Posts: CollectionConfig = {
  slug: 'posts', admin: { useAsTitle: 'title', defaultColumns: ['title', '_status', 'publishedAt'] },
  access: { read: publishedRead, ...writes },
  versions: { drafts: true, maxPerDoc: 30 },
  hooks: { beforeChange: [({ data }) => {
    if (data._status === 'published' && !data.publishedAt) data.publishedAt = new Date().toISOString()
    return data
  }] },
  fields: [
    { name: 'title', type: 'text', required: true }, slug,
    { name: 'excerpt', type: 'textarea' }, cover,
    { name: 'content', type: 'richText', required: true }, tags,
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'relatedWorks', type: 'relationship', relationTo: 'works', hasMany: true },
  ],
}
